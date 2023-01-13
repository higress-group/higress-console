package com.alibaba.higress.console.controller;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PageResult;
import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.controller.dto.Route;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController("RouterController")
@RequestMapping("/v1/route")
public class RouterController {

//    @Resource
//    private RouteService routeService;
    
    //FIXME
    private ConcurrentHashMap<String, Route> mockData = new ConcurrentHashMap<>();
    
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public Result<PageResult<Route>> list(@RequestBody CommonPageQuery<Route> query) {
        
        int count = mockData.size();
        List<Route> list = new ArrayList<>(mockData.values());
        //TODO

        return Result.successPageReturn(list, query.getPageNumber(), query.getPageSize(), (int)count);
    }
    
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Result<Route> add(@RequestBody Route route) {
        
        mockData.put(route.getName(), route);
        //TODO
        
        return Result.successReturn(route);
    }
    
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Result<Route> update(@RequestBody Route route) {
        mockData.put(route.getName(), route);
        //TODO
        return Result.successReturn(route);
    }
    
    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    public Result<Route> delete(@RequestParam("name") String name) {
        Route delete = mockData.get(name);
        if(delete != null) {
            mockData.remove(name);
        }
        //TODO
        return Result.successReturn(delete);
    }
}
