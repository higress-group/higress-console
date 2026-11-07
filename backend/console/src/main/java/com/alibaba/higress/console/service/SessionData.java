/*
 * Copyright (c) 2022-2025 Alibaba Group Holding Ltd.
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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Server-side session state. Authentication credentials are deliberately not part of this model.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionData {

    private String username;

    private long createdAt;

    private long lastAccessAt;

    public boolean isExpired(long now, long idleTimeout, long absoluteTimeout) {
        return idleTimeout > 0 && now - lastAccessAt >= idleTimeout
            || absoluteTimeout > 0 && now - createdAt >= absoluteTimeout;
    }

    public static long validateTimeout(String propertyName, long timeout) {
        if (timeout < 0) {
            throw new IllegalArgumentException(
                "Configuration property '" + propertyName + "' must be at least 0 milliseconds, but was " + timeout);
        }
        return timeout;
    }
}
