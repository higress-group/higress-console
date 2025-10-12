package com.alibaba.higress.sdk.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "通用实体分页查询类，支持分页功能。")
public class CommonPageQuery {

    /**
     * 页码，从1开始
     */
    @Schema(description = "页码，从1开始。如果省略，则返回所有项目。")
    private Integer pageNum;

    @Schema(description = "每页项目数。如果省略，则返回所有项目。")
    private Integer pageSize;

    public boolean paginationEnabled() {
        return pageNum != null || pageSize != null;
    }
}
