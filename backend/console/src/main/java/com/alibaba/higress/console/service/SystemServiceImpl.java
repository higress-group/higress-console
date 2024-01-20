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
package com.alibaba.higress.console.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.higress.console.constant.CapabilityKey;
import com.alibaba.higress.console.constant.SystemConfigKey;
import com.alibaba.higress.console.controller.dto.SystemInfo;
import com.alibaba.higress.sdk.service.kubernetes.KubernetesClientService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class SystemServiceImpl implements SystemService {

    private static final String UNKNOWN = "unknown";

    private static final String COMMIT_ID;

    static {
        String commitId = null;
        try {
            Properties properties = new Properties();
            properties.load(SystemServiceImpl.class.getResourceAsStream("/git.properties"));
            commitId = properties.getProperty("git.commit.id");
            if (commitId != null && commitId.length() > 7) {
                commitId = commitId.substring(0, 7);
            }
        } catch (Exception ex) {
            log.error("Failed to load git properties.", ex);
        }
        if (StringUtils.isBlank(commitId)) {
            commitId = UNKNOWN;
        }
        COMMIT_ID = commitId;
    }

    @Value("${" + SystemConfigKey.VERSION_KEY + ":}")
    private String version;

    @Value("${" + SystemConfigKey.DEV_BUILD_KEY + ":" + SystemConfigKey.DEV_BUILD_DEFAULT + "}")
    private boolean devBuild = SystemConfigKey.DEV_BUILD_DEFAULT;

    private String fullVersion;
    private List<String> capabilities;

    private KubernetesClientService kubernetesClientService;

    @Autowired
    public void setKubernetesClientService(KubernetesClientService kubernetesClientService) {
        this.kubernetesClientService = kubernetesClientService;
    }

    @PostConstruct
    public void initialize() {
        fullVersion = StringUtils.isNotBlank(version) ? version : UNKNOWN;
        if (devBuild) {
            fullVersion += "-dev-" + COMMIT_ID;
        }

        List<String> capabilities = new ArrayList<>();
        if (kubernetesClientService.isIngressV1Supported()) {
            capabilities.add(CapabilityKey.CONFIG_INGRESS_V1);
        }
        this.capabilities = capabilities;
    }

    @Override
    public SystemInfo getSystemInfo() {
        return new SystemInfo(fullVersion, capabilities);
    }
}
