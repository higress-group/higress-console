package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PageResult;
import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.controller.dto.Route;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.console.service.kubernetes.KubernetesModelConverter;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Ingress;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class RouteServiceImpl implements RouteService {

    private KubernetesClientService kubernetesClientService;
    private KubernetesModelConverter kubernetesModelConverter;

    @Resource
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @Resource
    public void setKubernetesModelConverter(KubernetesModelConverter kubernetesModelConverter) {
        this.kubernetesModelConverter = kubernetesModelConverter;
    }

    @Override
    public Result<PageResult<Route>> list(CommonPageQuery<Route> query) {
        List<V1Ingress> ingresses = kubernetesClientService.listIngress();
        List<V1Ingress> supportedIngresses = ingresses.stream().filter(kubernetesModelConverter::isIngressSupported).toList();
        return Result.successPageReturn(supportedIngresses, query.getPageNumber(), query.getPageSize(), ingresses.size(),
                kubernetesModelConverter::ingress2Route);
    }

    @Override
    public Result<Route> add(Route route) {
        try {
            V1Ingress ingress = kubernetesModelConverter.route2Ingress(route);
            V1Ingress newIngress = kubernetesClientService.addIngress(ingress);
            Route newRoute = kubernetesModelConverter.ingress2Route(newIngress);
            return Result.successReturn(newRoute);
        } catch (Exception e) {
            return Result.failureReturn(e);
        }
    }

    @Override
    public Result<Route> update(Route route) {
        try {
            V1Ingress ingress = kubernetesModelConverter.route2Ingress(route);
            V1Ingress newIngress = kubernetesClientService.updateIngress(ingress);
            Route newRoute = kubernetesModelConverter.ingress2Route(newIngress);
            return Result.successReturn(newRoute);
        } catch (Exception e) {
            return Result.failureReturn(e);
        }
    }

    @Override
    public Result<Route> delete(String name) {
        try {
            kubernetesClientService.deleteIngress(name);
            return Result.successReturn(null);
        } catch (ApiException e) {
            return Result.failureReturn(e);
        }
    }
}
