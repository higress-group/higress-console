/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.RoutePageQuery;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.TlsCertificate;
import com.alibaba.higress.console.service.TlsCertificateService;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.DomainService;
import com.alibaba.higress.console.service.RouteService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController("DomainsController")
@RequestMapping("/v1/domains")
@Validated
public class DomainsController {

    @Resource
    private DomainService domainService;

    @Resource
    private RouteService routeService;

    @Resource
    private TlsCertificateService tlsCertificateService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<Domain>> list(CommonPageQuery query) {
        return ControllerUtil.buildResponseEntity(domainService.list(query));
    }

    @PostMapping
    public ResponseEntity<Response<Domain>> add(@RequestBody Domain domain) {
        checkDomainValid(domain);
        return ControllerUtil.buildResponseEntity(domainService.add(domain));
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Response<Domain>> query(@PathVariable("name") @NotBlank String name) {
        return ControllerUtil.buildResponseEntity(domainService.query(name));
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<Domain>> put(@PathVariable("name") @NotBlank String domainName,
                                                @RequestBody Domain domain) {
        if (StringUtils.isEmpty(domain.getName())) {
            domain.setName(domainName);
        } else if (!StringUtils.equals(domainName, domain.getName())) {
            throw new ValidationException("Domain name in the URL doesn't match the one in the body.");
        }
        checkDomainValid(domain);
        return ControllerUtil.buildResponseEntity(domainService.put(domain));
    }

    private void checkDomainValid(Domain domain) {
        String message = domain.valid();
        if (StringUtils.isNotEmpty(message)) {
            throw new ValidationException("Domain is invalid. Because " + message);
        }
        if (domain.getEnableHttps().equals(Domain.EnableHttps.ON.getValue())) {
            TlsCertificate certificate = tlsCertificateService.query(domain.getCertIdentifier());
            if (Objects.isNull(certificate)) {
                throw new ValidationException("domain certificate is not exits.");
            }
        }
    }

    @DeleteMapping("/{name}")
    public void delete(@PathVariable("name") @NotBlank String name) {
        domainService.delete(name);
    }

    @GetMapping(value = "/{name}/routes")
    public ResponseEntity<PaginatedResponse<Route>> queryRoutes(@PathVariable("name") @NotBlank String name,
                                                                CommonPageQuery commonPageQuery) {
        RoutePageQuery routePageQuery = new RoutePageQuery();
        routePageQuery.setDomainName(name);
        if (commonPageQuery != null) {
            routePageQuery.setPageSize(commonPageQuery.getPageSize());
            routePageQuery.setPageNum(commonPageQuery.getPageNum());
        }
        return ControllerUtil.buildResponseEntity(routeService.list(routePageQuery));
    }
}