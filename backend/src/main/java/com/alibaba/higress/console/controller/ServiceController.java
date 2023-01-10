package com.alibaba.higress.console.controller;


import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.controller.dto.Service;
import com.alibaba.higress.console.service.ServiceService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController("ServiceController")
@RequestMapping("/v1/service")
public class ServiceController {
    
    @Resource
    private ServiceService serviceService;
    
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Result<List<Service>> list() {
    
        List<Service> data = serviceService.getAll();
        
        return Result.successReturn(data);
    }
}
