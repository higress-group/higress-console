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
package com.alibaba.higress.console.client.grafana;

import java.util.List;

import com.alibaba.higress.console.client.grafana.models.DashboardPostResult;
import com.alibaba.higress.console.client.grafana.models.Datasource;
import com.alibaba.higress.console.client.grafana.models.DatasourceCreationResult;
import com.alibaba.higress.console.client.grafana.models.GrafanaDashboard;
import com.alibaba.higress.console.client.grafana.models.GrafanaSearchResult;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

/**
 * @author CH3CHO
 */
public interface GrafanaService {

    String GRAFANA_DASHBOARDS_UID = "api/dashboards/uid/";
    String GRAFANA_DASHBOARDS_DB = "api/dashboards/db/";
    String GRAFANA_DATASOURCES = "api/datasources/";
    String GRAFANA_SEARCH = "api/search/";
    String AUTHORIZATION = "Authorization";

    @GET(GRAFANA_DASHBOARDS_UID + "{uid}")
    Call<GrafanaDashboard> getDashboard(@Header(AUTHORIZATION) String authorization, @Path("uid") String uid);

    @POST(GRAFANA_DASHBOARDS_DB)
    Call<DashboardPostResult> postDashboard(@Header(AUTHORIZATION) String authorization, @Body GrafanaDashboard dashboard);

    @POST(GRAFANA_DATASOURCES)
    Call<DatasourceCreationResult> createDataSource(@Header(AUTHORIZATION) String authorization, @Body Datasource ds);

    @PUT(GRAFANA_DATASOURCES + "{id}")
    Call<DatasourceCreationResult> updateDatasource(@Header(AUTHORIZATION) String authorization, @Body Datasource ds,
        @Path("id") int id);

    @GET(GRAFANA_DATASOURCES)
    Call<List<Datasource>> getDataSources(@Header(AUTHORIZATION) String authorization);

    @GET(GRAFANA_DATASOURCES + "name/{name}")
    Call<Datasource> getDataSource(@Header(AUTHORIZATION) String authorization, @Path("name") String name);

    @GET(GRAFANA_SEARCH)
    Call<List<GrafanaSearchResult>> search(@Header(AUTHORIZATION) String authorization, @Query("query") String query,
        @Query("type") String type, @Query("tag") String tag, @Query("starred") Boolean starred);
}