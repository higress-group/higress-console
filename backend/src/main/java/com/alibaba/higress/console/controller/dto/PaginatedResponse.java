package com.alibaba.higress.console.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.function.Function;

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
