package com.alibaba.higress.sdk.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 路由分页查询类，用于定义路由列表的查询条件。
 * 继承自 CommonPageQuery，包含分页查询的通用属性。
 * 使用 Lombok 注解自动生成 getter、setter、toString 等方法。
 * 使用 Swagger 注解生成 API 文档。
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "路由分页查询类，用于路由列表的查询条件。")
public class RoutePageQuery extends CommonPageQuery {

    /**
     * 与路由关联的域名。
     * 用于过滤特定域名下的路由。
     */
    @Schema(description = "与路由关联的域名。")
    private String domainName;

    /**
     * 是否列出所有K8s命名空间中的路由。
     * true: 列出所有K8s命名空间中的路由。
     * false: 仅列出higress命名空间中的路由。
     */
    @Schema(description = "true 列出所有K8s命名空间中的路由，false 仅列出higress命名空间中的路由。")
    private Boolean all;
}
