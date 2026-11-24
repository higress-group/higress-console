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

import java.util.HashMap;
import java.util.Map;
import java.util.function.UnaryOperator;

final class InMemoryLoginAttemptStore implements LoginAttemptStore {

    private final Map<LoginAttemptKey, LoginAttemptState> states;

    InMemoryLoginAttemptStore() {
        this(new HashMap<>());
    }

    InMemoryLoginAttemptStore(Map<LoginAttemptKey, LoginAttemptState> states) {
        this.states = states;
    }

    @Override
    public LoginAttemptState get(LoginAttemptKey key) {
        synchronized (states) {
            return states.getOrDefault(key, LoginAttemptState.EMPTY);
        }
    }

    @Override
    public LoginAttemptState update(LoginAttemptKey key, UnaryOperator<LoginAttemptState> update) {
        synchronized (states) {
            LoginAttemptState updated = update.apply(get(key));
            if (updated.isEmpty()) {
                states.remove(key);
            } else {
                states.put(key, updated);
            }
            return updated;
        }
    }
}
