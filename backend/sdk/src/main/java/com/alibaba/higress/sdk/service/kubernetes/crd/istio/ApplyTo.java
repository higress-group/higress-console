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

public enum ApplyTo {

    /**
     * Invalid value.
     */
    INVALID(0),

    /**
     * Applies the patch to the listener.
     */
    LISTENER(1),

    /**
     * Applies the patch to the filter chain.
     */
    FILTER_CHAIN(2),

    /**
     * Applies the patch to the network filter chain, to modify an existing filter or add a new filter.
     */
    NETWORK_FILTER(3),

    /**
     * Applies the patch to the HTTP filter chain in the http connection manager, to modify an existing filter or add a
     * new filter.
     */
    HTTP_FILTER(4),

    /**
     * Applies the patch to the Route configuration (rds output) inside a HTTP connection manager. This does not apply
     * to the virtual host. Currently, only MERGE operation is allowed on the route configuration objects.
     */
    ROUTE_CONFIGURATION(5),

    /**
     * Applies the patch to a virtual host inside a route configuration.
     */
    VIRTUAL_HOST(6),

    /**
     * Applies the patch to a route object inside the matched virtual host in a route configuration. Currently, only
     * MERGE operation is allowed on the route objects.
     */
    HTTP_ROUTE(7),

    /**
     * Applies the patch to a cluster in a CDS output. Also used to add new clusters.
     */
    CLUSTER(8);

    private final int intValue;

    ApplyTo(int intValue) {
        this.intValue = intValue;
    }

    public int value() {
        return intValue;
    }
}
