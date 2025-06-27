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
package com.alibaba.higress.sdk.service.mcp;

import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumerDetail;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumers;
import com.alibaba.higress.sdk.model.mcp.McpServerConsumersPageQuery;
import com.alibaba.higress.sdk.model.mcp.McpServerPageQuery;

/**
 * @author Thomas-eliot
 */
public interface McpServerService {

    /**
     * list mcp server
     *
     * @param query mcp server query
     * @return mcp server page list
     */
    PaginatedResult<McpServer> list(McpServerPageQuery query);

    /**
     * query mcp server detail
     *
     * @param name mcp server name
     * @return mcp server
     */
    McpServer query(String name);

    /**
     * add or update mcp server
     *
     * @param instance mcp server
     * @return mcp server
     */
    McpServer addOrUpdate(McpServer instance);

    /**
     * add or update mcp server with override Authorization config
     *
     * @param instance mcp server
     * @return mcp server
     */
    McpServer addOrUpdateWithAuthorization(McpServer instance);

    /**
     * delete mcp server
     *
     * @param name mcp server name
     */
    void delete(String name);

    /**
     * add allow consumers
     *
     * @param consumers mcp server consumers
     */
    void addAllowConsumers(McpServerConsumers consumers);

    /**
     * delete allow consumers
     *
     * @param consumers mcp server consumers
     */
    void deleteAllowConsumers(McpServerConsumers consumers);

    /**
     * list allow consumers
     *
     * @param query mcp server consumers query
     * @return mcp server consumers page list
     */
    PaginatedResult<McpServerConsumerDetail> listAllowConsumers(McpServerConsumersPageQuery query);

}
