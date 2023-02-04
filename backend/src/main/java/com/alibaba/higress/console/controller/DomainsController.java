package com.alibaba.higress.console.controller;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.exception.BusinessException;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.DomainService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;
import java.util.List;

@RestController("DomainsController")
@RequestMapping("/v1/domains")
@Validated
public class DomainsController {

    @Resource
    private DomainService domainService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<Domain>> list(@RequestParam(required = false) CommonPageQuery query) {
        return ControllerUtil.buildResponseEntity(domainService.list(query));
    }

    @PostMapping
    public ResponseEntity<Response<Domain>> add(@RequestBody Domain domain) {
        return ControllerUtil.buildResponseEntity(domainService.add(domain));
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Response<Domain>> query(@PathVariable("name") @NotBlank String name) {
        return ControllerUtil.buildResponseEntity(domainService.query(name));
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<Domain>> put(@PathVariable("name") @NotBlank String domainName, @RequestBody Domain domain) {
        if (StringUtils.isNotEmpty(domain.getName())) {
            domain.setName(domainName);
        } else if (!StringUtils.equals(domainName, domain.getName())) {
            throw new ValidationException("Domain name in the URL doesn't match the one in the body.");
        }
        return ControllerUtil.buildResponseEntity(domainService.put(domain));
    }

    @DeleteMapping("/{name}")
    public void delete(@PathVariable("name") @NotBlank String name) {
        domainService.delete(name);
    }
}