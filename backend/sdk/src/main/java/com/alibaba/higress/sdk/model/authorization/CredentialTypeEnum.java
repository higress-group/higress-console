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
package com.alibaba.higress.sdk.model.authorization;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import lombok.Getter;

/**
 * @author lvshui
 */
@Getter
public enum CredentialTypeEnum {
    /**
     * credential type is key-auth
     */
    KEY_AUTH("key-auth", "API_KEY");

    private final String type;
    /**
     * aliases for credential type. ignore case
     */
    private final List<String> typeAliases;

    CredentialTypeEnum(String type, String... aliases) {
        this.type = type;
        this.typeAliases = Arrays.asList(aliases);
    }

    private static final Map<String, CredentialTypeEnum> CACHE = new HashMap<>();
    static {
        for (CredentialTypeEnum value : CredentialTypeEnum.values()) {
            CACHE.put(value.getType().toUpperCase(), value);

            List<String> typeAliases = value.getTypeAliases();
            if (CollectionUtils.isEmpty(typeAliases)) {
                continue;
            }
            for (String typeAlias : typeAliases) {
                CACHE.put(typeAlias.toUpperCase(), value);
            }
        }
    }

    public static CredentialTypeEnum fromType(String type) {
        if (StringUtils.isBlank(type)) {
            throw new IllegalArgumentException("type cannot be blank.");
        }
        CredentialTypeEnum result = CACHE.get(type.toUpperCase());
        if (Objects.isNull(result)) {
            throw new IllegalArgumentException("Unknown credential type: " + type);
        }
        return result;
    }
}
