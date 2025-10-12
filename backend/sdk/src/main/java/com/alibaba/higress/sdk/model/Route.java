package com.alibaba.higress.sdk.model;

import java.util.List;
import java.util.Map;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.route.CorsConfig;
import com.alibaba.higress.sdk.model.route.HeaderControlConfig;
import com.alibaba.higress.sdk.model.route.KeyedRoutePredicate;
import com.alibaba.higress.sdk.model.route.MockConfig;
import com.alibaba.higress.sdk.model.route.ProxyNextUpstreamConfig;
import com.alibaba.higress.sdk.model.route.RateLimitConfig;
import com.alibaba.higress.sdk.model.route.RedirectConfig;
import com.alibaba.higress.sdk.model.route.RewriteConfig;
import com.alibaba.higress.sdk.model.route.RoutePredicate;
import com.alibaba.higress.sdk.model.route.UpstreamService;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 网关路由配置类，用于管理网关的路由信息。
 * 该类使用 Lombok 注解来自动生成 getter、setter、构造函数等方法，
 * 并使用 Swagger 注解来描述 API 文档。
 * 实现 VersionedDto 接口以支持版本控制。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "网关路由配置类，用于管理网关的路由信息。")
public class Route implements VersionedDto {

    /**
     * 路由名称，用于唯一标识一个路由配置。
     */
    @Schema(description = "路由名称")
    private String name;

    /**
     * 路由版本，用于标识路由配置的版本。
     * 在更新路由配置时，该字段是必需的。
     */
    @Schema(description = "路由版本。更新时必需。")
    private String version;

    /**
     * 路由适用的域名列表。
     * 如果为空，则路由适用于所有域名。
     */
    @Schema(description = "路由适用的域名。如果为空，则路由适用于所有域名。")
    private List<String> domains;

    /**
     * 路径谓词，用于匹配请求的路径。
     */
    @Schema(description = "路径谓词")
    private RoutePredicate path;

    /**
     * 路由适用的 HTTP 方法列表（如 GET、POST 等）。
     * 如果为空，则路由适用于所有方法。
     */
    @Schema(description = "路由适用的方法。如果为空，则路由适用于所有方法。")
    private List<String> methods;

    /**
     * 头部谓词列表，用于匹配请求头中的特定条件。
     */
    @Schema(description = "头部谓词")
    private List<KeyedRoutePredicate> headers;

    /**
     * URL 参数谓词列表，用于匹配 URL 中的查询参数。
     */
    @Schema(description = "URL 参数谓词")
    private List<KeyedRoutePredicate> urlParams;

    /**
     * 路由的上游服务列表，定义了请求将被转发到的服务。
     */
    @Schema(description = "路由上游服务")
    private List<UpstreamService> services;

    // TODO: Not supported yet.
    /**
     * Mock 配置，用于模拟响应。
     * 当前尚未支持。
     */
    @Schema(hidden = true)
    private MockConfig mock;

    // TODO: Not supported yet.
    /**
     * 重定向配置，用于将请求重定向到其他 URL。
     * 当前尚未支持。
     */
    @Schema(hidden = true)
    private RedirectConfig redirect;

    // TODO: Not supported yet.
    /**
     * 限流配置，用于限制请求的速率。
     * 当前尚未支持。
     */
    @Schema(hidden = true)
    private RateLimitConfig rateLimit;

    /**
     * 请求重写配置，用于修改请求的路径或其他属性。
     */
    @Schema(description = "请求重写配置")
    private RewriteConfig rewrite;

    // TODO: Not supported yet.
    /**
     * 超时配置，用于设置请求的超时时间。
     * 当前尚未支持。
     */
    @Schema(hidden = true)
    private String timeout;

    /**
     * 代理下一个上游配置，用于在当前上游失败时尝试下一个上游。
     */
    @Schema(description = "代理下一个上游配置")
    private ProxyNextUpstreamConfig proxyNextUpstream;

    /**
     * CORS 配置，用于处理跨域资源共享。
     */
    @Schema(description = "CORS 配置")
    private CorsConfig cors;

    /**
     * 头部控制配置，用于添加、删除或修改请求/响应头。
     */
    @Schema(description = "头部控制配置")
    private HeaderControlConfig headerControl;

    /**
     * 路由认证配置，用于定义路由的安全策略。
     */
    @Schema(description = "路由认证配置")
    private RouteAuthConfig authConfig;

    /**
     * 自定义配置映射，允许用户添加自定义的键值对配置。
     * 例如，可以用于自定义注解或其他扩展配置。
     */
    @Schema(description = "自定义配置，例如自定义注解")
    private Map<String, String> customConfigs;

    /**
     * 自定义标签映射，允许用户添加自定义的标签。
     */
    @Schema(description = "自定义标签")
    private Map<String, String> customLabels;

    /**
     * 只读标志，表示该路由配置是否为只读。
     * 通常用于系统预定义的路由。
     */
    @Schema(hidden = true)
    private Boolean readonly;

    /**
     * 验证路由配置的有效性。
     * 检查包括名称、服务列表、路径谓词、头部谓词、URL 参数谓词和服务配置等。
     *
     * @throws ValidationException 如果验证失败，抛出此异常。
     */
    public void validate() {
        // 检查路由名称是否为空
        if (StringUtils.isBlank(name)) {
            throw new ValidationException("name cannot be blank.");
        }
        // 检查服务列表是否为空
        if (CollectionUtils.isEmpty(services)) {
            throw new ValidationException("services cannot be empty.");
        }
        // 验证路径谓词
        if (path != null) {
            path.validate();
        }
        // 验证头部谓词
        if (CollectionUtils.isNotEmpty(headers)) {
            headers.forEach(KeyedRoutePredicate::validate);
        }
        // 验证 URL 参数谓词
        if (CollectionUtils.isNotEmpty(urlParams)) {
            urlParams.forEach(KeyedRoutePredicate::validate);
        }
        // 验证上游服务
        services.forEach(UpstreamService::validate);
        // 验证认证配置
        if (authConfig != null) {
            authConfig.validate();
        }
    }
}
