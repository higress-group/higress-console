package com.alibaba.higress.console.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;

import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.constant.K8sConstantKey;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.service.kubernetes.KubernetesClientService;

import javax.annotation.Resource;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1Status;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@org.springframework.stereotype.Service
public class DomainServiceImpl implements DomainService {

    @Resource
    private KubernetesClientService kubernetesClientService;

    @Override
    public void add(Domain domain) throws ApiException, IOException {
        V1ConfigMap domainConfigMap = this.buildV1ConfigMap(domain);
        V1ConfigMap v1ConfigMaps = kubernetesClientService
            .kubeConfigFileCreateConfigMap(CommonKey.HIGRESS_NS_DEFAULT, domainConfigMap);
    }

    @Override
    public List<Domain> getAll() throws ApiException, IOException {
        List<V1ConfigMap> v1ConfigMaps = kubernetesClientService
            .kubeConfigFileListConfigMap(CommonKey.HIGRESS_NS_DEFAULT);
        return v1ConfigMaps.stream()
            .filter(configMap -> configMap.getMetadata().getName()
                .startsWith(CommonKey.HIGRESS_DOMAIN + CommonKey.HIGRESS_HORIZONTAL_LINE))
            .map(this::convertV1ConfigMapToDomain).collect(Collectors.toList());
    }

    @Override
    public Domain query(String domainName) throws IOException, ApiException {
        domainName = (CommonKey.HIGRESS_DOMAIN + CommonKey.HIGRESS_HORIZONTAL_LINE)
                     + domainName.replace(CommonKey.HIGRESS_ASTERISK, CommonKey.HIGRESS_WILDCARD);
        V1ConfigMap v1ConfigMap = kubernetesClientService
            .kubeConfigFileReadConfigMap(CommonKey.HIGRESS_NS_DEFAULT, domainName);
        return Optional.ofNullable(v1ConfigMap).map(this::convertV1ConfigMapToDomain).orElse(null);
    }

    @Override
    public void delete(String domainName) throws ApiException, IOException {
        String tempDomainName = (CommonKey.HIGRESS_DOMAIN + CommonKey.HIGRESS_HORIZONTAL_LINE)
                                + domainName.replace(CommonKey.HIGRESS_ASTERISK,
                                    CommonKey.HIGRESS_WILDCARD);
        V1Status v1Status = kubernetesClientService
            .kubeConfigFileDeleteConfigMap(CommonKey.HIGRESS_NS_DEFAULT, tempDomainName);
        Assert.isTrue(StringUtils.equals(v1Status.getStatus(), "Success"),
            "Delete ConfigMap failed for" + domainName);
    }

    @Override
    public void put(Domain domain) throws ApiException, IOException {
        V1ConfigMap domainConfigMap = this.buildV1ConfigMap(domain);
        V1ConfigMap v1ConfigMaps = kubernetesClientService.kubeConfigFilePutConfigMap(
            CommonKey.HIGRESS_NS_DEFAULT, domainConfigMap.getMetadata().getName(), domainConfigMap);
    }

    private V1ConfigMap buildV1ConfigMap(Domain domain) {
        V1ConfigMap domainConfigMap = new V1ConfigMap();
        domainConfigMap.apiVersion(K8sConstantKey.K8S_API_VERSION_DEFAULT)
            .kind(K8sConstantKey.K8S_CONFIGMAP);
        domainConfigMap.metadata(new V1ObjectMeta());
        String domainName = domain.getDomain().replace(CommonKey.HIGRESS_ASTERISK,
            CommonKey.HIGRESS_WILDCARD);
        domainConfigMap.getMetadata()
            .setName((CommonKey.HIGRESS_DOMAIN + CommonKey.HIGRESS_HORIZONTAL_LINE) + domainName);
        domainConfigMap.getMetadata().setNamespace(CommonKey.HIGRESS_NS_DEFAULT);
        Map<String, String> configMap = new HashMap<>();
        configMap.put(CommonKey.HIGRESS_DOMAIN, domain.getDomain());
        configMap.put(K8sConstantKey.K8S_CERT, domain.getTlsSecret());
        configMap.put(K8sConstantKey.K8S_ENABLEHTTPS, domain.getEnableHttps());
        domainConfigMap.data(configMap);

        return domainConfigMap;
    }

    private Domain convertV1ConfigMapToDomain(V1ConfigMap configMap) {
        Domain domain = new Domain();
        String tempDomainName = configMap.getMetadata().getName()
            .substring((CommonKey.HIGRESS_DOMAIN + CommonKey.HIGRESS_HORIZONTAL_LINE).length());
        domain.setDomain(
            tempDomainName.replace(CommonKey.HIGRESS_WILDCARD, CommonKey.HIGRESS_ASTERISK));
        domain.setTlsSecret(configMap.getData().get(K8sConstantKey.K8S_CERT));
        domain.setEnableHttps(configMap.getData().get(K8sConstantKey.K8S_ENABLEHTTPS));
        return domain;
    }
}