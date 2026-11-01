/*
 * Copyright (c) 2022-2026 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.console.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.alibaba.higress.console.controller.exception.LoginRateLimitException;

class LoginFailureBudgetServiceTest {

    private static final LoginAttemptKey KEY = new LoginAttemptKey("admin", "192.0.2.10");

    private MutableClock clock;
    private InMemoryLoginAttemptStore store;
    private LoginFailureBudgetService service;

    @BeforeEach
    void setUp() {
        clock = new MutableClock(1_000_000L);
        store = new InMemoryLoginAttemptStore();
        service = createService(store, clock);
    }

    @Test
    void fifthFailureLocksImmediately() {
        for (int i = 0; i < 4; i++) {
            service.recordFailure(KEY);
        }
        assertDoesNotThrow(() -> service.checkActiveLock(KEY));

        LoginRateLimitException exception = assertThrows(LoginRateLimitException.class, () -> service.recordFailure(KEY));

        assertEquals(900, exception.getRetryAfterSeconds());
        assertEquals(5, store.get(KEY).getFailureCount());
        assertThrows(LoginRateLimitException.class, () -> service.checkActiveLock(KEY));
    }

    @Test
    void failureWindowStartsANewBudget() {
        for (int i = 0; i < 4; i++) {
            service.recordFailure(KEY);
        }
        clock.advanceSeconds(600);

        service.recordFailure(KEY);

        assertEquals(1, store.get(KEY).getFailureCount());
        for (int i = 0; i < 3; i++) {
            service.recordFailure(KEY);
        }
        assertThrows(LoginRateLimitException.class, () -> service.recordFailure(KEY));
    }

    @Test
    void lockExpiresAndRetryAfterRoundsUp() {
        for (int i = 0; i < 4; i++) {
            service.recordFailure(KEY);
        }
        assertThrows(LoginRateLimitException.class, () -> service.recordFailure(KEY));

        clock.advanceMillis(1500);
        LoginRateLimitException exception = assertThrows(LoginRateLimitException.class,
            () -> service.checkActiveLock(KEY));
        assertEquals(899, exception.getRetryAfterSeconds());

        clock.advanceMillis(898_499);
        exception = assertThrows(LoginRateLimitException.class, () -> service.checkActiveLock(KEY));
        assertEquals(1, exception.getRetryAfterSeconds());

        clock.advanceMillis(1);
        assertDoesNotThrow(() -> service.checkActiveLock(KEY));
        service.recordFailure(KEY);
        assertEquals(1, store.get(KEY).getFailureCount());
        assertEquals(0, store.get(KEY).getLockedUntil());
    }

    @Test
    void resetRestoresTheFullBudget() {
        for (int i = 0; i < 4; i++) {
            service.recordFailure(KEY);
        }
        service.reset(KEY);

        assertTrue(store.get(KEY).isEmpty());
        for (int i = 0; i < 4; i++) {
            service.recordFailure(KEY);
        }
        assertThrows(LoginRateLimitException.class, () -> service.recordFailure(KEY));
    }

    @Test
    void accountsAndClientAddressesHaveIndependentBudgets() {
        LoginAttemptKey otherAddress = new LoginAttemptKey("admin", "192.0.2.11");
        LoginAttemptKey otherAccount = new LoginAttemptKey("other", "192.0.2.10");
        for (int i = 0; i < 4; i++) {
            service.recordFailure(KEY);
        }
        service.recordFailure(otherAddress);
        service.recordFailure(otherAccount);

        assertThrows(LoginRateLimitException.class, () -> service.recordFailure(KEY));
        assertDoesNotThrow(() -> service.checkActiveLock(otherAddress));
        assertDoesNotThrow(() -> service.checkActiveLock(otherAccount));
        assertEquals(1, store.get(otherAddress).getFailureCount());
        assertEquals(1, store.get(otherAccount).getFailureCount());
    }

    @Test
    void twoServiceInstancesShareAtomicUpdates() throws Exception {
        Map<LoginAttemptKey, LoginAttemptState> sharedState = new HashMap<>();
        InMemoryLoginAttemptStore firstStore = new InMemoryLoginAttemptStore(sharedState);
        InMemoryLoginAttemptStore secondStore = new InMemoryLoginAttemptStore(sharedState);
        LoginFailureBudgetService first = createService(firstStore, clock);
        LoginFailureBudgetService second = createService(secondStore, clock);
        int taskCount = 20;
        ExecutorService executor = Executors.newFixedThreadPool(taskCount);
        CountDownLatch start = new CountDownLatch(1);
        List<Future<Boolean>> results = new ArrayList<>();
        try {
            for (int i = 0; i < taskCount; i++) {
                LoginFailureBudgetService selected = i % 2 == 0 ? first : second;
                results.add(executor.submit(() -> {
                    start.await();
                    try {
                        selected.recordFailure(KEY);
                        return true;
                    } catch (LoginRateLimitException e) {
                        return false;
                    }
                }));
            }
            start.countDown();
            int accepted = 0;
            for (Future<Boolean> result : results) {
                if (result.get(10, TimeUnit.SECONDS)) {
                    accepted++;
                }
            }
            assertEquals(4, accepted);
        } finally {
            executor.shutdownNow();
        }
        LoginAttemptState state = firstStore.get(KEY);
        assertEquals(5, state.getFailureCount());
        assertTrue(state.isLocked(clock.millis()));
    }

    static LoginFailureBudgetService createService(LoginAttemptStore store, MutableClock clock) {
        LoginFailureBudgetService service = new LoginFailureBudgetService();
        service.setStore(store);
        service.setClock(clock);
        ReflectionTestUtils.setField(service, "failureLimit", 5);
        ReflectionTestUtils.setField(service, "failureWindowSeconds", 600L);
        ReflectionTestUtils.setField(service, "lockSeconds", 900L);
        return service;
    }
}
