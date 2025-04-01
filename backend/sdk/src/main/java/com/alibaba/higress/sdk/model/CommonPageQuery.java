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
package com.alibaba.higress.sdk.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Query criteria for generic entity listing with pagination support.")
public class CommonPageQuery {

    /**
     * Starting from 1
     */
    @Schema(description = "Page number, starting from 1. If omitted, all items will be returned.")
    private Integer pageNum;

    @Schema(description = "Number of items per page. If omitted, all items will be returned.")
    private Integer pageSize;

    public boolean paginationEnabled() {
        return pageNum != null || pageSize != null;
    }
}
