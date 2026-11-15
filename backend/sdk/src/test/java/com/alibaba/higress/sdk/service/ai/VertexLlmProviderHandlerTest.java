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
package com.alibaba.higress.sdk.service.ai;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.sdk.exception.ValidationException;

public class VertexLlmProviderHandlerTest {

    @Test
    public void normalizeConfigs_invalidAuthKey_doesNotLeakSubmittedValue() {
        String secret = "vertex-secret-material";
        Map<String, Object> configurations = new HashMap<>();
        configurations.put("vertexRegion", "us-central1");
        configurations.put("vertexProjectId", "project");
        configurations.put("vertexAuthKey", "{\"client_email\":\"" + secret + "\", invalid");

        ValidationException exception = Assertions.assertThrows(ValidationException.class,
            () -> new VertexLlmProviderHandler().normalizeConfigs(configurations));

        Assertions.assertFalse(exception.getMessage().contains(secret));
        Assertions.assertFalse(exception.getMessage().contains("client_email"));
        Assertions.assertNull(exception.getCause());
    }
}
