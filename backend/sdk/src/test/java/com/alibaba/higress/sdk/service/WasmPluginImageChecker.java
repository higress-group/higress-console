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
package com.alibaba.higress.sdk.service;

import static org.mockito.Mockito.mock;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.higress.sdk.constant.Separators;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.WasmPlugin;
import com.alibaba.higress.sdk.model.wasmplugin.WasmPluginServiceConfig;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesModelConverter;

import lombok.Data;

public class WasmPluginImageChecker {

    private static final String OCI_PROTOCOL = "oci://";
    private static final String LATEST_IMAGE_TAG = "latest";

    private KubernetesClientService kubernetesClientService;
    private KubernetesModelConverter kubernetesModelConverter;
    private WasmPluginServiceImpl service;

    @BeforeEach
    public void setUp() {
        kubernetesClientService = mock(KubernetesClientService.class);
        kubernetesModelConverter = new KubernetesModelConverter(kubernetesClientService);

        service = new WasmPluginServiceImpl(kubernetesClientService, kubernetesModelConverter,
            WasmPluginServiceConfig.buildFromEnv());
    }

    @Test
    @Disabled
    public void checkImages() throws Exception {
        PaginatedResult<WasmPlugin> plugins = service.list(null);
        System.out.printf("Found %d plugins.%n", plugins.getData().size());
        System.out.println();

        Map<String, String> pluginImageIssues = new LinkedHashMap<>();
        for (WasmPlugin plugin : plugins.getData()) {
            System.out.println("Checking plugin: " + plugin.getName());

            String imageRepository = plugin.getImageRepository();
            String imageVersion = plugin.getImageVersion();

            if (!imageRepository.startsWith(OCI_PROTOCOL)) {
                System.out.printf("Skipping non-OCI plugin: %s %s\n", plugin.getName(), imageRepository);
                continue;
            }
            imageRepository = imageRepository.substring(OCI_PROTOCOL.length());

            if (LATEST_IMAGE_TAG.equals(imageVersion)) {
                System.out.printf("Skipping latest image tag: %s %s\n", plugin.getName(), imageVersion);
                continue;
            }

            DockerManifest currentImageManifest = pullImageManifest(imageRepository + Separators.COLON + imageVersion);
            DockerManifest latestImageManifest =
                pullImageManifest(imageRepository + Separators.COLON + LATEST_IMAGE_TAG);
            if (currentImageManifest.getConfigDigest().equals(latestImageManifest.getConfigDigest())) {
                continue;
            }

            StringBuilder issueBuilder = new StringBuilder();
            issueBuilder.append(String.format("  %s (%s) != %s (%s)", imageVersion,
                currentImageManifest.getCreatedTime(), LATEST_IMAGE_TAG, latestImageManifest.getCreatedTime()));
            pluginImageIssues.put(plugin.getName(), issueBuilder.toString());
        }

        System.out.println();
        if (pluginImageIssues.isEmpty()) {
            System.out.println("All good.");
        } else {
            System.out.printf("Found %d issues with plugin images:\n", pluginImageIssues.size());
            for (Map.Entry<String, String> entry : pluginImageIssues.entrySet()) {
                System.out.println();
                System.out.printf("Plugin %s: \n", entry.getKey());
                System.out.println(entry.getValue());
            }
            System.out.println();
            Assertions.fail();
        }
    }

    private static DockerManifest pullImageManifest(String imageUrl) throws IOException, InterruptedException {
        ProcessBuilder builder = new ProcessBuilder("docker");
        builder.command().addAll(Arrays.asList("manifest", "inspect", imageUrl));
        builder.redirectOutput(ProcessBuilder.Redirect.PIPE);
        builder.redirectError(ProcessBuilder.Redirect.PIPE);
        Process process = builder.start();
        int result = process.waitFor();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (InputStream inputStream = process.getInputStream()) {
            IOUtils.copy(inputStream, baos);
        }
        String output = baos.toString("UTF-8");
        if (result != 0) {
            throw new IOException(
                "Failed to pull image manifest: " + imageUrl + ", exit code: " + result + "\n" + output);
        }

        DockerManifest manifest = new DockerManifest();
        manifest.setImageUrl(imageUrl);
        JSONObject jsonObject = JSONObject.parseObject(output);
        JSONObject configObject = jsonObject.getJSONObject("config");
        manifest.setConfigDigest(configObject.getString("digest"));
        JSONObject annotationObject = jsonObject.getJSONObject("annotation");
        if (annotationObject != null) {
            String created = annotationObject.getString("org.opencontainers.image.created");
            manifest.setCreatedTime(created);
        }
        return manifest;
    }

    @Data
    private static class DockerManifest {
        private String imageUrl;
        private String configDigest;
        private String createdTime;
    }
}
