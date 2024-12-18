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
package com.alibaba.higress.sdk.service.kubernetes;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.KubernetesConstants;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.service.kubernetes.crd.mcp.V1McpBridge;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;
import io.kubernetes.client.common.KubernetesObject;
import io.kubernetes.client.openapi.models.V1ObjectMeta;


public class KubernetesUtil {

    private static final ObjectMapper YAML =
            new ObjectMapper(new YAMLFactory().enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE));

    public static String toYaml(Object obj) {
        try {
            return YAML.writeValueAsString(obj);
        } catch (Exception e) {
            throw new BusinessException("Error occurs when converting object to yaml: " + e.getMessage(), e);
        }
    }

    public static String getObjectName(KubernetesObject object) {
        if (object == null) {
            return null;
        }
        if (object.getMetadata() == null) {
            return null;
        }
        return object.getMetadata().getName();
    }

    public static void setLabel(KubernetesObject object, String key, String value) {
        setLabel(Objects.requireNonNull(object.getMetadata()), key, value);
    }

    public static void setLabel(V1ObjectMeta metadata, String key, String value) {
        Map<String, String> labels = metadata.getLabels();
        if (labels == null) {
            labels = new HashMap<>();
            metadata.setLabels(labels);
        } else if (!(labels instanceof HashMap<String, String>)) {
            labels = new HashMap<>(labels);
            metadata.setLabels(labels);
        }
        labels.put(key, value);
    }

    public static void setAnnotation(KubernetesObject object, String key, String value) {
        setAnnotation(Objects.requireNonNull(object.getMetadata()), key, value);
    }

    public static void setAnnotation(V1ObjectMeta metadata, String key, String value) {
        Map<String, String> annotations = metadata.getAnnotations();
        if (annotations == null) {
            annotations = new HashMap<>();
            metadata.setAnnotations(annotations);
        } else if (!(annotations instanceof HashMap<String, String>)) {
            annotations = new HashMap<>(annotations);
            metadata.setAnnotations(annotations);
        }
        annotations.put(key, value);
    }

    public static String normalizeDomainName(String name) {
        if (StringUtils.isNotBlank(name) && name.startsWith(Separators.ASTERISK)) {
            name = CommonKey.WILDCARD + name.substring(Separators.ASTERISK.length());
            if (CommonKey.WILDCARD.equals(name)) {
                name = HigressConstants.DEFAULT_DOMAIN;
            }
        }
        return name;
    }

    public static String normalizeRouteName(String name) {
        // for openapi
        // domain and path: foo.bar.com/user/{userId}
        // turns to       : foo.bar.com-user-userId
        if (StringUtils.isNotBlank(name) && name.startsWith(Separators.ASTERISK)) {
            name = CommonKey.WILDCARD + name.substring(Separators.ASTERISK.length());
        }
        name = name.replace("/", "-")
                .replaceAll("-\\{", "-")
                .replaceAll("\\{", "-")
                .replaceAll("}", "").toLowerCase();
        return name;
    }

    public static String getReferenceGrantName(String name, String type) {
        return name+Separators.DASH+type;
    }

    public static String joinLabelSelectors(String... selectors) {
        return String.join(Separators.COMMA,
            Arrays.stream(selectors).filter(StringUtils::isNotBlank).toArray(String[]::new));
    }

    public static String buildDomainLabelSelector(String domainName) {
        return buildLabelSelector(KubernetesConstants.Label.DOMAIN_KEY_PREFIX + normalizeDomainName(domainName),
                KubernetesConstants.Label.DOMAIN_VALUE_DUMMY);
    }

    public static String buildLabelSelector(String name, String value) {
        return name + Separators.EQUALS_SIGN + value;
    }

    public static String buildLabelSelectors(Map<String, String> labels) {
        if (MapUtils.isEmpty(labels)) {
            return StringUtils.EMPTY;
        }
        return labels.entrySet().stream().map(e -> buildLabelSelector(e.getKey(), e.getValue()))
            .reduce((a, b) -> a + Separators.COMMA + b).orElse(StringUtils.EMPTY);
    }

    public static boolean isInternalResource(KubernetesObject object) {
        String name = getObjectName(object);
        return name != null && name.endsWith(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX);
    }

    private static final List<String> INTERNAL_RESOURCE_NAME_SUFFIXES =
        Arrays.asList(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX + "." + V1McpBridge.REGISTRY_TYPE_DNS,
            HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX + "." + V1McpBridge.REGISTRY_TYPE_DNS);

    public static boolean isInternalService(String serviceName) {
        if (StringUtils.isEmpty(serviceName)) {
            return false;
        }
        return INTERNAL_RESOURCE_NAME_SUFFIXES.stream().anyMatch(serviceName::endsWith);
    }
}
