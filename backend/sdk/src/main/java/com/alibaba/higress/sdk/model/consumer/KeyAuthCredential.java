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

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.google.common.collect.Sets;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "KeyAuth Credential")
public class KeyAuthCredential extends Credential {

    private static final Set<String> VALID_SOURCES = Sets.newHashSet(KeyAuthCredentialSource.BEARER.name(),
        KeyAuthCredentialSource.HEADER.name(), KeyAuthCredentialSource.QUERY.name());

    @Schema(description = "Credential source", ref = "KeyAuthCredentialSource")
    private String source;
    @Schema(description = "Credential Key. Required when source is HEADER or QUERY")
    private String key;
    @Schema(description = "Credential Values")
    private List<String> values;

    public KeyAuthCredential(String type, String source, String key, List<String> values) {
        super(type);
        this.source = source;
        this.key = key;
        this.values = values != null ? new ArrayList<>(values) : null;
    }

    @Override
    public String getType() {
        return CredentialType.KEY_AUTH;
    }

    @Override
    public void setType(String type) {
        if (!CredentialType.KEY_AUTH.equals(type)) {
            throw new IllegalArgumentException("KeyAuthCredential type is fixed");
        }
    }

    @Override
    public void validate(boolean forUpdate) {
        super.validate(forUpdate);
        if (StringUtils.isBlank(source)) {
            throw new ValidationException("source cannot be blank.");
        }

        KeyAuthCredentialSource sourceEnum = KeyAuthCredentialSource.parse(source);
        if (sourceEnum == null) {
            throw new ValidationException("unknown source value: " + source);
        }

        if (sourceEnum.isKeyRequired() && StringUtils.isBlank(key)) {
            throw new ValidationException("key cannot be blank.");
        }

        if (!forUpdate && CollectionUtils.isEmpty(values)) {
            throw new ValidationException("value cannot be blank.");
        }
    }
}
