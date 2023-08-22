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
package com.alibaba.higress.console.service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.ServiceSource;
import com.alibaba.higress.console.controller.dto.ServiceSourceAuthN;
import com.alibaba.higress.console.controller.exception.BusinessException;
import com.alibaba.higress.console.controller.exception.ResourceConflictException;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.console.service.kubernetes.KubernetesModelConverter;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridge;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1McpBridgeSpec;
import com.alibaba.higress.console.service.kubernetes.crd.mcp.V1RegistryConfig;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Secret;

@Service
public class ServiceSourceServiceImpl implements ServiceSourceService {

    private static final int SECRET_NAME_ATTEMPTS = 5;

    private KubernetesClientService kubernetesClientService;
    private KubernetesModelConverter kubernetesModelConverter;

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Resource
    public void setKubernetesModelConverter(KubernetesModelConverter kubernetesModelConverter) {
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @Override
    public PaginatedResult<ServiceSource> list(CommonPageQuery query) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                return PaginatedResult.createFromFullList(Collections.emptyList(), query);
            }
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        List<ServiceSource> serviceSources = Collections.emptyList();
        if (null != mcpBridge) {
            String resourceVersion =
                mcpBridge.getMetadata() != null ? mcpBridge.getMetadata().getResourceVersion() : null;
            if (null != mcpBridge.getSpec() && CollectionUtils.isNotEmpty(mcpBridge.getSpec().getRegistries())) {
                List<V1RegistryConfig> registries = mcpBridge.getSpec().getRegistries();
                serviceSources = new ArrayList<>(registries.size());
                for (V1RegistryConfig registry : registries) {
                    ServiceSource serviceSource = convert(registry);
                    serviceSource.setVersion(resourceVersion);
                    serviceSources.add(serviceSource);
                }
            }
        }
        return PaginatedResult.createFromFullList(serviceSources, query);
    }

    @Override
    public ServiceSource addOrUpdate(ServiceSource serviceSource) {
        V1McpBridge mcpBridge = null;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                throw new BusinessException("Error occurs when getting McpBridge.", e);
            }
        }
        try {
            if (null == mcpBridge) {
                mcpBridge = new V1McpBridge();
                kubernetesModelConverter.initV1McpBridge(mcpBridge);
                V1RegistryConfig registry = kubernetesModelConverter.addV1McpBridgeRegistry(mcpBridge, serviceSource);
                syncAuthSecret(serviceSource, registry);
                kubernetesClientService.createMcpBridge(mcpBridge);
            } else {
                V1RegistryConfig registry = kubernetesModelConverter.addV1McpBridgeRegistry(mcpBridge, serviceSource);
                syncAuthSecret(serviceSource, registry);
                kubernetesClientService.replaceMcpBridge(mcpBridge);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT.value()) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when adding or updating the ServiceSource with name: " + serviceSource.getName(), e);
        }
        return serviceSource;
    }

    @Override
    public void delete(String name) {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                return;
            }
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        V1RegistryConfig registry = kubernetesModelConverter.removeV1McpBridgeRegistry(mcpBridge, name);
        if (StringUtils.isNotEmpty(registry.getAuthSecretName())) {
            try {
                kubernetesClientService.deleteSecret(registry.getAuthSecretName());
            } catch (ApiException e) {
                if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                    String message = "Error occurs when deleting the secret associated with ServiceSource named "
                        + registry.getName();
                    throw new BusinessException(message, e);
                }
            }
        }
        try {
            kubernetesClientService.replaceMcpBridge(mcpBridge);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting the ServiceSource with name: " + name, e);
        }
    }

    @Override
    public ServiceSource query(String name) throws BusinessException {
        V1McpBridge mcpBridge;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                return null;
            }
            throw new BusinessException("Error occurs when getting McpBridge.", e);
        }
        if (null == mcpBridge || CollectionUtils.isEmpty(mcpBridge.getSpec().getRegistries())) {
            return null;
        }
        Optional<V1RegistryConfig> op =
            mcpBridge.getSpec().getRegistries().stream().filter(r -> name.equals(r.getName())).findFirst();
        if (op.isEmpty()) {
            return null;
        }
        ServiceSource source = convert(op.get());
        source.setVersion(mcpBridge.getMetadata().getResourceVersion());
        return source;
    }

    @Override
    public ServiceSource add(ServiceSource serviceSource) {
        V1McpBridge mcpBridge = null;
        try {
            mcpBridge = kubernetesClientService.readMcpBridge(V1McpBridge.DEFAULT_NAME);
        } catch (ApiException e) {
            if (e.getCode() != HttpStatus.NOT_FOUND.value()) {
                throw new BusinessException("Error occurs when getting McpBridge.", e);
            }
        }
        try {
            if (null == mcpBridge) {
                mcpBridge = new V1McpBridge();
                kubernetesModelConverter.initV1McpBridge(mcpBridge);
                V1RegistryConfig registry = kubernetesModelConverter.addV1McpBridgeRegistry(mcpBridge, serviceSource);
                syncAuthSecret(serviceSource, registry);
                kubernetesClientService.createMcpBridge(mcpBridge);
            } else {
                V1McpBridgeSpec spec = mcpBridge.getSpec();
                if (spec != null && spec.getRegistries() != null) {
                    Optional<V1RegistryConfig> op = spec.getRegistries().stream()
                        .filter(r -> serviceSource.getName().equals(r.getName())).findFirst();
                    if (op.isPresent()) {
                        throw new ResourceConflictException();
                    }
                }
                V1RegistryConfig registry = kubernetesModelConverter.addV1McpBridgeRegistry(mcpBridge, serviceSource);
                syncAuthSecret(serviceSource, registry);
                kubernetesClientService.replaceMcpBridge(mcpBridge);
            }
        } catch (ApiException e) {
            if (e.getCode() == HttpStatus.CONFLICT.value()) {
                throw new ResourceConflictException();
            }
            throw new BusinessException(
                "Error occurs when adding the ServiceSource with name: " + serviceSource.getName(), e);
        }
        return serviceSource;
    }

    private void syncAuthSecret(ServiceSource serviceSource, V1RegistryConfig registry) throws BusinessException {
        ServiceSourceAuthN authN = serviceSource.getAuthN();
        boolean authEnabledCurrent = StringUtils.isNotBlank(registry.getAuthSecretName());
        boolean authEnabledTarget = authN != null && Boolean.TRUE.equals(authN.getEnabled());

        // Remain disabled. No need to create secret.
        if (!authEnabledCurrent && !authEnabledTarget) {
            return;
        }

        // Enabled -> Disabled. Delete the secret.
        if (!authEnabledTarget) {
            try {
                kubernetesClientService.deleteSecret(registry.getAuthSecretName());
            } catch (ApiException e) {
                String message = "Error occurs when deleting the secret associated with ServiceSource named "
                    + serviceSource.getName();
                throw new BusinessException(message, e);
            }
            registry.setAuthSecretName(null);
            return;
        }

        if (!authEnabledCurrent || MapUtils.isNotEmpty(authN.getProperties())) {
            if (!authN.validate(registry.getType())) {
                throw new ValidationException("The authN properties are not valid.");
            }
        }

        // Remain enabled and no property update. Leave the secret as it is.
        if (MapUtils.isEmpty(authN.getProperties())) {
            return;
        }

        Map<String, byte[]> secretData = authN.getProperties().entrySet().stream()
            .collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().getBytes(StandardCharsets.UTF_8)));

        if (StringUtils.isNotEmpty(registry.getAuthSecretName())) {
            // Update current secret
            boolean secretLost = false;
            V1Secret secret;
            try {
                secret = kubernetesClientService.readSecret(registry.getAuthSecretName());
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                    secret = new V1Secret();
                    V1ObjectMeta metadata = new V1ObjectMeta();
                    metadata.setName(registry.getAuthSecretName());
                    secret.setMetadata(metadata);
                    secretLost = true;
                } else {
                    String message = "Error occurs when getting the secret associated with ServiceSource named "
                        + serviceSource.getName();
                    throw new BusinessException(message, e);
                }
            }
            secret.setData(secretData);
            try {
                if (secretLost) {
                    kubernetesClientService.createSecret(secret);
                } else {
                    kubernetesClientService.replaceSecret(secret);
                }
            } catch (ApiException e) {
                String message = "Error occurs when updating the secret associated with ServiceSource named "
                    + serviceSource.getName();
                throw new BusinessException(message, e);
            }
        } else {
            // Create a new secret
            V1Secret secret = new V1Secret();
            V1ObjectMeta metadata = new V1ObjectMeta();
            secret.setMetadata(metadata);
            secret.setData(secretData);
            boolean done = false;
            for (int i = 0; !done && i < SECRET_NAME_ATTEMPTS; ++i) {
                try {
                    String secretName = kubernetesModelConverter.generateAuthSecretName(serviceSource.getName());
                    metadata.setName(secretName);
                    kubernetesClientService.createSecret(secret);
                    registry.setAuthSecretName(secretName);
                    done = true;
                } catch (ApiException e) {
                    if (e.getCode() == HttpStatus.CONFLICT.value()) {
                        continue;
                    }
                    String message = "Error occurs when creating the secret associated with ServiceSource named "
                        + serviceSource.getName();
                    throw new BusinessException(message, e);
                }
            }
            if (!done) {
                throw new BusinessException(
                    "Failed to find an unused name for the secret associated with ServiceSource named "
                        + serviceSource.getName());
            }
        }
    }

    private ServiceSource convert(V1RegistryConfig registry) {
        ServiceSource source = kubernetesModelConverter.v1RegistryConfig2ServiceSource(registry);
        ServiceSourceAuthN authN = new ServiceSourceAuthN(false, Collections.emptyMap());
        if (StringUtils.isNotBlank(registry.getAuthSecretName())) {
            V1Secret secret;
            try {
                secret = kubernetesClientService.readSecret(registry.getAuthSecretName());
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.NOT_FOUND.value()) {
                    secret = null;
                } else {
                    throw new BusinessException("Error occurs when getting McpBridge.", e);
                }
            }
            if (secret != null && MapUtils.isNotEmpty(secret.getData())) {
                authN.setEnabled(true);
                Map<String, String> properties = new HashMap<>(secret.getData().size());
                for (Map.Entry<String, byte[]> entry : secret.getData().entrySet()) {
                    properties.put(entry.getKey(), new String(entry.getValue()));
                }
                authN.setProperties(properties);
            }
        }
        source.setAuthN(authN);
        return source;
    }
}
