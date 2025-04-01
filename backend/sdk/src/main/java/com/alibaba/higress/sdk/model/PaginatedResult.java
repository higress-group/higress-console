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

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResult<T> implements Serializable {

    public static final int DEFAULT_PAGE_SIZE = 10;

    private Integer pageNum;

    private Integer pageSize;

    private Integer total;

    private List<T> data;

    public static <T> PaginatedResult<T> createFromFullList(List<T> list, CommonPageQuery query) {
        if (list == null) {
            list = Collections.emptyList();
        }
        PaginatedResult<T> result = new PaginatedResult<>();
        result.total = list.size();
        List<T> data = list;
        if (query != null && query.paginationEnabled()) {
            int pageNum = query.getPageNum() != null ? Math.max(1, query.getPageNum()) : 1;
            int pageSize =
                query.getPageSize() != null && query.getPageSize() > 0 ? query.getPageSize() : DEFAULT_PAGE_SIZE;
            int startIndex = (pageNum - 1) * pageSize;
            int endIndex = startIndex + pageSize;
            if (startIndex >= list.size()) {
                data = Collections.emptyList();
            } else if (endIndex > list.size()) {
                data = list.subList(startIndex, list.size());
            } else {
                data = list.subList(startIndex, endIndex);
            }
            result.pageNum = pageNum;
            result.pageSize = pageSize;
        }
        result.data = data;
        return result;
    }

    public static <T, V> PaginatedResult<V> createFromFullList(List<T> list, CommonPageQuery query,
        Function<T, V> converter) {
        if (list == null) {
            list = Collections.emptyList();
        }
        PaginatedResult<V> result = new PaginatedResult<>();
        result.total = list.size();
        List<T> data = list;
        if (query != null && query.paginationEnabled()) {
            int pageNum = query.getPageNum() != null ? Math.max(1, query.getPageNum()) : 1;
            int pageSize =
                query.getPageSize() != null && query.getPageSize() > 0 ? query.getPageSize() : DEFAULT_PAGE_SIZE;
            int startIndex = (pageNum - 1) * pageSize;
            int endIndex = startIndex + pageSize;
            if (startIndex >= list.size()) {
                data = Collections.emptyList();
            } else if (endIndex > list.size()) {
                data = list.subList(startIndex, list.size());
            } else {
                data = list.subList(startIndex, endIndex);
            }
            result.pageNum = pageNum;
            result.pageSize = pageSize;
        }
        result.data = data.stream().map(converter).toList();
        return result;
    }
}
