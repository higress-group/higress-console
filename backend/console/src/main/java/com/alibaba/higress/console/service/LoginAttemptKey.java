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

/**
 * Account and client address pair used by both password authentication paths. The client address comes only from
 * {@code HttpServletRequest.getRemoteAddr()}. Deployments using trusted proxies must configure the container or server
 * to resolve those proxies; forwarding headers are not read by the console authentication code.
 */
public final class LoginAttemptKey {

    private final String account;
    private final String clientIp;

    public LoginAttemptKey(String account, String clientIp) {
        if (account == null || account.isEmpty()) {
            throw new IllegalArgumentException("Account must not be empty.");
        }
        if (clientIp == null || clientIp.trim().isEmpty()) {
            throw new IllegalArgumentException("Client IP must not be empty.");
        }
        this.account = account;
        this.clientIp = clientIp;
    }

    public String getAccount() {
        return account;
    }

    public String getClientIp() {
        return clientIp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LoginAttemptKey)) {
            return false;
        }
        LoginAttemptKey that = (LoginAttemptKey)o;
        return account.equals(that.account) && clientIp.equals(that.clientIp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(account, clientIp);
    }
}
