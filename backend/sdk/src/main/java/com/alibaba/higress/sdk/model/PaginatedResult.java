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
/**
 * 分页结果类，用于封装分页查询的结果。
 * @param <T> 数据类型
 */
public class PaginatedResult<T> implements Serializable {

    public static final int DEFAULT_PAGE_SIZE = 10;

    /**
     * 当前页码
     */
    private Integer pageNum;

    /**
     * 每页大小
     */
    private Integer pageSize;

    /**
     * 总记录数
     */
    private Integer total;

    /**
     * 当前页数据
     */
    private List<T> data;

    /**
     * 从完整列表创建分页结果
     * @param list 完整列表
     * @param query 分页查询条件
     * @param <T> 数据类型
     * @return 分页结果
     */
    public static <T> PaginatedResult<T> createFromFullList(List<T> list, CommonPageQuery query) {
        return createFromFullList(list, query, Function.identity());
    }

    /**
     * 从完整列表创建分页结果，并支持数据转换
     * @param list 完整列表
     * @param query 分页查询条件
     * @param converter 数据转换函数
     * @param <T> 原始数据类型
     * @param <V> 转换后的数据类型
     * @return 分页结果
     */
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
