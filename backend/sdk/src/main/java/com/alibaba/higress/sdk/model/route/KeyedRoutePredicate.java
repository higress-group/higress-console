package com.alibaba.higress.sdk.model.route;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 带键的路由谓词类
 * 继承自RoutePredicate，增加了一个键属性用于标识特定的路由谓词
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Route Predicate with a Key")
public class KeyedRoutePredicate extends RoutePredicate {

    /**
     * 路由谓词的键
     * 用于唯一标识一个路由谓词
     */
    private String key;
}
