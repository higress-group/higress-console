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

import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.GLOBAL_AUTH;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.IN_HEADER;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.IN_QUERY;
import static com.alibaba.higress.sdk.constant.plugin.config.KeyAuthConfig.KEYS;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.authorization.AuthorizationOfRouteConfig;
import com.alibaba.higress.sdk.model.authorization.AuthorizationRelationship;
import com.alibaba.higress.sdk.model.authorization.AuthorizationResourceTypeEnum;
import com.alibaba.higress.sdk.service.WasmPluginInstanceService;
import com.alibaba.higress.sdk.util.MapUtil;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import lombok.extern.slf4j.Slf4j;

/**
 * @author lvshui
 */
@Slf4j
public class AuthorizationOfKeyAuthServiceImpl implements AuthorizationService {

    private static final List<String> DEFAULT_KEYS = Lists.newArrayList("Authorization", "x-api-key");

    private final WasmPluginInstanceService wasmPluginInstanceService;

    public AuthorizationOfKeyAuthServiceImpl(WasmPluginInstanceService wasmPluginInstanceService) {
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    private WasmPluginInstance buildGlobalKeyAuthRequest() {
        WasmPluginInstance keyAuthInstance =
            WasmPluginInstance.builder().pluginName(BuiltInPluginName.KEY_AUTH).enabled(true).build();
        keyAuthInstance.setGlobalTarget();
        keyAuthInstance.setInternal(true);
        Map<String, Object> configurations = new HashMap<>();
        configurations.put(GLOBAL_AUTH, false);
        configurations.put(IN_HEADER, true);
        configurations.put(IN_QUERY, false);
        configurations.put(KEYS, DEFAULT_KEYS);
        keyAuthInstance.setConfigurations(configurations);
        return keyAuthInstance;
    }

    @Override
    public void init() {
        WasmPluginInstance globalKeyAuth =
            wasmPluginInstanceService.query(WasmPluginInstanceScope.GLOBAL, null, BuiltInPluginName.KEY_AUTH, true);
        if (globalKeyAuth == null) {
            WasmPluginInstance keyAuthRequest = buildGlobalKeyAuthRequest();
            wasmPluginInstanceService.addOrUpdate(keyAuthRequest);
        } else {
            Map<String, Object> configurations = globalKeyAuth.getConfigurations();
            Set<String> keysValue = Sets.newHashSet();
            if (Objects.nonNull(configurations.get(KEYS))) {
                keysValue =
                    JSON.parseObject(JSON.toJSONString(configurations.get(KEYS)), new TypeReference<Set<String>>() {});
            }
            keysValue.addAll(Lists.newArrayList("Authorization", "x-api-key"));
            configurations.put(KEYS, keysValue);
            globalKeyAuth.setConfigurations(null);
            globalKeyAuth.setRawConfigurations(JSON.toJSONString(configurations));
            wasmPluginInstanceService.addOrUpdate(globalKeyAuth);
        }
    }

    @Override
    public void bind(AuthorizationRelationship relationship) {
        bindList(Collections.singletonList(relationship));
    }

    @Override
    public void bindList(List<AuthorizationRelationship> relationships) {
        if (CollectionUtils.isEmpty(relationships)) {
            return;
        }
        Map<String, List<String>> resourceMap =
            relationships.stream().collect(Collectors.groupingBy(AuthorizationRelationship::getResourceName,
                Collectors.mapping(AuthorizationRelationship::getConsumerName, Collectors.toList())));
        resourceMap.forEach(this::addAllowList);
    }

    private void addAllowList(String resourceName, List<String> consumerNameList) {
        Map<WasmPluginInstanceScope, String> targets = MapUtil.of(WasmPluginInstanceScope.ROUTE, resourceName);
        WasmPluginInstance existInstance = wasmPluginInstanceService.query(targets, BuiltInPluginName.KEY_AUTH, true);

        WasmPluginInstance newInstance;
        AuthorizationOfRouteConfig authRouteConfig;
        if (Objects.isNull(existInstance)) {
            newInstance = new WasmPluginInstance();
            newInstance.setTargets(targets);
            newInstance.setInternal(Boolean.TRUE);
            newInstance.setPluginName(BuiltInPluginName.KEY_AUTH);

            authRouteConfig = new AuthorizationOfRouteConfig();
        } else {
            newInstance = existInstance;
            authRouteConfig = JSON.parseObject(JSON.toJSONString(existInstance.getConfigurations()),
                AuthorizationOfRouteConfig.class);
        }
        authRouteConfig.addAllAllow(consumerNameList);
        newInstance.setConfigurations(null);
        newInstance.setRawConfigurations(JSON.toJSONString(authRouteConfig));
        wasmPluginInstanceService.addOrUpdate(newInstance);
    }

    private void removeAllowList(String resourceName, List<String> consumerNameList) {
        Map<WasmPluginInstanceScope, String> targets = MapUtil.of(WasmPluginInstanceScope.ROUTE, resourceName);
        WasmPluginInstance existInstance = wasmPluginInstanceService.query(targets, BuiltInPluginName.KEY_AUTH, true);

        if (Objects.isNull(existInstance) || MapUtils.isEmpty(existInstance.getConfigurations())) {
            return;
        }
        AuthorizationOfRouteConfig authRouteConfig =
            JSON.parseObject(JSON.toJSONString(existInstance.getConfigurations()), AuthorizationOfRouteConfig.class);
        if (Objects.isNull(authRouteConfig.getAllow()) || CollectionUtils.isEmpty(authRouteConfig.getAllow())) {
            return;
        }

        consumerNameList.forEach(authRouteConfig.getAllow()::remove);
        existInstance.setConfigurations(null);
        existInstance.setRawConfigurations(JSON.toJSONString(authRouteConfig));
        wasmPluginInstanceService.addOrUpdate(existInstance);
    }

    @Override
    public void unbind(AuthorizationRelationship relationship) {
        unbindList(Collections.singletonList(relationship));
    }

    @Override
    public void unbindAll(String resourceName) {
        if (StringUtils.isBlank(resourceName)) {
            throw new IllegalArgumentException("resourceName cannot be null or blank.");
        }
        Map<WasmPluginInstanceScope, String> targets = MapUtil.of(WasmPluginInstanceScope.ROUTE, resourceName);
        wasmPluginInstanceService.delete(targets, BuiltInPluginName.KEY_AUTH);
    }

    @Override
    public void unbindList(List<AuthorizationRelationship> relationships) {
        if (CollectionUtils.isEmpty(relationships)) {
            return;
        }
        Map<String, List<String>> resourceMap =
            relationships.stream().collect(Collectors.groupingBy(AuthorizationRelationship::getResourceName,
                Collectors.mapping(AuthorizationRelationship::getConsumerName, Collectors.toList())));
        resourceMap.forEach(this::removeAllowList);
    }

    @Override
    public List<AuthorizationRelationship> boundList(AuthorizationRelationship param) {
        String resourceName = param.getResourceName();
        List<WasmPluginInstance> instanceList;
        if (StringUtils.isNotBlank(resourceName)) {
            Map<WasmPluginInstanceScope, String> targets = MapUtil.of(WasmPluginInstanceScope.ROUTE, resourceName);
            WasmPluginInstance existInstance =
                wasmPluginInstanceService.query(targets, BuiltInPluginName.KEY_AUTH, true);
            instanceList = Lists.newArrayList(existInstance);
        } else {
            instanceList = wasmPluginInstanceService.list(BuiltInPluginName.KEY_AUTH, true);
        }
        if (CollectionUtils.isEmpty(instanceList)) {
            return Collections.emptyList();
        }

        return instanceList.stream().filter(i -> MapUtils.isNotEmpty(i.getConfigurations())).map(i -> {
            AuthorizationOfRouteConfig authRouteConfig =
                JSON.parseObject(JSON.toJSONString(i.getConfigurations()), AuthorizationOfRouteConfig.class);
            if (Objects.isNull(authRouteConfig.getAllow()) || CollectionUtils.isEmpty(authRouteConfig.getAllow())) {
                return null;
            }
            if (StringUtils.isNotBlank(param.getConsumerName())) {
                authRouteConfig.getAllow().removeIf(c -> !StringUtils.contains(c, param.getConsumerName()));
            }
            return authRouteConfig.getAllow().stream().map(c -> {
                AuthorizationRelationship relationship = new AuthorizationRelationship();
                relationship.setConsumerName(c);
                relationship.setResourceName(i.getTargets().get(WasmPluginInstanceScope.ROUTE));
                relationship.setResourceType(AuthorizationResourceTypeEnum.ROUTE);
                return relationship;
            }).collect(Collectors.toList());
        }).filter(CollectionUtils::isNotEmpty).flatMap(Collection::stream).collect(Collectors.toList());

    }
}
