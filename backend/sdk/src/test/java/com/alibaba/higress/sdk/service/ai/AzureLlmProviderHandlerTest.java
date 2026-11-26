/*
 * Copyright (c) 2022-2026 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.service.ai;

import java.util.Collections;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import com.alibaba.higress.sdk.exception.ValidationException;

public class AzureLlmProviderHandlerTest {

    @ParameterizedTest
    @ValueSource(strings = {"https://resource.openai.azure.com/openai/v1",
        "https://resource.openai.azure.com/openai/v1/",
        "https://resource.openai.azure.com/openai/v1/chat/completions",
        "https://resource.openai.azure.com/openai/v1/responses",
        "https://resource.openai.azure.com/openai/v1/embeddings",
        "https://resource.openai.azure.com/openai/v1?model=test",
        "https://resource.openai.azure.com/openai/v1/chat/completions?model=test"})
    public void normalizeConfigs_openAiV1Urls_doNotRequireApiVersion(String serviceUrl) {
        Assertions.assertDoesNotThrow(() -> new AzureLlmProviderHandler()
            .normalizeConfigs(Collections.singletonMap("azureServiceUrl", serviceUrl)));
    }

    @ParameterizedTest
    @ValueSource(strings = {
        "https://resource.openai.azure.com/openai/deployments/test/chat/completions?api-version=2024-02-15-preview",
        "https://resource.openai.azure.com/openai/deployments/test/embeddings?api-version=2024-02-15-preview",
        "https://resource.openai.azure.com/openai/v1?api-version=2024-02-15-preview"})
    public void normalizeConfigs_urlsWithApiVersion_areAccepted(String serviceUrl) {
        Assertions.assertDoesNotThrow(() -> new AzureLlmProviderHandler()
            .normalizeConfigs(Collections.singletonMap("azureServiceUrl", serviceUrl)));
    }

    @ParameterizedTest
    @ValueSource(strings = {"https://resource.openai.azure.com/openai/deployments/test/chat/completions",
        "https://resource.openai.azure.com/openai/deployments/test/chat/completions?api-version=",
        "https://resource.openai.azure.com/openai/deployments/test/chat/completions?api-version",
        "https://resource.openai.azure.com/openai/v10",
        "https://resource.openai.azure.com/openai/v10/chat/completions",
        "https://resource.openai.azure.com/openai/v1beta",
        "https://resource.openai.azure.com/openai/v1beta/chat/completions",
        "https://resource.openai.azure.com/openai/v1/../deployments/test/chat/completions",
        "https://resource.openai.azure.com/openai/deployments/test/chat/completions?url=/openai/v1/",
        "https://openai.v1.resource.azure.com/openai/deployments/test/chat/completions"})
    public void normalizeConfigs_nonV1UrlsWithoutApiVersion_areRejected(String serviceUrl) {
        Assertions.assertThrows(ValidationException.class, () -> new AzureLlmProviderHandler()
            .normalizeConfigs(Collections.singletonMap("azureServiceUrl", serviceUrl)));
    }
}
