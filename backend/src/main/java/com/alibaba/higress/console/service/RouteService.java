package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.controller.exception.BusinessException;
import io.kubernetes.client.openapi.ApiException;

public interface RouteService {

    PaginatedResult<Route> list(CommonPageQuery query);

    Route query(String routeName);

    Route add(Route route);

    Route update(Route route);

    void delete(String name);
}
