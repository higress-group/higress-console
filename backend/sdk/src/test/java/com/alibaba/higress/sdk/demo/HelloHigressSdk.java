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
package com.alibaba.higress.sdk.demo;

import java.io.IOException;
import java.util.List;

import com.alibaba.higress.sdk.config.HigressServiceConfig;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RoutePageQuery;
import com.alibaba.higress.sdk.service.HigressServiceProvider;

public class HelloHigressSdk {

    public static void main(String[] args) {
        HigressServiceProvider provider;
        try {
            HigressServiceConfig.Builder builder = HigressServiceConfig.builder();
            provider = HigressServiceProvider.create(builder.build());
        } catch (IOException e) {
            throw new RuntimeException("Unable to create HigressServiceProvider", e);
        }

        List<Route> routes = provider.routeService().list(new RoutePageQuery()).getData();
        System.out.println(routes.size());
        for (Route route : routes) {
            System.out.println(route.getName());
        }

        System.exit(0);
    }
}
