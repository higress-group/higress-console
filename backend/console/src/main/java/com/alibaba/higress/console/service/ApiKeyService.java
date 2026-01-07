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

import java.util.List;

import com.alibaba.higress.console.controller.dto.ApiKeyGroup;
import com.alibaba.higress.console.controller.dto.ApiKeyInfo;

/**
 * Service for managing API keys and their group mappings.
 */
public interface ApiKeyService {

    /**
     * List all API keys with their group information.
     * @return List of API key information
     */
    List<ApiKeyInfo> listApiKeys();

    /**
     * Get group information for a specific customer.
     * @param customerName The customer name
     * @return List of API key groups
     */
    List<ApiKeyGroup> getCustomerGroups(String customerName);

    /**
     * Create or update an API key group.
     * @param group The group to create or update
     */
    void upsertGroup(ApiKeyGroup group);

    /**
     * Remove an API key group.
     * @param groupName The group name to remove
     */
    void removeGroup(String groupName);

    /**
     * List all API key groups.
     * @param groupName Optional group name filter
     * @return List of API key groups
     */
    List<ApiKeyGroup> listGroups(String groupName);

    /**
     * Add a customer to a group.
     * @param groupId The group id
     * @param customerId The customer id
     */
    void addMapping(Long groupId, Long customerId);

    /**
     * Remove a customer from a group.
     * @param groupId The group id
     * @param customerId The customer id
     */
    void removeMapping(Long groupId, Long customerId);
}
