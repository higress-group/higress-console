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

import java.time.Clock;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.controller.exception.LoginRateLimitException;

@Service
public class LoginFailureBudgetService {

    private static final long MILLIS_PER_SECOND = 1000L;

    @Value("${" + SystemConfigKey.LOGIN_FAILURE_LIMIT_KEY + ":" + SystemConfigKey.LOGIN_FAILURE_LIMIT_DEFAULT + "}")
    private int failureLimit = SystemConfigKey.LOGIN_FAILURE_LIMIT_DEFAULT;

    @Value("${" + SystemConfigKey.LOGIN_FAILURE_WINDOW_SECONDS_KEY + ":"
        + SystemConfigKey.LOGIN_FAILURE_WINDOW_SECONDS_DEFAULT + "}")
    private long failureWindowSeconds = SystemConfigKey.LOGIN_FAILURE_WINDOW_SECONDS_DEFAULT;

    @Value("${" + SystemConfigKey.LOGIN_LOCK_SECONDS_KEY + ":" + SystemConfigKey.LOGIN_LOCK_SECONDS_DEFAULT + "}")
    private long lockSeconds = SystemConfigKey.LOGIN_LOCK_SECONDS_DEFAULT;

    private LoginAttemptStore store;
    private Clock clock = Clock.systemUTC();

    @Resource
    public void setStore(LoginAttemptStore store) {
        this.store = store;
    }

    public void ensureNotLocked(LoginAttemptKey key) {
        throwIfLocked(store.get(key), clock.millis());
    }

    public void recordFailure(LoginAttemptKey key) {
        long now = clock.millis();
        long windowMillis = secondsToMillis(failureWindowSeconds);
        long lockMillis = secondsToMillis(lockSeconds);
        int limit = Math.max(1, failureLimit);
        store.update(key, state -> nextFailure(state, now, windowMillis, lockMillis, limit));
    }

    public void reset(LoginAttemptKey key) {
        store.update(key, state -> LoginAttemptState.EMPTY);
    }

    void setClock(Clock clock) {
        this.clock = clock;
    }

    private static LoginAttemptState nextFailure(LoginAttemptState state, long now, long windowMillis, long lockMillis,
        int limit) {
        if (state.isLocked(now)) {
            return new LoginAttemptState(state.getWindowStartedAt(), state.getAttemptCount() + 1, state.getLockedUntil());
        }
        if (state.getLockedUntil() != 0 || now < state.getWindowStartedAt()
            || now - state.getWindowStartedAt() >= windowMillis) {
            state = LoginAttemptState.EMPTY;
        }
        int count = state.getAttemptCount() + 1;
        long windowStartedAt = state.isEmpty() ? now : state.getWindowStartedAt();
        long lockedUntil = count >= limit ? now + lockMillis : 0;
        return new LoginAttemptState(windowStartedAt, count, lockedUntil);
    }

    private static void throwIfLocked(LoginAttemptState state, long now) {
        if (!state.isLocked(now)) {
            return;
        }
        long remainingMillis = state.getLockedUntil() - now;
        long retryAfterSeconds = 1 + (remainingMillis - 1) / MILLIS_PER_SECOND;
        throw new LoginRateLimitException(retryAfterSeconds);
    }

    private static long secondsToMillis(long seconds) {
        return TimeUnit.SECONDS.toMillis(Math.max(1, seconds));
    }
}
