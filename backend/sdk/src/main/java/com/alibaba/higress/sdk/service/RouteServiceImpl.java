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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.httproute.V1HTTPRoute;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.http.HttpStatus;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Ingress;
import lombok.extern.slf4j.Slf4j;

@Slf4j
class RouteServiceImpl implements RouteService {

    private final KubernetesClientService kubernetesClientService;
    private final KubernetesModelConverter kubernetesModelConverter;
    private final WasmPluginInstanceService wasmPluginInstanceService;

    public RouteServiceImpl(KubernetesClientService kubernetesClientService,
        KubernetesModelConverter kubernetesModelConverter, WasmPluginInstanceService wasmPluginInstanceService) {
        this.kubernetesClientService = kubernetesClientService;
        this.kubernetesModelConverter = kubernetesModelConverter;
        this.wasmPluginInstanceService = wasmPluginInstanceService;
    }

    @Override
    public PaginatedResult<Route> list(RoutePageQuery query) {
        // list ingress
        List<V1Ingress> ingresses;
        if (query != null && StringUtils.isNotEmpty(query.getDomainName())) {
            ingresses = kubernetesClientService.listIngressByDomain(query.getDomainName());
        } else {
            ingresses = kubernetesClientService.listIngress();
        }
        List<V1Ingress> supportedIngresses =
                ingresses.stream().filter(kubernetesModelConverter::isIngressSupported).toList();
        List<Route> ingressResult = supportedIngresses.stream().map(kubernetesModelConverter::ingress2Route).toList();
        // list httpRoute
        List<V1HTTPRoute> httpRoutes;
        if (query != null && StringUtils.isNotEmpty(query.getDomainName())) {
            httpRoutes = kubernetesClientService.listHttpRouteByDomain(query.getDomainName());
        } else {
            httpRoutes = kubernetesClientService.listHttpRoute();
        }
        List<V1HTTPRoute> supportedHttpRoutes =
                httpRoutes.stream().filter(kubernetesModelConverter::isHttpRouteSupported).toList();
        List<Route> httpRouteResult = supportedHttpRoutes.stream().map(kubernetesModelConverter::httpRoute2Route).toList();
        if (CollectionUtils.isEmpty(ingressResult) && CollectionUtils.isEmpty(httpRouteResult)) {
            return PaginatedResult.createFromFullList(Collections.emptyList(), query);
        }
        if(!ingressResult.isEmpty()){
            if(!httpRouteResult.isEmpty()){
                ingressResult = new ArrayList<>(ingressResult);
                ingressResult.addAll(httpRouteResult);
            }
        }else{
            ingressResult = httpRouteResult;
        }
        return PaginatedResult.createFromFullList(ingressResult, query);
    }

    @Override
    public Route query(String routeName) {
        V1Ingress ingress;
        try {
            ingress = kubernetesClientService.readIngress(routeName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading the Ingress with name: " + routeName, e);
        }
        if (ingress != null) {
            return kubernetesModelConverter.ingress2Route(ingress);
        }
        V1HTTPRoute httpRoute;
        try {
            httpRoute = kubernetesClientService.readHttpRoute(routeName);
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when reading the HttpRoute with name: " + routeName, e);
        }
        if (httpRoute != null) {
            return kubernetesModelConverter.httpRoute2Route(httpRoute);
        }
        return null;
    }

    @Override
    public Route add(Route route) {
        if(kubernetesClientService.isIngressWorkMode()){
            V1Ingress ingress = kubernetesModelConverter.route2Ingress(route);
            V1Ingress newIngress;
            try {
                newIngress = kubernetesClientService.createIngress(ingress);
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException(
                        "Error occurs when adding the ingress generated by route with name: " + route.getName(), e);
            }
            return kubernetesModelConverter.ingress2Route(newIngress);
        } else {
            V1HTTPRoute httpRoute = kubernetesModelConverter.route2HttpRoute(route);
            V1HTTPRoute newHttpRoute;
            try {
                newHttpRoute = kubernetesClientService.createHttpRoute(httpRoute);
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException(
                        "Error occurs when adding the httproute generated by route with name: " + route.getName(), e);
            }
            return kubernetesModelConverter.httpRoute2Route(newHttpRoute);
        }

    }

    @Override
    public Route update(Route route) {
        String name = route.getName();
        if (StringUtils.isEmpty(name)) {
            throw new IllegalArgumentException("Route name must not be null");
        }
        V1Ingress findIngress;
        try {
            findIngress = kubernetesClientService.readIngress(name);
        } catch (ApiException e) {
            throw new BusinessException(
                    "Error occurs when read ingress by route with name:  " + route.getName(), e);
        }
        if (findIngress != null) {
            V1Ingress ingress = kubernetesModelConverter.route2Ingress(route);
            V1Ingress updatedIngress;
            try {
                updatedIngress = kubernetesClientService.replaceIngress(ingress);
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException(
                        "Error occurs when updating the ingress generated by route with name: " + route.getName(), e);
            }
            return kubernetesModelConverter.ingress2Route(updatedIngress);
        }
        V1HTTPRoute findHttpRoute;
        try {
            findHttpRoute = kubernetesClientService.readHttpRoute(name);
        } catch (ApiException e) {
            throw new BusinessException(
                    "Error occurs when read httpRoute generated by route with name: " + route.getName(), e);
        }
        if (findHttpRoute != null) {
            V1HTTPRoute httpRoute = kubernetesModelConverter.route2HttpRoute(route);
            V1HTTPRoute updatedHttpRoute;
            try {
                updatedHttpRoute = kubernetesClientService.replaceHttpRoute(httpRoute);
            } catch (ApiException e) {
                if (e.getCode() == HttpStatus.CONFLICT) {
                    throw new ResourceConflictException();
                }
                throw new BusinessException(
                        "Error occurs when updating the httpRoute generated by route with name: " + route.getName(), e);
            }
            return kubernetesModelConverter.httpRoute2Route(updatedHttpRoute);
        }
        return null;
    }

    @Override
    public void delete(String name) {
        Boolean isIngress = Boolean.TRUE;
        try {
            V1Ingress ingress = kubernetesClientService.readIngress(name);
            if (ingress != null) {
                kubernetesClientService.deleteIngress(name);
            } else {
                isIngress = Boolean.FALSE;
                kubernetesClientService.deleteHttpRoute(name);
                if (!HigressConstants.NS_DEFAULT.equals(kubernetesClientService.httpRouteNameSpace)) {
                    name = kubernetesClientService.httpRouteNameSpace + Separators.SLASH + name;
                }
            }
        } catch (ApiException e) {
            throw new BusinessException("Error occurs when deleting"+ (isIngress?"ingress":"httpRoute") +"with name: " + name, e);
        }
        wasmPluginInstanceService.deleteAll(WasmPluginInstanceScope.ROUTE, name);
    }
}
