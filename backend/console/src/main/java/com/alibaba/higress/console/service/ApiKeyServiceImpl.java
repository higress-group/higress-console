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
package com.alibaba.higress.console.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.higress.console.controller.dto.ApiKeyGroup;
import com.alibaba.higress.console.controller.dto.ApiKeyInfo;

import org.apache.http.HttpEntity;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ApiKeyServiceImpl implements ApiKeyService {

    private static final String API_KEY_LIST_PATH = "/apiKey/list";
    private static final String API_KEY_GROUP_INFO_PATH = "/apiKey/groupInfos";
    private static final String API_KEY_GROUP_UPSERT_PATH = "/apiKey/group/upinsert";
    private static final String API_KEY_GROUP_REMOVE_PATH = "/apiKey/group/remove";
    private static final String API_KEY_GROUP_LIST_PATH = "/apiKey/group/list";
    private static final String API_KEY_GROUP_ADD_MAPPING_PATH = "/apiKey/group/mapping/add";
    private static final String API_KEY_GROUP_DEL_MAPPING_PATH = "/apiKey/group/mapping/del";

    @Value("${higress-console.api-key.service.url:http://localhost:8170}")
    private String serviceUrl;

    @Value("${higress-console.api-key.connection-timeout:5000}")
    private int connectionTimeout;

    @Value("${higress-console.api-key.socket-timeout:30000}")
    private int socketTimeout;

    private CloseableHttpClient httpClient;

    @PostConstruct
    public void init() {
        RequestConfig requestConfig = RequestConfig.custom()
            .setConnectTimeout(connectionTimeout)
            .setSocketTimeout(socketTimeout)
            .build();
        httpClient = HttpClients.custom()
            .setDefaultRequestConfig(requestConfig)
            .build();
    }

    private String buildUrl(String path) {
        String baseUrl = serviceUrl;
        if (baseUrl == null || baseUrl.isEmpty()) {
            baseUrl = "";
        }
        if (!baseUrl.endsWith("/") && !path.startsWith("/")) {
            baseUrl += "/";
        }
        return baseUrl + path;
    }

    @Override
    public List<ApiKeyInfo> listApiKeys() {
        try {
            String url = buildUrl(API_KEY_LIST_PATH);
            HttpGet httpGet = new HttpGet(url);
            String response = executeRequest(httpGet);
            JSONArray jsonArray = JSON.parseArray(response);
            List<ApiKeyInfo> result = new ArrayList<>();
            for (int i = 0; i < jsonArray.size(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                ApiKeyInfo info = new ApiKeyInfo();
                info.setCustomerId(obj.getLong("id"));
                info.setCustomerName(obj.getString("api_key_name"));
                info.setCustomerKey(obj.getString("api_key"));

                // 从 groups 数组中提取 groupNames
                JSONArray groupsArray = obj.getJSONArray("groups");
                List<String> groupNames = new ArrayList<>();
                if (groupsArray != null && !groupsArray.isEmpty()) {
                    for (int j = 0; j < groupsArray.size(); j++) {
                        JSONObject groupObj = groupsArray.getJSONObject(j);
                        String groupName = groupObj.getString("group_name");
                        if (groupName != null && !groupName.isEmpty()) {
                            groupNames.add(groupName);
                        }
                    }
                }
                info.setGroupNames(groupNames);

                result.add(info);
            }
            return result;
        } catch (Exception e) {
            log.error("Failed to list API keys", e);
            throw new RuntimeException("Failed to list API keys: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ApiKeyGroup> getCustomerGroups(String customerName) {
        try {
            String url = buildUrl(API_KEY_GROUP_INFO_PATH) + "?key=" + customerName;
            HttpGet httpGet = new HttpGet(url);
            String response = executeRequest(httpGet);
            JSONArray jsonArray = JSON.parseArray(response);
            List<ApiKeyGroup> result = new ArrayList<>();
            for (int i = 0; i < jsonArray.size(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                ApiKeyGroup group = new ApiKeyGroup();
                group.setId(obj.getLong("id"));
                group.setName(obj.getString("group_name"));
                group.setKey(obj.getString("group_key"));
                result.add(group);
            }
            return result;
        } catch (Exception e) {
            log.error("Failed to get customer groups for customer key: " + customerName, e);
            throw new RuntimeException("Failed to get customer groups: " + e.getMessage(), e);
        }
    }

    @Override
    public void upsertGroup(ApiKeyGroup group) {
        try {
            String url = buildUrl(API_KEY_GROUP_UPSERT_PATH);
            HttpPost httpPost = new HttpPost(url);
            JSONObject json = new JSONObject();
            json.put("groupName", group.getName());
            json.put("groupKey", group.getKey());
            httpPost.setEntity(new StringEntity(json.toJSONString(), ContentType.APPLICATION_JSON));
            executeRequest(httpPost);
        } catch (Exception e) {
            log.error("Failed to upsert group: " + group.getName(), e);
            throw new RuntimeException("Failed to upsert group: " + e.getMessage(), e);
        }
    }

    @Override
    public void removeGroup(String groupName) {
        try {
            String url = buildUrl(API_KEY_GROUP_REMOVE_PATH);
            HttpPost httpPost = new HttpPost(url);
            JSONObject json = new JSONObject();
            json.put("name", groupName);
            httpPost.setEntity(new StringEntity(json.toJSONString(), ContentType.APPLICATION_JSON));
            executeRequest(httpPost);
        } catch (Exception e) {
            log.error("Failed to remove group: " + groupName, e);
            throw new RuntimeException("Failed to remove group: " + e.getMessage(), e);
        }
    }

    @Override
    public List<ApiKeyGroup> listGroups(String groupName) {
        try {
            String url = buildUrl(API_KEY_GROUP_LIST_PATH);
            if (groupName != null && !groupName.isEmpty()) {
                url += "?name=" + groupName;
            }
            HttpGet httpGet = new HttpGet(url);
            String response = executeRequest(httpGet);
            JSONArray jsonArray = JSON.parseArray(response);
            List<ApiKeyGroup> result = new ArrayList<>();
            for (int i = 0; i < jsonArray.size(); i++) {
                JSONObject obj = jsonArray.getJSONObject(i);
                ApiKeyGroup group = new ApiKeyGroup();
                group.setId(obj.getLong("id"));
                group.setName(obj.getString("group_name"));
                group.setKey(obj.getString("group_key"));
                result.add(group);
            }
            return result;
        } catch (Exception e) {
            log.error("Failed to list groups", e);
            throw new RuntimeException("Failed to list groups: " + e.getMessage(), e);
        }
    }

    @Override
    public void addMapping(Long groupId, Long customerId) {
        try {
            String url = buildUrl(API_KEY_GROUP_ADD_MAPPING_PATH);
            HttpPost httpPost = new HttpPost(url);
            JSONObject json = new JSONObject();
            json.put("groupId", groupId);
            json.put("apiKeyId", customerId);
            httpPost.setEntity(new StringEntity(json.toJSONString(), ContentType.APPLICATION_JSON));
            executeRequest(httpPost);
        } catch (Exception e) {
            log.error("Failed to add mapping - groupId: " + groupId + ", customerId: " + customerId, e);
            throw new RuntimeException("Failed to add mapping: " + e.getMessage(), e);
        }
    }

    @Override
    public void removeMapping(Long groupId, Long customerId) {
        try {
            String url = buildUrl(API_KEY_GROUP_DEL_MAPPING_PATH);
            HttpPost httpPost = new HttpPost(url);
            JSONObject json = new JSONObject();
            json.put("groupId", groupId);
            json.put("apiKeyId", customerId);
            httpPost.setEntity(new StringEntity(json.toJSONString(), ContentType.APPLICATION_JSON));
            executeRequest(httpPost);
        } catch (Exception e) {
            log.error("Failed to remove mapping - groupId: " + groupId + ", customerId: " + customerId, e);
            throw new RuntimeException("Failed to remove mapping: " + e.getMessage(), e);
        }
    }

    private String executeRequest(org.apache.http.client.methods.HttpUriRequest request) throws IOException {
        try (CloseableHttpResponse response = httpClient.execute(request)) {
            HttpEntity entity = response.getEntity();
            if (entity == null) {
                throw new IOException("Response entity is null");
            }
            return EntityUtils.toString(entity, StandardCharsets.UTF_8);
        }
    }
}
