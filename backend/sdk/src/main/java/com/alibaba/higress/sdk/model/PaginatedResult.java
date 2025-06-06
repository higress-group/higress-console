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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

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
        return createFromFullList(list, query, Function.identity());
    }

    @SuppressWarnings("unchecked")
    public static <T, V> PaginatedResult<V> createFromFullList(List<T> list, CommonPageQuery query,
                                                               Function<T, V> converter) {
        if (CollectionUtils.isEmpty(list)) {
            list = Collections.emptyList();
        }
        PaginatedResult<V> result = new PaginatedResult<>();
        result.total = list.size();
        List<T> data = list;
        if (query != null && query.paginationEnabled()) {
            int pageNum = Math.max(1, ObjectUtils.defaultIfNull(query.getPageNum(), 1));
            int pageSize = query.getPageSize() != null && query.getPageSize() > 0 ? query.getPageSize() : DEFAULT_PAGE_SIZE;

            int startIndex = (pageNum - 1) * pageSize;
            int toIndex = Math.min(startIndex + pageSize, result.getTotal());
            data = data.subList(startIndex, toIndex);
            result.pageNum = pageNum;
            result.pageSize = pageSize;
        }
        if (Function.identity().equals(converter)) {
            result.data = (List<V>) data;
        } else {
            result.data = data.stream().map(converter).collect(Collectors.toList());
        }
        return result;
    }
}
