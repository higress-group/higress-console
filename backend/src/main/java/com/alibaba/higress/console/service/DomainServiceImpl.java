package com.alibaba.higress.console.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.console.service.kubernetes.KubernetesModelConverter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1Status;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@org.springframework.stereotype.Service
public class DomainServiceImpl implements DomainService {

    @Resource
    private KubernetesClientService  kubernetesClientService;

    @Resource
    private KubernetesModelConverter kubernetesModelConverter;

    @Override
    public void add(Domain domain) throws ApiException, IOException {
        V1ConfigMap domainConfigMap = kubernetesModelConverter.domain2V1ConfigMap(domain);
        V1ConfigMap v1ConfigMaps = kubernetesClientService
            .kubeConfigFileCreateConfigMap(CommonKey.NS_DEFAULT, domainConfigMap);
    }

    @Override
    public List<Domain> getAll() throws ApiException, IOException {
        List<V1ConfigMap> v1ConfigMaps = kubernetesClientService
            .kubeConfigFileListConfigMap(CommonKey.NS_DEFAULT);
        return v1ConfigMaps.stream()
            .filter(
                configMap -> configMap.getMetadata().getName().startsWith(CommonKey.DOMAIN_PREFIX))
            .map(kubernetesModelConverter::V1ConfigMap2Domain).collect(Collectors.toList());
    }

    @Override
    public Domain query(String domainName) throws IOException, ApiException {
        V1ConfigMap v1ConfigMap = kubernetesClientService.kubeConfigFileReadConfigMap(
            CommonKey.NS_DEFAULT,
            KubernetesModelConverter.transformDomainToInnerDomain(domainName));
        return Optional.ofNullable(v1ConfigMap).map(kubernetesModelConverter::V1ConfigMap2Domain)
            .orElse(null);
    }

    @Override
    public void delete(String domainName) throws ApiException, IOException {
        String tempDomainName = CommonKey.DOMAIN_PREFIX
                                + domainName.replace(CommonKey.ASTERISK, CommonKey.WILDCARD);
        V1Status v1Status = kubernetesClientService.kubeConfigFileDeleteConfigMap(
            CommonKey.NS_DEFAULT,
            KubernetesModelConverter.transformDomainToInnerDomain(domainName));
        if (!StringUtils.equals(v1Status.getStatus(), "Success")) {
            throw new ApiException(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "System error");
        }
    }

    @Override
    public void put(Domain domain) throws ApiException, IOException {
        V1ConfigMap domainConfigMap = kubernetesModelConverter.domain2V1ConfigMap(domain);
        V1ConfigMap v1ConfigMaps = kubernetesClientService.kubeConfigFilePutConfigMap(
            CommonKey.NS_DEFAULT, domainConfigMap.getMetadata().getName(), domainConfigMap);
    }

}