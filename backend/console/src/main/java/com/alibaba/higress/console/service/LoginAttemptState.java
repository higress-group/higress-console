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

import java.util.Objects;

public final class LoginAttemptState {

    public static final LoginAttemptState EMPTY = new LoginAttemptState(0, 0, 0);

    private final long windowStartedAt;
    private final int failureCount;
    private final long lockedUntil;

    public LoginAttemptState(long windowStartedAt, int failureCount, long lockedUntil) {
        this.windowStartedAt = windowStartedAt;
        this.failureCount = failureCount;
        this.lockedUntil = lockedUntil;
    }

    public long getWindowStartedAt() {
        return windowStartedAt;
    }

    public int getFailureCount() {
        return failureCount;
    }

    public long getLockedUntil() {
        return lockedUntil;
    }

    public boolean isLocked(long now) {
        return lockedUntil > now;
    }

    public boolean isEmpty() {
        return equals(EMPTY);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LoginAttemptState)) {
            return false;
        }
        LoginAttemptState that = (LoginAttemptState)o;
        return windowStartedAt == that.windowStartedAt && failureCount == that.failureCount
            && lockedUntil == that.lockedUntil;
    }

    @Override
    public int hashCode() {
        return Objects.hash(windowStartedAt, failureCount, lockedUntil);
    }
}
