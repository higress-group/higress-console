package com.alibaba.higress.console.controller;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Service;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController("ServicesController")
@RequestMapping("/v1/services")
@Validated
public class ServicesController {

    @Resource
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<Service>> list(CommonPageQuery query) {
        return ControllerUtil.buildResponseEntity(serviceService.list(query));
    }
}
