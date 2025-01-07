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


package com.alibaba.higress.sdk.service.kubernetes.crd.gatewayapi.gatewayclass;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

/**
 * Spec defines the desired state of GatewayClass.
 */
@Data
public class V1GatewayClassSpec {
    public static final String CONTROLLER_NAME = "higress.io/gateway-controller";

    public static final String SERIALIZED_NAME_CONTROLLER_NAME = "controllerName";
    public static final String SERIALIZED_NAME_DESCRIPTION = "description";
    public static final String SERIALIZED_NAME_PARAMETERS_REF = "parametersRef";
    @SerializedName(SERIALIZED_NAME_CONTROLLER_NAME)
    private String controllerName = CONTROLLER_NAME;
    @SerializedName(SERIALIZED_NAME_DESCRIPTION)
    private String description;
    @SerializedName(SERIALIZED_NAME_PARAMETERS_REF)
    private V1GatewayClassSpecParametersRef parametersRef;

}

