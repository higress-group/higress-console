package com.alibaba.higress.sdk.model;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 网关服务源认证配置类，用于管理网关服务源的认证信息。
 * 使用 Lombok 注解自动生成 getter、setter、toString 等方法。
 * 使用 Swagger 注解生成 API 文档。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "网关服务源认证配置类，用于管理网关服务源的认证信息。")
public class ServiceSourceAuthN {

    /**
     * 认证验证器映射表。
     * 根据不同的注册中心类型，使用相应的验证器来验证认证配置的有效性。
     */
    private static final Map<String, AuthNValidator> VALIDATORS = new HashMap<>();

    static {
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS, new NacosAuthNValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS2, new NacosAuthNValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_NACOS3, new NacosAuthNValidator());
        VALIDATORS.put(V1McpBridge.REGISTRY_TYPE_CONSUL, new ConsulAuthValidator());
    }

    /**
     * 是否启用访问服务源时的身份验证。
     * 如果设置为 true，则在访问服务源时需要进行身份验证。
     */
    @Schema(description = "启用访问服务源时的身份验证")
    private Boolean enabled;

    /**
     * 认证属性，根据注册中心类型而定。
     * 对于 nacos/nacos2: nacosUsername, nacosPassword
     * 对于 consul: consulToken
     */
    @Schema(description = "认证属性，根据类型而定。\n"
        + "对于 nacos/nacos2: nacosUsername, nacosPassword\n" + "对于 consul: consulToken\n")
    private Map<String, String> properties;

    /**
     * 验证服务源认证配置的有效性。
     * @param registryType 注册中心类型
     * @return 如果配置有效返回 true，否则返回 false
     */
    public boolean validate(String registryType) {
        // 如果未启用认证，则认为配置有效
        if (enabled == null || !enabled) {
            return true;
        }
        // 检查认证属性是否为空
        if (MapUtils.isEmpty(properties)) {
            return false;
        }
        // 根据注册中心类型获取相应的验证器并进行验证
        AuthNValidator validator = VALIDATORS.get(registryType);
        return validator == null || validator.validate(this);
    }

    /**
     * 认证验证器接口。
     * 定义了认证验证的方法。
     */
    private interface AuthNValidator {

        /**
         * 验证认证配置的有效性。
         * @param authN 认证配置对象
         * @return 如果配置有效返回 true，否则返回 false
         */
        default boolean validate(ServiceSourceAuthN authN) {
            return true;
        }
    }

    /**
     * Nacos 认证验证器。
     * 用于验证 Nacos 类型服务源的认证配置。
     */
    private static class NacosAuthNValidator implements AuthNValidator {

        @Override
        public boolean validate(ServiceSourceAuthN authN) {
            Map<String, String> properties = authN.getProperties();
            // 检查认证属性是否为空
            if (MapUtils.isEmpty(properties)) {
                return false;
            }

            // 检查用户名是否为空
            String username = properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_USERNAME);
            if (StringUtils.isBlank(username)) {
                return false;
            }
            // 检查密码是否为空
            String password = properties.get(V1McpBridge.REGISTRY_TYPE_NACOS_PASSWORD);
            if (StringUtils.isBlank(password)) {
                return false;
            }

            return true;
        }
    }

    /**
     * Consul 认证验证器。
     * 用于验证 Consul 类型服务源的认证配置。
     */
    private static class ConsulAuthValidator implements AuthNValidator {

        @Override
        public boolean validate(ServiceSourceAuthN authN) {
            Map<String, String> properties = authN.getProperties();
            // 检查认证属性是否为空
            if (MapUtils.isEmpty(properties)) {
                return false;
            }

            // 检查 Token 是否为空
            String token = properties.get(V1McpBridge.REGISTRY_TYPE_CONSUL_TOKEN);
            if (StringUtils.isBlank(token)) {
                return false;
            }

            return true;
        }
    }
}
