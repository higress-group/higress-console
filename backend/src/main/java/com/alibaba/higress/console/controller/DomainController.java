package com.alibaba.higress.console.controller;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.service.DomainService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotBlank;

import io.kubernetes.client.openapi.ApiException;

@RestController("DomainController")
@RequestMapping("/v1/domains")
@Validated
public class DomainController {

    @Resource
    private DomainService domainService;

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public Result<List<Domain>> list() throws IOException, ApiException {
        return Result.successReturn(domainService.getAll());
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<String> add(@RequestBody Domain domain) {
        int code = HttpServletResponse.SC_CREATED;
        String msg = "Created";
        try {
            domainService.add(domain);
        } catch (ApiException e) {
            code = e.getCode();
            msg = e.getMessage();
        } catch (IOException e) {
            code = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
            msg = e.getMessage();
        }
        return ResponseEntity.status(code)
            .body("{\"code\": " + code + ", \"msg\": \"" + msg + "\"}");
    }

    @RequestMapping(value = "/{domain}", method = RequestMethod.GET)
    public ResponseEntity<Object> query(@PathVariable("domain") @NotBlank String domain) {
        int code;
        String msg;
        try {
            return ResponseEntity.ok(domainService.query(domain));
        } catch (ApiException e) {
            code = e.getCode();
            msg = e.getMessage();
        } catch (IOException e) {
            code = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
            msg = e.getMessage();
        }
        return ResponseEntity.status(code)
            .body("{\"code\": " + code + ", \"msg\": \"" + msg + "\"}");
    }

    @RequestMapping(value = "/{domain}", method = RequestMethod.PUT)
    public ResponseEntity<String> put(@PathVariable("domain") @NotBlank String domainName,
                                      @RequestBody Domain domain) throws IOException, ApiException {
        Assert.isTrue(StringUtils.equals(domain.getDomain(), domainName),
            "Domain is inconsistency");
        int code = HttpServletResponse.SC_CREATED;
        String msg = "Created";
        try {
            domainService.put(domain);
        } catch (ApiException e) {
            code = e.getCode();
            msg = e.getMessage();
            if (404 == code) {
                domainService.add(domain);
                code = HttpServletResponse.SC_CREATED;
                msg = "Created";
            }
        } catch (IOException e) {
            code = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
            msg = e.getMessage();
        }
        return ResponseEntity.status(code)
            .body("{\"code\": " + code + ", \"msg\": \"" + msg + "\"}");
    }

    @RequestMapping(value = "/{domain}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("domain") @NotBlank String domain) {
        int code = HttpServletResponse.SC_OK;
        try {
            domainService.delete(domain);
        } catch (ApiException e) {
            code = e.getCode();
            if (404 == code) {
                return ResponseEntity.noContent().build();
            }
        } catch (IOException e) {
            code = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        }
        return ResponseEntity.status(code).build();
    }

}