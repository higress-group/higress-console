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
        
        
    
        return Result.successPageReturn(list, query.getPageNumber(), query.getPageSize(), (int)count);
    }
}
