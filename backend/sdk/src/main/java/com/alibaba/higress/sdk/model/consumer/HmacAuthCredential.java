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
package com.alibaba.higress.sdk.model.consumer;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Schema(description = "HmacAuth Credential")
public class HmacAuthCredential extends Credential {

    @Schema(description = "HMAC access key")
    private String key;
    @Schema(description = "HMAC secret")
    private String secret;

    public HmacAuthCredential(String key, String secret) {
        super(CredentialType.HMAC_AUTH);
        this.key = key;
        this.secret = secret;
    }

    @Override
    public String getType() {
        return CredentialType.HMAC_AUTH;
    }

    @Override
    public void setType(String type) {
        if (!CredentialType.HMAC_AUTH.equals(type)) {
            throw new IllegalArgumentException("HmacAuthCredential type is fixed");
        }
    }

    @Override
    public void validate(boolean forUpdate) {
        super.validate(forUpdate);
        if (StringUtils.isBlank(key)) {
            throw new ValidationException("key cannot be blank.");
        }
        if (StringUtils.isBlank(secret)) {
            throw new ValidationException("secret cannot be blank.");
        }
    }
}
