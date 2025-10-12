package com.alibaba.higress.console.controller.dto;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.alibaba.higress.sdk.model.PaginatedResult;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 分页响应数据传输对象
 * 继承自 Response<List<T>>，用于封装带有分页信息的响应数据
 *
 * @param <T> 数据列表中元素的类型
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Response with paginated data.")
public class PaginatedResponse<T> extends Response<List<T>> {

    /**
     * 数据总数量
     * 表示符合查询条件的数据总条数
     */
    @Schema(description = "Total number of data.")
    private Integer total;

    /**
     * 当前页码
     * 从0开始计数的页码
     */
    @Schema(description = "Page number starting from 0.")
    private Integer pageNum;

    /**
     * 每页数据条数
     * 控制单页返回的数据量
     */
    @Schema(description = "Number of data per page.")
    private Integer pageSize;

    /**
     * 创建成功的分页响应对象
     *
     * @param <T> 数据类型
     * @param result 分页结果对象
     * @return 包含分页数据的响应对象
     */
    public static <T> PaginatedResponse<T> success(PaginatedResult<T> result) {
        PaginatedResponse<T> response = new PaginatedResponse<>();
        response.setPageNum(result.getPageNum());
        response.setPageSize(result.getPageSize());
        response.setTotal(result.getTotal());
        response.setData(result.getData());
        return response;
    }

    /**
     * 创建成功的分页响应对象，并支持数据转换
     *
     * @param <T> 源数据类型
     * @param <V> 目标数据类型
     * @param result 分页结果对象
     * @param converter 数据转换函数，用于将源数据类型转换为目标数据类型
     * @return 包含转换后分页数据的响应对象
     */
    public static <T, V> PaginatedResponse<V> success(PaginatedResult<T> result, Function<T, V> converter) {
        PaginatedResponse<V> response = new PaginatedResponse<>();
        response.setPageNum(result.getPageNum());
        response.setPageSize(result.getPageSize());
        response.setTotal(result.getTotal());
        response.setData(result.getData().stream().map(converter).collect(Collectors.toList()));
        return response;
    }
}
