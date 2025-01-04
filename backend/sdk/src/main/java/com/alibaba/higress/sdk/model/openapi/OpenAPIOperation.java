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
package com.alibaba.higress.sdk.model.openapi;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OpenAPIOperation {
    private List<String> tags;
    private String summary;
    private String description;
    private OpenAPIExternalDocs externalDocs;
    private String operationId;
    private List<OpenAPIParameter> parameters;
    private OpenAPIRequestBody requestBody;
    private Map<String, OpenAPIResponse> responses;
    private boolean deprecated = false;
    private Map<String, List<String>> security;
    private List<OpenAPIServer> servers;
    private Map<String, Object> extensions;

}
