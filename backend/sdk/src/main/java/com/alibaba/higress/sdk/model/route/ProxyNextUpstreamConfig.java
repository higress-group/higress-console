package com.alibaba.higress.sdk.model.route;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 代理下一个上游服务器配置类
 * 用于配置当请求当前上游服务器失败时，如何尝试传递到下一个上游服务器
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Proxy Next Upstream Configuration")
public class ProxyNextUpstreamConfig {

    /**
     * 下游代理功能启用状态
     * 指示是否启用代理到下一个上游服务器的功能
     */
    @Schema(description = "Whether to enable the proxy next upstream feature.")
    private Boolean enabled;

    /**
     * 尝试次数
     * 指定将请求传递到下一个服务器的尝试次数
     */
    @Schema(description = "Specifies the number of attempts to pass a request to the next server.")
    private Integer attempts;

    /**
     * 超时时间
     * 指定将请求传递到下一个服务器的超时时间
     */
    @Schema(description = "Specifies the timeout for passing a request to the next server.")
    private Integer timeout;

    /**
     * 触发条件
     * 指定在哪些情况下应该将请求传递到下一个服务器
     */
    @Schema(description = "Specifies in which cases a request should be passed to the next server.",
        allowableValues = {"error", "timeout", "invalid_header", "http_500", "http_502", "http_503", "http_504",
            "http_403", "http_404", "http_429", "non_idempotent",})
    private String[] conditions;
}
