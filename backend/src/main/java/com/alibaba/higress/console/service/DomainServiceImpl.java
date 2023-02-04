package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.console.service.kubernetes.KubernetesModelConverter;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1Status;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@org.springframework.stereotype.Service
public class DomainServiceImpl implements DomainService {

    @Resource
    private KubernetesClientService kubernetesClientService;

    @Resource
    private KubernetesModelConverter kubernetesModelConverter;

    @Override
    public void add(Domain domain) throws ApiException {
        V1ConfigMap domainConfigMap = kubernetesModelConverter.domain2V1ConfigMap(domain);
        V1ConfigMap v1ConfigMaps = kubernetesClientService
                .createConfigMap(domainConfigMap);
    }

    @Override
    public List<Domain> getAll() throws ApiException {
        List<V1ConfigMap> v1ConfigMaps = kubernetesClientService
                .listConfigMap();
        return v1ConfigMaps.stream().map(kubernetesModelConverter::V1ConfigMap2Domain)
                .collect(Collectors.toList());
    }

    @Override
    public Domain query(String domainName) throws ApiException {
        V1ConfigMap v1ConfigMap = kubernetesClientService.readConfigMap(
                KubernetesModelConverter.normalizeDomainName(domainName));
        return Optional.ofNullable(v1ConfigMap).map(kubernetesModelConverter::V1ConfigMap2Domain)
                .orElse(null);
    }

    @Override
    public void delete(String domainName) throws ApiException {
        V1Status v1Status = kubernetesClientService.deleteConfigMap(
                KubernetesModelConverter.normalizeDomainName(domainName));
        if (!StringUtils.equals(v1Status.getStatus(), "Success")) {
            throw new ApiException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "System error");
        }
    }

    @Override
    public void put(Domain domain) throws ApiException {
        V1ConfigMap domainConfigMap = kubernetesModelConverter.domain2V1ConfigMap(domain);
        V1ConfigMap v1ConfigMaps = kubernetesClientService.putConfigMap(
                domainConfigMap.getMetadata().getName(), domainConfigMap);
    }

}