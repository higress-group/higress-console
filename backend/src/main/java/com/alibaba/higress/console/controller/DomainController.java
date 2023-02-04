package com.alibaba.higress.console.controller;

import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.service.DomainService;
import io.kubernetes.client.openapi.ApiException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;
import java.util.List;

@RestController("DomainController")
@RequestMapping("/v1/domain")
@Validated
public class DomainController {

    @Resource
    private DomainService domainService;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Result<List<Domain>> list() throws ApiException {
        return Result.successReturn(domainService.getAll());
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Result<Object> add(@RequestBody Domain domain) throws ApiException {
        domainService.add(domain);
        return Result.successReturn(null);
    }

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public Result<Domain> query(@PathVariable("name") @NotBlank String name) throws
            ApiException {
        return Result.successReturn(domainService.query(name));
    }

    @RequestMapping(value = "/{name}", method = RequestMethod.PUT)
    public Result<Object> put(@PathVariable("name") @NotBlank String domainName,
                              @RequestBody Domain domain) throws ApiException {
        Assert.isTrue(StringUtils.equals(domain.getName(), domainName),
                "Domain name is inconsistency");
        domainService.put(domain);
        return Result.successReturn(null);
    }

    @RequestMapping(value = "/{name}", method = RequestMethod.DELETE)
    public Result<Object> delete(@PathVariable("name") @NotBlank String name) throws
            ApiException {
        domainService.delete(name);
        return Result.successReturn(null);
    }
}