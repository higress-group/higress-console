package com.alibaba.higress.sdk.model.route;

import java.util.Collections;
import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CORS配置类
 * 用于配置跨域资源共享(CORS)的相关参数
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "CORS Configuration")
public class CorsConfig {

    /**
     * 默认允许列表
     * 包含通配符"*"，表示允许所有来源
     */
    public static final List<String> DEFAULT_ALLOWS = Collections.singletonList("*");

    /**
     * 默认最大缓存时间
     * 86400秒，即24小时
     */
    public static final int DEFAULT_MAX_AGE = 86400;

    /**
     * CORS启用状态
     * 指示是否启用跨域资源共享功能
     */
    @Schema(description = "Whether to enable CORS")
    private Boolean enabled;

    /**
     * 允许的来源列表
     * 对应HTTP响应头Access-Control-Allow-Origin
     */
    @Schema(description = "Allowed origins, Access-Control-Allow-Origin")
    private List<String> allowOrigins;

    /**
     * 允许的HTTP方法列表
     * 对应HTTP响应头Access-Control-Allow-Methods
     */
    @Schema(description = "Allowed methods, Access-Control-Allow-Methods")
    private List<String> allowMethods;

    /**
     * 允许的请求头列表
     * 对应HTTP响应头Access-Control-Allow-Headers
     */
    @Schema(description = "Allowed headers, Access-Control-Allow-Headers")
    private List<String> allowHeaders;

    /**
     * 暴露的响应头列表
     * 对应HTTP响应头Access-Control-Expose-Headers
     */
    @Schema(description = "Exposed headers, Access-Control-Expose-Headers")
    private List<String> exposeHeaders;

    /**
     * 最大缓存时间
     * 对应HTTP响应头Access-Control-Max-Age
     */
    @Schema(description = "Max age, Access-Control-Max-Age")
    private Integer maxAge;

    /**
     * 是否允许凭据
     * 对应HTTP响应头Access-Control-Allow-Credentials
     */
    @Schema(description = "Whether to allow credentials, Access-Control-Allow-Credentials")
    private Boolean allowCredentials;
}
