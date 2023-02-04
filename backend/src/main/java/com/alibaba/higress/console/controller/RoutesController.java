package com.alibaba.higress.console.controller;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

@RestController("RoutesController")
@RequestMapping("/v1/routes")
@Validated
public class RoutesController {

    @Resource
    private RouteService routeService;

    @GetMapping
    public ResponseEntity<PaginatedResponse<Route>> list(@RequestParam(required = false) CommonPageQuery query) {
        return ControllerUtil.buildResponseEntity(routeService.list(query));
    }

    @PostMapping
    public ResponseEntity<Response<Route>> add(@RequestBody Route route) {
        return ControllerUtil.buildResponseEntity(routeService.add(route));
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<Route>> update(@PathVariable("name") @NotBlank String routeName, @RequestBody Route route) {
        if (StringUtils.isNotEmpty(route.getName())) {
            route.setName(routeName);
        } else if (!StringUtils.equals(routeName, route.getName())) {
            throw new ValidationException("Route name in the URL doesn't match the one in the body.");
        }
        return ControllerUtil.buildResponseEntity(routeService.update(route));
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Response<Route>> delete(@PathVariable("name") @NotBlank String name) {
        routeService.delete(name);
        return ResponseEntity.noContent().build();
    }
}
