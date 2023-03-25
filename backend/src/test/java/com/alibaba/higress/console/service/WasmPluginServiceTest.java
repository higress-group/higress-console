package com.alibaba.higress.console.service;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.WasmPlugin;

public class WasmPluginServiceTest {

    private WasmPluginServiceImpl service;

    @BeforeEach
    public void setUp() {
        service = new WasmPluginServiceImpl();
        service.initialize();
    }

    @AfterEach
    public void tearDown() {
        service = null;
    }

    @Test
    public void listPlugins() {
        PaginatedResult<WasmPlugin> plugins = service.list(null);
        System.out.println(plugins.getTotal());
        Assertions.assertTrue(plugins.getTotal() > 0);
    }
}
