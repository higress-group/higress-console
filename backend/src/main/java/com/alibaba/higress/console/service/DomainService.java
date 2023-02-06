package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.exception.BusinessException;

public interface DomainService {

    Domain add(Domain domain) throws BusinessException;

    PaginatedResult<Domain> list(CommonPageQuery query)throws BusinessException;

    Domain query(String domainName) throws BusinessException;

    void delete(String domainName) throws BusinessException;

    Domain put(Domain domain) throws BusinessException;
}