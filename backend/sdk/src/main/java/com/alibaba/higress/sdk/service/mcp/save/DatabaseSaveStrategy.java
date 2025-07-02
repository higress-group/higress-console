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
package com.alibaba.higress.sdk.service.mcp.save;

import java.util.Objects;

import com.alibaba.higress.sdk.service.mcp.McpServerConfigMapHelper;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConfigMap;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.alibaba.higress.sdk.service.RouteService;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;

import lombok.extern.slf4j.Slf4j;

/**
 * @author lvshui
 */
@Slf4j
public class DatabaseSaveStrategy extends AbstractMcpServerSaveStrategy {

    public DatabaseSaveStrategy(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService,
        RouteService routeService) {
        super(kubernetesClientService, kubernetesModelConverter, wasmPluginInstanceService, routeService);
    }

    @Override
    public boolean support(McpServer mcpServer) {
        return McpServerTypeEnum.DATABASE.equals(mcpServer.getType());
    }

    @Override
    protected void saveMcpServerConfig(McpServer mcpInstance) {
        addOrUpdateServersConfig(mcpInstance);
    }

    private void validate(McpServer mcpInstance) {
        if (StringUtils.isBlank(mcpInstance.getDsn())) {
            throw new ValidationException("dsn cannot be blank.");
        }
        if (Objects.isNull(mcpInstance.getDbType())) {
            throw new ValidationException("dbType is null.");
        }
    }

    private void addOrUpdateServersConfig(McpServer mcpInstance) {
        validate(mcpInstance);

        try {
            McpServerConfigMap.DBServerConfig dbConfig = new McpServerConfigMap.DBServerConfig();
            dbConfig.setDsn(mcpInstance.getDsn());
            dbConfig.setDbType(mcpInstance.getDbType().getValue());

            mcpServerConfigMapHelper.updateServerConfig(severs -> {
                severs.removeIf(server -> server.getName().equals(mcpInstance.getName()));

                McpServerConfigMap.Server server = new McpServerConfigMap.Server();
                server.setName(mcpInstance.getName());
                server.setPath(McpServerConfigMapHelper.generateMcpServerPath(mcpInstance.getName()));
                server.setType(McpServerTypeEnum.DATABASE.getValue());
                server.setConfig(dbConfig);
                severs.add(server);
            });

        } catch (Exception e) {
            throw new BusinessException("Error occurs when add or update mcp servers config: ", e);
        }
    }

}
