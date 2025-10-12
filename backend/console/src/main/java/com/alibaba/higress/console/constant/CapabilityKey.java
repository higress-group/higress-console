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
package com.alibaba.higress.console.constant;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 系统能力键值常量类
 *
 * 该类定义了系统支持的各种能力键值，用于标识和管理不同的系统功能特性。
 * 使用Swagger注解提供API文档支持，Lombok注解简化getter方法和构造函数的生成。
 *
 * @author Alibaba Group Holding Ltd.
 * @since 2022-2023
 */
@Getter
@AllArgsConstructor
@Schema(description = "系统能力键值枚举类，定义了系统支持的核心功能标识",
       type = "string",
       allowableValues = {"CONFIG_INGRESS_V1"})
public class CapabilityKey {

    /**
     * 配置Ingress V1版本支持能力键值
     *
     * 该常量表示系统支持Kubernetes Ingress资源的V1版本配置能力。
     * 通常用于标识系统是否具备处理Ingress V1规范配置的能力。
     *
     * 值: "config.ingress.v1"
     * 用途: 系统能力检测和功能开关控制
     */
    public static final String CONFIG_INGRESS_V1 = "config.ingress.v1";
}
