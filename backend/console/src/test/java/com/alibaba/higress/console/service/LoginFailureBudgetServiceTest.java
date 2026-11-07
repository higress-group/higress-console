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

    private static final LoginAttemptKey KEY = new LoginAttemptKey(LoginAuthSource.FORM, "admin", "192.0.2.10");
    private static final LoginAttemptKey BASIC_KEY =
        new LoginAttemptKey(LoginAuthSource.BASIC, "admin", "192.0.2.10");

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
    void fifthAttemptStartsTheLockAndSixthIsRejected() {
        for (int i = 0; i < 4; i++) {
            service.recordAttempt(KEY);
        }
        assertDoesNotThrow(() -> service.recordAttempt(KEY));

        LoginRateLimitException exception = assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(KEY));

        assertEquals(900, exception.getRetryAfterSeconds());
        assertEquals(6, store.get(KEY).getAttemptCount());
        assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(KEY));
    }

    @Test
    void failureWindowStartsANewBudget() {
        for (int i = 0; i < 4; i++) {
            service.recordAttempt(KEY);
        }
        clock.advanceSeconds(600);

        service.recordAttempt(KEY);

        assertEquals(1, store.get(KEY).getAttemptCount());
        for (int i = 0; i < 3; i++) {
            service.recordAttempt(KEY);
        }
        service.recordAttempt(KEY);
        assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(KEY));
    }

    @Test
    void lockExpiresAndRetryAfterRoundsUp() {
        for (int i = 0; i < 4; i++) {
            service.recordAttempt(KEY);
        }
        service.recordAttempt(KEY);
        assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(KEY));

        clock.advanceMillis(1500);
        LoginRateLimitException exception = assertThrows(LoginRateLimitException.class,
            () -> service.recordAttempt(KEY));
        assertEquals(899, exception.getRetryAfterSeconds());

        clock.advanceMillis(898_499);
        exception = assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(KEY));
        assertEquals(1, exception.getRetryAfterSeconds());

        clock.advanceMillis(1);
        assertDoesNotThrow(() -> service.recordAttempt(KEY));
        assertEquals(1, store.get(KEY).getAttemptCount());
        assertEquals(0, store.get(KEY).getLockedUntil());
    }

    @Test
    void resetRestoresTheFullBudget() {
        for (int i = 0; i < 4; i++) {
            service.recordAttempt(KEY);
        }
        service.reset(KEY);

        assertTrue(store.get(KEY).isEmpty());
        for (int i = 0; i < 4; i++) {
            service.recordAttempt(KEY);
        }
        service.recordAttempt(KEY);
        assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(KEY));
    }

    @Test
    void accountsAndClientAddressesHaveIndependentBudgets() {
        LoginAttemptKey otherAddress = new LoginAttemptKey(LoginAuthSource.FORM, "admin", "192.0.2.11");
        LoginAttemptKey otherAccount = new LoginAttemptKey(LoginAuthSource.FORM, "other", "192.0.2.10");
        for (int i = 0; i < 4; i++) {
            service.recordAttempt(KEY);
        }
        service.recordAttempt(otherAddress);
        service.recordAttempt(otherAccount);

        service.recordAttempt(KEY);
        assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(KEY));
        assertDoesNotThrow(() -> service.recordAttempt(otherAddress));
        assertDoesNotThrow(() -> service.recordAttempt(otherAccount));
        assertEquals(2, store.get(otherAddress).getAttemptCount());
        assertEquals(2, store.get(otherAccount).getAttemptCount());
    }

    @Test
    void formAndBasicBudgetsAreIndependent() {
        for (int i = 0; i < 5; i++) {
            service.recordAttempt(BASIC_KEY);
        }
        assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(BASIC_KEY));

        for (int i = 0; i < 5; i++) {
            assertDoesNotThrow(() -> service.recordAttempt(KEY));
        }
        assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(KEY));
        assertThrows(LoginRateLimitException.class, () -> service.recordAttempt(BASIC_KEY));
    }

    @Test
    void resettingOneSourceDoesNotResetTheOther() {
        for (int i = 0; i < 4; i++) {
            service.recordAttempt(KEY);
            service.recordAttempt(BASIC_KEY);
        }

        service.reset(KEY);

        assertTrue(store.get(KEY).isEmpty());
        assertEquals(4, store.get(BASIC_KEY).getAttemptCount());
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
                        selected.recordAttempt(KEY);
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
            assertEquals(5, accepted);
        } finally {
            executor.shutdownNow();
        }
        LoginAttemptState state = firstStore.get(KEY);
        assertEquals(taskCount, state.getAttemptCount());
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
