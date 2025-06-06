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
package com.alibaba.higress.sdk.model.consumer;

import org.apache.commons.lang3.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
@Schema(description = "KeyAuth Credential Source", type = "string", allowableValues = {"BEARER", "HEADER", "QUERY"})
public enum KeyAuthCredentialSource {

    /**
     * Use "Authorization: Bearer token" header
     */
    BEARER(false),
    /**
     * Use HTTP header
     */
    HEADER(true),
    /**
     * Use query parameter
     */
    QUERY(true);

    private final boolean keyRequired;

    KeyAuthCredentialSource(boolean keyRequired) {
        this.keyRequired = keyRequired;
    }

    public static KeyAuthCredentialSource parse(String str) {
        if (StringUtils.isEmpty(str)) {
            return null;
        }
        switch (str) {
            case "BEARER":
                return BEARER;
            case "HEADER":
                return HEADER;
            case "QUERY":
                return QUERY;
            default:
                return null;
        }
    }
}
