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
package com.alibaba.higress.sdk.service.authorization;

import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.authorization.AuthorizationRelationship;

public interface AuthorizationService {
    void initGlobalInstance();

    WasmPluginInstance initInstance(Map<WasmPluginInstanceScope, String> targets, Boolean enable);

    void changeEnableStatus(Map<WasmPluginInstanceScope, String> targets, Boolean enable);

    void bind(AuthorizationRelationship relationship);

    void bindList(List<AuthorizationRelationship> relationships);

    void unbind(AuthorizationRelationship relationship);

    void unbindAll(String resourceName);

    void unbindList(List<AuthorizationRelationship> relationships);

    List<AuthorizationRelationship> boundList(AuthorizationRelationship param);
}
