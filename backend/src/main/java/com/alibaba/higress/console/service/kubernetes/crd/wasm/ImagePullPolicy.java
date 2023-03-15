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
package com.alibaba.higress.console.service.kubernetes.crd.wasm;

public enum ImagePullPolicy {

    /**
     * Defaults to IfNotPresent, except for OCI images with tag `latest`, for which the default will be Always.
     */
    UNSPECIFIED("UNSPECIFIED_POLICY", 0),

    /**
     * If an existing version of the image has been pulled before, that will be used. If no version of the image is
     * present locally, we will pull the latest version.
     */
    IF_NOT_PRESENT("IfNotPresent", 1),

    /**
     * We will always pull the latest version of an image when applying this plugin.
     */
    ALWAYS("Always", 2);

    private final String name;
    private final int value;

    ImagePullPolicy(String name, int value) {
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
