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
package com.alibaba.higress.console.controller.dto;

import lombok.Data;

import java.util.List;

@Data
public class RegistryConfig {

    /**
     * nacos,nacos2,zookeeper,consul,eureka
     */
    private  String type;


    private  String name;

    private  String domain;

    private  Integer port;

    private  String consulNamespace;

    private List<String> zkServicesPath;

    private  String nacosNamespaceId;

    private  List<String> nacosGroups;
}
