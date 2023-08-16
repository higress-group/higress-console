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
package com.alibaba.higress.console.service.kubernetes.crd.mcp;

import com.alibaba.higress.console.constant.CommonKey;
import com.google.gson.annotations.SerializedName;

import io.kubernetes.client.openapi.models.V1ObjectMeta;
import lombok.Data;

@Data
public class V1McpBridge implements io.kubernetes.client.common.KubernetesObject {

    public static final String API_GROUP = "networking.higress.io";

    public static final String VERSION = "v1";

    public static final String KIND = "McpBridge";

    public static final String PLURAL = "mcpbridges";

    public static final String DEFAULT_NAME = "default";

    public static final String REGISTRY_TYPE_NACOS = "nacos";

    public static final String REGISTRY_TYPE_NACOS2 = "nacos2";

    public static final String REGISTRY_TYPE_NACOS_GROUPS = "nacosGroups";

    public static final String REGISTRY_TYPE_NACOS_NAMESPACE_ID = "nacosNamespaceId";

    public static final String REGISTRY_TYPE_NACOS_USERNAME = "nacosUsername";

    public static final String REGISTRY_TYPE_NACOS_PASSWORD = "nacosPassword";

    public static final String REGISTRY_TYPE_ZK = "zookeeper";

    public static final String REGISTRY_TYPE_ZK_SERVICES_PATH = "zkServicesPath";

    public static final String REGISTRY_TYPE_CONSUL = "consul";

    public static final String REGISTRY_TYPE_CONSUL_DATA_CENTER = "consulDatacenter";

    public static final String REGISTRY_TYPE_CONSUL_SERVICE_TAG = "consulServiceTag";

    public static final String REGISTRY_TYPE_CONSUL_TOKEN = "consulToken";

    public static final String REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL = "consulRefreshInterval";

    public static final int REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MIN = 10;

    public static final int REGISTRY_TYPE_CONSUL_REFRESH_INTERVAL_MAX = 600;

    public static final String REGISTRY_TYPE_EUREKA = "eureka";

    public static final String REGISTRY_TYPE_STATIC = "static";

    public static final String REGISTRY_TYPE_DNS = "dns";

    public static final String REGISTRY_TYPE_STATIC_DNS_SEPARATOR = CommonKey.COMMA;

    public static final String SERIALIZED_NAME_API_VERSION = "apiVersion";
    @SerializedName(SERIALIZED_NAME_API_VERSION)
    private String apiVersion = API_GROUP + "/" + VERSION;

    public static final String SERIALIZED_NAME_KIND = "kind";
    @SerializedName(SERIALIZED_NAME_KIND)
    private String kind = KIND;

    public static final String SERIALIZED_NAME_METADATA = "metadata";
    @SerializedName(SERIALIZED_NAME_METADATA)
    private V1ObjectMeta metadata = null;

    public static final String SERIALIZED_NAME_SPEC = "spec";
    @SerializedName(SERIALIZED_NAME_SPEC)
    private V1McpBridgeSpec spec;

    @Override
    public V1ObjectMeta getMetadata() {
        return metadata;
    }
}
