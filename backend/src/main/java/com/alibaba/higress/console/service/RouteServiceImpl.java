package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PageResult;
import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.controller.dto.Route;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RouteServiceImpl implements RouteService{
    
    //FIXME mock datasource
    private ConcurrentHashMap<String, Route> mockData = new ConcurrentHashMap<>();
    
    @Override
    public Result<PageResult<Route>> list(CommonPageQuery<Route> query) {
        
        //FIXME
        int count = mockData.size();
        List<Route> list = new ArrayList<>(mockData.values());
    
        //ingress datasource
        //kubernetesClientService.listIngress()
        
        return Result.successPageReturn(list, query.getPageNumber(), query.getPageSize(), (int)count);
    }
    
    @Override
    public Result<Route> add(Route route) {
    
        mockData.put(route.getName(), route);
        //TODO
    
        return Result.successReturn(route);
    }
    
    @Override
    public Result<Route> update(Route route) {
        mockData.put(route.getName(), route);
        //TODO
        return Result.successReturn(route);
    }
    
    @Override
    public Result<Route> delete(String name) {
        Route delete = mockData.get(name);
        if(delete != null) {
            mockData.remove(name);
        }
        //TODO
        return Result.successReturn(delete);
    }
}
