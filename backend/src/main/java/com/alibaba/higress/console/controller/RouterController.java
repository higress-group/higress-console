package com.alibaba.higress.console.controller;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PageResult;
import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.service.RouteService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.concurrent.ConcurrentHashMap;

@RestController("RouterController")
@RequestMapping("/v1/route")
public class RouterController {

    @Resource
    private RouteService routeService;
    
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public Result<PageResult<Route>> list(@RequestBody CommonPageQuery<Route> query) {
        //TODO
        return routeService.list(query);
    }
    
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Result<Route> add(@RequestBody Route route) {
        //TODO
        return routeService.add(route);
    }
    
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Result<Route> update(@RequestBody Route route) {
        //TODO
        return routeService.update(route);
    }
    
    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    public Result<Route> delete(@RequestParam("name") String name) {
        //TODO
        return routeService.delete(name);
    }
}
