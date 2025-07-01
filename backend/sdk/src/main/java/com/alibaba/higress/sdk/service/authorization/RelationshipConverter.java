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
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;

import com.alibaba.higress.sdk.model.authorization.AuthorizationRelationship;
import com.alibaba.higress.sdk.model.authorization.AuthorizationResourceTypeEnum;
import com.alibaba.higress.sdk.model.authorization.CredentialTypeEnum;
import com.alibaba.higress.sdk.model.mcp.ConsumerAuthInfo;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.service.mcp.McpServerHelper;
import com.google.common.collect.Lists;

/**
 * @author lvshui
 */
public class RelationshipConverter {

    public static List<AuthorizationRelationship> convert(String resourceName, ConsumerAuthInfo authInfo) {
        Objects.requireNonNull(resourceName);

        if (Objects.isNull(authInfo) || CollectionUtils.isEmpty(authInfo.getAllowedConsumers())) {
            return Lists.newArrayList();
        }

        return authInfo.getAllowedConsumers().stream().map(consumerName -> {
            AuthorizationRelationship relationship = new AuthorizationRelationship();
            relationship.setResourceName(resourceName);
            relationship.setResourceType(AuthorizationResourceTypeEnum.ROUTE);
            relationship.setConsumerName(consumerName);
            relationship.setConsumerType(CredentialTypeEnum.fromType(authInfo.getType()));
            return relationship;
        }).collect(Collectors.toList());

    }

    public static List<AuthorizationRelationship> convert(McpServerConsumers authInfo) {
        Objects.requireNonNull(authInfo.getMcpServerName());
        String routeName = McpServerHelper.mcpServerName2RouteName(authInfo.getMcpServerName());

        if (CollectionUtils.isEmpty(authInfo.getConsumers())) {
            return Lists.newArrayList();
        }

        return authInfo.getConsumers().stream().map(consumerName -> {
            AuthorizationRelationship relationship = new AuthorizationRelationship();
            relationship.setResourceName(routeName);
            relationship.setResourceType(AuthorizationResourceTypeEnum.ROUTE);
            relationship.setConsumerName(consumerName);
            return relationship;
        }).collect(Collectors.toList());

    }
}
