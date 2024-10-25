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

public enum PatchContext {

    /**
     * All listeners/routes/clusters in both sidecars and gateways.
     */
    ANY(0),

    /**
     * Inbound listener/route/cluster in sidecar.
     */
    SIDECAR_INBOUND(1),

    /**
     * Outbound listener/route/cluster in sidecar.
     */
    SIDECAR_OUTBOUND(2),

    /**
     * Gateway listener/route/cluster.
     */
    GATEWAY(3);

    private final int intValue;

    PatchContext(int intValue) {
        this.intValue = intValue;
    }

    public int value() {
        return intValue;
    }
}
