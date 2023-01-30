package com.alibaba.higress.console.util;

import io.kubernetes.client.common.KubernetesObject;
import io.kubernetes.client.openapi.models.V1ObjectMeta;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class KubernetesUtil {

    public static void setLabel(KubernetesObject object, String key, String value) {
        setLabel(Objects.requireNonNull(object.getMetadata()), key, value);
    }

    public static void setLabel(V1ObjectMeta metadata, String key, String value) {
        Map<String, String> labels = metadata.getLabels();
        if (labels == null) {
            labels = new HashMap<>();
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
        }
        annotations.put(key, value);
    }
}
