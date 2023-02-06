package com.alibaba.higress.console.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.function.Function;

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
            int pageSize = query.getPageSize() != null && query.getPageSize() > 0 ? query.getPageSize() : DEFAULT_PAGE_SIZE;
            int startIndex = (pageNum - 1) * pageSize;
            data = data.subList(startIndex, Math.min(result.total, startIndex + pageSize));
            result.pageNum = pageNum;
            result.pageSize = pageSize;
        }
        result.data = data;
        return result;
    }

    public static <T, V> PaginatedResult<V> createFromFullList(List<T> list, CommonPageQuery query, Function<T, V> converter) {
        if (list == null) {
            list = Collections.emptyList();
        }
        PaginatedResult<V> result = new PaginatedResult<>();
        result.total = list.size();
        List<T> data = list;
        if (query != null && query.paginationEnabled()) {
            int pageNum = query.getPageNum() != null ? Math.max(1, query.getPageNum()) : 0;
            int pageSize = query.getPageNum() != null && query.getPageNum() > 0 ? query.getPageNum() : DEFAULT_PAGE_SIZE;
            int startIndex = pageNum * pageSize;
            data = data.subList(startIndex, startIndex + pageSize);
            result.pageNum = pageNum;
            result.pageSize = pageSize;
        }
        result.data = data.stream().map(converter).toList();
        return result;
    }
}
