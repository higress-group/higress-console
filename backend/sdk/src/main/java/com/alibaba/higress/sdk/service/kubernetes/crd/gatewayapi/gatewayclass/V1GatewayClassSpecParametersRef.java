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
 * ParametersRef is a reference to a resource that contains the configuration parameters corresponding to the GatewayClass. This is optional if the controller does not require any additional configuration.   ParametersRef can reference a standard Kubernetes resource, i.e. ConfigMap, or an implementation-specific custom resource. The resource can be cluster-scoped or namespace-scoped.   If the referent cannot be found, refers to an unsupported kind, or when the data within that resource is malformed, the GatewayClass SHOULD be rejected with the \&quot;Accepted\&quot; status condition set to \&quot;False\&quot; and an \&quot;InvalidParameters\&quot; reason.   A Gateway for this GatewayClass may provide its own &#x60;parametersRef&#x60;. When both are specified, the merging behavior is implementation specific. It is generally recommended that GatewayClass provides defaults that can be overridden by a Gateway.   Support: Implementation-specific
 */
@Data
public class V1GatewayClassSpecParametersRef {
    public static final String SERIALIZED_NAME_KIND = "kind";
    public static final String SERIALIZED_NAME_NAME = "name";
    public static final String SERIALIZED_NAME_NAMESPACE = "namespace";
    static final String SERIALIZED_NAME_GROUP = "group";
    @SerializedName(SERIALIZED_NAME_GROUP)
    private String group;
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind;
    @SerializedName(SERIALIZED_NAME_NAME)
    private String name;
    @SerializedName(SERIALIZED_NAME_NAMESPACE)
    private String namespace;

}

