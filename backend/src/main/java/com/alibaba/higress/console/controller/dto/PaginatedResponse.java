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
package com.alibaba.higress.console.controller.dto;

import java.util.List;
import java.util.function.Function;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PaginatedResponse<T> extends Response<List<T>> {

    private Integer total;

    private Integer pageNum;

    private Integer pageSize;

    public static <T> PaginatedResponse<T> success(PaginatedResult<T> result) {
        PaginatedResponse<T> response = new PaginatedResponse<>();
        response.setPageNum(result.getPageNum());
        response.setPageSize(result.getPageSize());
        response.setTotal(result.getTotal());
        response.setData(result.getData());
        return response;
    }

    public static <T, V> PaginatedResponse<V> success(PaginatedResult<T> result, Function<T, V> converter) {
        PaginatedResponse<V> response = new PaginatedResponse<>();
        response.setPageNum(result.getPageNum());
        response.setPageSize(result.getPageSize());
        response.setTotal(result.getTotal());
        response.setData(result.getData().stream().map(converter).toList());
        return response;
    }
}
