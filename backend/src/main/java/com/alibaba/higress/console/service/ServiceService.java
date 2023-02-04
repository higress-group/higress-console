package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Service;
import com.alibaba.higress.console.controller.exception.BusinessException;

import java.util.List;

public interface ServiceService {

    PaginatedResult<Service> list(CommonPageQuery query);
}
