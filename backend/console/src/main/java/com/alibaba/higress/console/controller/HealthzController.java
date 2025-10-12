package com.alibaba.higress.console.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 健康检查控制器
 * 提供系统健康状态检查的API接口，主要用于监控系统是否正常运行
 */
@RestController("HealthzController")
@RequestMapping("/healthz")
public class HealthzController {

    /**
     * 系统就绪检查接口
     * 用于检查应用是否已经准备好接收流量，通常被负载均衡器或Kubernetes探针调用
     *
     * @return ResponseEntity<String> 返回"ok"表示系统就绪状态正常
     */
    @GetMapping(value = "/ready")
    public ResponseEntity<String> ready() {
        return ResponseEntity.ok("ok");
    }
}
