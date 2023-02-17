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

import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.springframework.http.HttpStatus;

import com.alibaba.higress.console.client.grafana.models.DashboardPostResult;
import com.alibaba.higress.console.client.grafana.models.Datasource;
import com.alibaba.higress.console.client.grafana.models.DatasourceCreationResult;
import com.alibaba.higress.console.client.grafana.models.GrafanaDashboard;
import com.alibaba.higress.console.client.grafana.models.GrafanaSearchResult;
import com.alibaba.higress.console.client.grafana.models.SearchType;
import com.alibaba.higress.console.controller.exception.NotFoundException;
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import okhttp3.OkHttpClient;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.jackson.JacksonConverterFactory;

/**
 * @author CH3CHO
 */
public class GrafanaClient {

    private static final ObjectMapper MAPPER =
        new ObjectMapper().disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .setVisibility(PropertyAccessor.FIELD, JsonAutoDetect.Visibility.ANY);

    private final String authorizationData;

    private final GrafanaService service;

    public GrafanaClient(String baseUrl, String username, String password) {
        authorizationData = "Basic " + Base64.getEncoder().encodeToString((username + ":" + password).getBytes());

        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }
        Retrofit retrofit = new Retrofit.Builder().baseUrl(baseUrl).client(new OkHttpClient())
            .addConverterFactory(JacksonConverterFactory.create(MAPPER)).build();
        service = retrofit.create(GrafanaService.class);
    }

    public static GrafanaDashboard parseDashboardData(String json) throws IOException {
        return new GrafanaDashboard(null, MAPPER.readValue(json, ObjectNode.class));
    }

    public GrafanaDashboard getDashboard(String uid) throws GrafanaApiException, IOException {
        Response<GrafanaDashboard> response = service.getDashboard(authorizationData, uid).execute();
        if (response.isSuccessful()) {
            return response.body();
        } else if (response.code() == HttpStatus.NOT_FOUND.value()) {
            throw new NotFoundException("Dashboard " + uid + " does not exist");
        } else {
            throw GrafanaApiException.withErrorBody(response.errorBody());
        }
    }

    public DashboardPostResult createDashboard(GrafanaDashboard dashboard) throws GrafanaApiException, IOException {
        return updateDashboard(dashboard);
    }

    public DashboardPostResult updateDashboard(GrafanaDashboard dashboard) throws IOException, GrafanaApiException {
        Response<DashboardPostResult> response = service.postDashboard(authorizationData, dashboard).execute();
        if (response.isSuccessful()) {
            return response.body();
        } else {
            throw GrafanaApiException.withErrorBody(response.errorBody());
        }
    }

    public List<Datasource> getDatasources() throws GrafanaApiException, IOException {
        Response<List<Datasource>> response = service.getDataSources(authorizationData).execute();
        if (response.isSuccessful()) {
            return response.body();
        } else {
            throw GrafanaApiException.withErrorBody(response.errorBody());
        }
    }

    public Datasource getDatasource(String name) throws GrafanaApiException, IOException {
        Response<Datasource> response = service.getDataSource(authorizationData, name).execute();
        if (response.isSuccessful()) {
            return response.body();
        } else {
            throw GrafanaApiException.withErrorBody(response.errorBody());
        }
    }

    public DatasourceCreationResult createDatasource(Datasource ds) throws GrafanaApiException, IOException {
        Response<DatasourceCreationResult> response = service.createDataSource(authorizationData, ds).execute();
        if (response.isSuccessful()) {
            return response.body();
        } else {
            throw GrafanaApiException.withErrorBody(response.errorBody());
        }
    }

    public DatasourceCreationResult updateDatasource(Datasource ds, int id) throws GrafanaApiException, IOException {
        Response<DatasourceCreationResult> response = service.updateDatasource(authorizationData, ds, id).execute();
        if (response.isSuccessful()) {
            return response.body();
        } else {
            throw GrafanaApiException.withErrorBody(response.errorBody());
        }
    }

    public List<GrafanaSearchResult> search(String query, SearchType type, String tag, Boolean starred)
        throws GrafanaApiException, IOException {
        Response<List<GrafanaSearchResult>> response =
            service.search(authorizationData, query, type != null ? type.getValue() : null, tag, starred).execute();
        if (response.isSuccessful()) {
            return response.body();
        } else {
            throw GrafanaApiException.withErrorBody(response.errorBody());
        }
    }
}
