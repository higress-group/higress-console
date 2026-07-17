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

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Schema(description = "JwtAuth Credential")
public class JwtAuthCredential extends Credential {

    @Schema(description = "JWT issuer")
    private String issuer;
    @Schema(description = "JWT JSON Web Key Set")
    private String jwks;
    @JsonProperty("claims_to_headers")
    @Schema(description = "JWT claims to headers mapping")
    private List<Map<String, Object>> claimsToHeaders;
    @JsonProperty("from_headers")
    @Schema(description = "JWT extraction headers")
    private List<Map<String, Object>> fromHeaders;
    @JsonProperty("from_params")
    @Schema(description = "JWT extraction query params")
    private List<String> fromParams;
    @JsonProperty("from_cookies")
    @Schema(description = "JWT extraction cookies")
    private List<String> fromCookies;
    @JsonProperty("clock_skew_seconds")
    @Schema(description = "Clock skew in seconds")
    private Integer clockSkewSeconds;
    @JsonProperty("keep_token")
    @Schema(description = "Whether to keep JWT when forwarding")
    private Boolean keepToken;

    public JwtAuthCredential(String issuer, String jwks, List<Map<String, Object>> claimsToHeaders,
        List<Map<String, Object>> fromHeaders, List<String> fromParams, List<String> fromCookies,
        Integer clockSkewSeconds, Boolean keepToken) {
        super(CredentialType.JWT_AUTH);
        this.issuer = issuer;
        this.jwks = jwks;
        this.claimsToHeaders = claimsToHeaders;
        this.fromHeaders = fromHeaders;
        this.fromParams = fromParams;
        this.fromCookies = fromCookies;
        this.clockSkewSeconds = clockSkewSeconds;
        this.keepToken = keepToken;
    }

    @Override
    public String getType() {
        return CredentialType.JWT_AUTH;
    }

    @Override
    public void setType(String type) {
        if (!CredentialType.JWT_AUTH.equals(type)) {
            throw new IllegalArgumentException("JwtAuthCredential type is fixed");
        }
    }

    @Override
    public void validate(boolean forUpdate) {
        super.validate(forUpdate);
        if (StringUtils.isBlank(issuer)) {
            throw new ValidationException("issuer cannot be blank.");
        }
        if (StringUtils.isBlank(jwks)) {
            throw new ValidationException("jwks cannot be blank.");
        }
    }
}
