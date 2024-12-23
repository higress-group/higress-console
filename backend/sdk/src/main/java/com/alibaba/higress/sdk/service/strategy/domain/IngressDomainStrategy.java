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
package com.alibaba.higress.sdk.service.strategy.domain;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.Domain;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;

public class IngressDomainStrategy implements DomainStrategy {

    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;

    public IngressDomainStrategy(KubernetesClientService kubernetesClientService, KubernetesModelConverter kubernetesModelConverter) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @Override
    public Domain add(Domain domain) {
        V1ConfigMap domainConfigMap = kubernetesModelConverter.domain2ConfigMap(domain);
        V1ConfigMap newDomainConfigMap;
        try {
            newDomainConfigMap = kubernetesClientService.createConfigMap(domainConfigMap);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when adding a new ingress domain.", e);
        }
        return kubernetesModelConverter.configMap2Domain(newDomainConfigMap);
    }

    @Override
    public Domain put(Domain domain) {
        V1ConfigMap domainConfigMap = kubernetesModelConverter.domain2ConfigMap(domain);
        V1ConfigMap updatedConfigMap;
        try {
            updatedConfigMap = kubernetesClientService.replaceConfigMap(domainConfigMap);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT) {
                throw new ResourceConflictException();
            }
            throw new BusinessException("Error occurs when updating the ingress domain.", e);
        }
        return kubernetesModelConverter.configMap2Domain(updatedConfigMap);
    }

    @Override
    public void delete(String domainName) {
        String configMapName = kubernetesModelConverter.domainName2ConfigMapName(domainName);
        try {
            kubernetesClientService.deleteConfigMap(configMapName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting the ingress ConfigMap with name: " + configMapName, e);
        }
    }
}