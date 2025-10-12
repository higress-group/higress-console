package com.alibaba.higress.sdk.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 服务类，用于表示一个服务的信息。
 * 使用 Lombok 注解自动生成 getter、setter、toString 等方法。
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Service {

    /**
     * 服务名称。
     * 用于唯一标识一个服务。
     */
    private String name;

    /**
     * 服务命名空间。
     * 用于区分不同环境或项目中的同名服务。
     */
    private String namespace;

    /**
     * 服务端口。
     * 指定服务监听的端口号。
     */
    private Integer port;

    /**
     * 服务版本。
     * 用于标识服务的不同版本。
     */
    private Integer version;

    /**
     * 服务端点列表。
     * 包含服务的所有可用端点地址。
     */
    private List<String> endpoints;

    /**
     * 服务协议。
     * 指定服务使用的通信协议，如 HTTP、HTTPS、gRPC 等。
     */
    private String protocol;
}
