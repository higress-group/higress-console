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
package com.alibaba.higress.console.controller.dto;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;

import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.consumer.Credential;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredential;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Service consumer response without credential values")
public class ConsumerResponse {

    @Schema(description = "Consumer name")
    private String name;
    @Schema(description = "Consumer credential metadata")
    private List<CredentialResponse> credentials;

    public static ConsumerResponse from(Consumer consumer) {
        if (consumer == null) {
            return null;
        }
        List<CredentialResponse> credentials = Collections.emptyList();
        if (CollectionUtils.isNotEmpty(consumer.getCredentials())) {
            credentials = consumer.getCredentials().stream().map(CredentialResponse::from).collect(Collectors.toList());
        }
        return ConsumerResponse.builder().name(consumer.getName()).credentials(credentials).build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Consumer credential metadata without credential values")
    public static class CredentialResponse {

        @Schema(description = "Credential type", ref = "CredentialType")
        private String type;
        @Schema(description = "Credential source", ref = "KeyAuthCredentialSource")
        private String source;
        @Schema(description = "Credential key")
        private String key;
        @Schema(description = "Number of configured key-auth credentials")
        private int credentialCount;

        public static CredentialResponse from(Credential credential) {
            if (credential instanceof KeyAuthCredential) {
                KeyAuthCredential keyAuthCredential = (KeyAuthCredential)credential;
                int credentialCount = keyAuthCredential.getValues() != null ? keyAuthCredential.getValues().size() : 0;
                return CredentialResponse.builder().type(keyAuthCredential.getType()).source(keyAuthCredential.getSource())
                    .key(keyAuthCredential.getKey()).credentialCount(credentialCount).build();
            }
            return CredentialResponse.builder().type(credential.getType()).build();
        }
    }
}
