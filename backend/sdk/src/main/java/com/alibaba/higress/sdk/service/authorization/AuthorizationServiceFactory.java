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
package com.alibaba.higress.sdk.service.authorization;

import java.util.HashMap;
import java.util.Map;

import com.alibaba.higress.sdk.model.authorization.CredentialTypeEnum;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;

/**
 * @author lvshui
 */
public class AuthorizationServiceFactory {
    private final Map<String/*CredentialTypeEnum*/, AuthorizationService> serviceMap;

    public AuthorizationServiceFactory(WasmPluginInstanceService wasmPluginInstanceService) {
        serviceMap = new HashMap<>(16);
        serviceMap.put(CredentialTypeEnum.KEY_AUTH.getType(),
            new AuthorizationOfKeyAuthServiceImpl(wasmPluginInstanceService));
    }

    /**
     * @param credentialType
     * @return
     */
    public AuthorizationService getService(CredentialTypeEnum credentialType) {
        return serviceMap.get(credentialType.getType());
    }
}
