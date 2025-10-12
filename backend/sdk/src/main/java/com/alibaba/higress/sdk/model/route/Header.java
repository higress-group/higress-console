package com.alibaba.higress.sdk.model.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * HTTP请求头类
 * 用于表示一个HTTP请求头的键值对
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Header {

    /**
     * 请求头键
     */
    private String key;

    /**
     * 请求头值
     */
    private String value;
}
