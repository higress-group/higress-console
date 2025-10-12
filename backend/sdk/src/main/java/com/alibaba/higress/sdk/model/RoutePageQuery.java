package com.alibaba.higress.sdk.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "路由分页查询类，用于路由列表的查询条件。")
public class RoutePageQuery extends CommonPageQuery {

    @Schema(description = "与路由关联的域名。")
    private String domainName;

    @Schema(description = "true 列出所有K8s命名空间中的路由，false 仅列出higress命名空间中的路由。")
    private Boolean all;
}
