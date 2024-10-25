/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.service.kubernetes.crd.istio;

public enum Action {

    /** All three route actions */
    ANY(0),
    /** Route traffic to a cluster / weighted clusters. */
    ROUTE(1),
    /** Redirect request. */
    REDIRECT(2),
    /** directly respond to a request with specific payload. */
    DIRECT_RESPONSE(3);

    private final int intValue;

    Action(int intValue) {
        this.intValue = intValue;
    }

    public int value() {
        return intValue;
    }
}
