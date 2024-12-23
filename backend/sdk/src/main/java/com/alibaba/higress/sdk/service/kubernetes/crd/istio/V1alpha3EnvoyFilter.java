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
package com.alibaba.higress.sdk.service.kubernetes.crd.istio;

import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.Data;

@Data
public class V1alpha3EnvoyFilter  implements io.kubernetes.client.common.KubernetesObject{

    public static final String API_GROUP = "networking.istio.io";

    public static final String VERSION = "v1alpha3";

    public static final String KIND = "EnvoyFilter";

    public static final String PLURAL = "envoyfilters";

    private String apiVersion = API_GROUP + "/" + VERSION;

    private String kind = KIND;

    private V1ObjectMeta metadata;

    private V1alpha3EnvoyFilterSpec spec;

    @Override
    public V1ObjectMeta getMetadata() {
        return metadata;
    }
}
