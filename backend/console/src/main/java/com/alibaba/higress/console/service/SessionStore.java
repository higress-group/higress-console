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

/**
 * Persistence boundary for console sessions.
 *
 * Production implementations must make every mutation visible to all console replicas. The bearer session ID is used
 * only as the lookup key and must not be added to {@link SessionData}. The production implementation stores one
 * Kubernetes Secret per session.
 */
public interface SessionStore {

    void create(String sessionId, SessionData session);

    SessionData find(String sessionId);

    void update(String sessionId, SessionData session);

    void delete(String sessionId);

    void deleteByUsername(String username);

    String getCredentialVersion(String username);

    void bumpCredentialVersion(String username);
}
