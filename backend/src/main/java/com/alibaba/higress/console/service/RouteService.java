package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PageResult;
import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.controller.dto.Route;

public interface RouteService {
    
    Result<PageResult<Route>> list(CommonPageQuery<Route> query);
    
    Result<Route> add(Route route);
    
    Result<Route> update(Route route);
    
    Result<Route> delete(String name);
    
}
