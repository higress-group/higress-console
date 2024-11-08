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
package com.alibaba.higress.sdk.service;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import io.kubernetes.client.openapi.ApiException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HigressConfigServiceImpl implements HigressConfigService{
    private final KubernetesClientService kubernetesClientService;

    public HigressConfigServiceImpl(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Override
    public Boolean get() {
        return kubernetesClientService.isIngressWorkMode();
    }

    @Override
    public Boolean put(Boolean isIngressMode) {
        Boolean updatedIsIngressMode = isIngressMode;
        try {
            updatedIsIngressMode = kubernetesClientService.setIngressMode(isIngressMode);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when updating the Higress workmode: ", e);
        }
        return updatedIsIngressMode;
    }
}
