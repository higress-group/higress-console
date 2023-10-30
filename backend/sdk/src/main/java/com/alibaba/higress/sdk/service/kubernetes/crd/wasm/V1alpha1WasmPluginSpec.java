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
package com.alibaba.higress.sdk.service.kubernetes.crd.wasm;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class V1alpha1WasmPluginSpec {

    private Boolean defaultConfigDisable;

    private Map<String, Object> defaultConfig;

    private String imagePullPolicy;

    private String imagePullSecret;

    private List<MatchRule> matchRules;

    private String phase;

    private Integer priority;

    private String sha256;

    private String url;

    private String verificationKey;
}
