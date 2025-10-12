package com.alibaba.higress.sdk.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
/**
 * 服务类，用于表示一个服务的信息。
 */
public class Service {

    /**
     * 服务名称
     */
    private String name;

    /**
     * 服务命名空间
     */
    private String namespace;

    /**
     * 服务端口
     */
    private Integer port;

    /**
     * 服务版本
     */
    private Integer version;

    /**
     * 服务端点列表
     */
    private List<String> endpoints;

    /**
     * 服务协议
     */
    private String protocol;
}
