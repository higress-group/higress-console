package com.alibaba.higress.console.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommonPageQuery {

    /**
     * Starting from 1
     */
    private Integer pageNum;

    private Integer pageSize;

    public boolean paginationEnabled() {
        return pageNum != null || pageSize != null;
    }
}
