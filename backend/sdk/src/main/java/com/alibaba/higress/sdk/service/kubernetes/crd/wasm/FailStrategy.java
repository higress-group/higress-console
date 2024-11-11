/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.service.kubernetes.crd.wasm;

public enum FailStrategy {

    /**
     * A fatal error in the binary fetching or during the plugin execution causes all subsequent requests to fail with
     * 5xx.
     */
    FAIL_CLOSE("FAIL_CLOSE", 0),

    /**
     * Enables the fail open behavior for the Wasm plugin fatal errors to bypass the plugin execution. A fatal error can
     * be a failure to fetch the remote binary, an exception, or abort() on the VM. This flag is not recommended for the
     * authentication or the authorization plugins.
     */
    FAIL_OPEN("FAIL_OPEN", 1);

    private final String name;
    private final int value;

    FailStrategy(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public int getValue() {
        return value;
    }
}
