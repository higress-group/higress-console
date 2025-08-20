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
package com.alibaba.higress.sdk.model.consumer;

public enum AllowListOperation {

    /**
     * Add provided consumers into the current allow list.
     * The auth switch is updated if not null.
     */
    ADD,
    /**
     * Remove provided consumers from the current allow list.
     * The auth switch is updated if not null.
     */
    REMOVE,
    /**
     * Replace the current allow list with provided consumers.
     * The auth switch is updated if not null.
     */
    REPLACE,
    /**
     * Only update the auth switch state and leave the allow list as it is.
     */
    TOGGLE_ONLY
}
