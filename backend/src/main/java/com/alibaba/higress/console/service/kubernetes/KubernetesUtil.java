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
package com.alibaba.higress.console.service.kubernetes;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import com.alibaba.higress.console.constant.CommonKey;
import com.alibaba.higress.console.constant.KubernetesConstants;
import io.kubernetes.client.common.KubernetesObject;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import org.apache.commons.lang3.StringUtils;

public class KubernetesUtil {

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
        if (StringUtils.isNotBlank(name) && name.startsWith(CommonKey.ASTERISK)) {
            name = CommonKey.WILDCARD + name.substring(CommonKey.ASTERISK.length());
        }
        return name;
    }

    public static String joinLabelSelectors(String... selectors) {
        return String.join(CommonKey.COMMA, selectors);
    }

    public static String buildDomainLabelSelector(String domainName) {
        return buildLabelSelector(KubernetesConstants.Label.DOMAIN_KEY_PREFIX + normalizeDomainName(domainName),
            KubernetesConstants.Label.DOMAIN_VALUE_DUMMY);
    }

    public static String buildLabelSelector(String name, String value) {
        return name + CommonKey.EQUALS_SIGN + value;
    }
}
