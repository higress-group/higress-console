/*
 * Copyright (c) 2022-2024 Alibaba Group Holding Ltd.
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
package com.alibaba.higress.sdk.service.mcp;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.annotation.PostConstruct;

import com.alibaba.higress.sdk.constant.McpConstants;
import com.alibaba.higress.sdk.exception.BusinessException;

import lombok.extern.slf4j.Slf4j;

/**
 * @author fuyang
 */
@Slf4j
public class McpServerHelper {

    @PostConstruct
    public void init() {

        // init temp file
        File tempFile = new File(McpConstants.getMcpTempDir());
        if (!tempFile.exists()) {
            tempFile.mkdirs();
        }

    }

    /**
     * swagger file to mcp-config.yaml
     *
     * @param swaggerContent swagger file content
     * @return mcp-config.yaml content
     */
    public String swaggerToMcpConfig(String swaggerContent) {

        try {

            long timeMillis = System.currentTimeMillis();

            // write temp file
            String openaiFileName = "openapi-" + timeMillis + ".json";

            Path openapiFilePath = Paths.get(McpConstants.getMcpTempDir(), openaiFileName);
            Files.write(openapiFilePath, swaggerContent.getBytes(StandardCharsets.UTF_8));

            // execute openai to mcp config script
            String mcpConfigFileName = "mcp-config-" + timeMillis + ".yaml";
            File tempMcpConfigFile = Paths.get(McpConstants.getMcpTempDir(), mcpConfigFileName).toFile();
            tempMcpConfigFile.createNewFile();

            String[] args = new String[5];
            args[0] = "sh";
            args[1] = trimCmdWithCh(McpConstants.getOpenApiToMcpserverScriptPath());
            args[2] = trimCmdWithCh(McpConstants.getMcpWorkDir());
            args[3] = trimCmdWithCh(openapiFilePath.toString());
            args[4] = trimCmdWithCh(tempMcpConfigFile.getPath().toString());

            log.info("execute openai to mcp config script,openai file: {},mcp config file: {},script args: {}",
                openaiFileName, mcpConfigFileName, args);

            ProcessBuilder pb = new ProcessBuilder(args);
            pb.redirectErrorStream(true);

            Process process = pb.start();

            process.waitFor();

            // read mcp config file
            Path mcpConfigFilePath = Paths.get(McpConstants.getMcpTempDir(), mcpConfigFileName);

            String mcpConfigContent = new String(Files.readAllBytes(mcpConfigFilePath), StandardCharsets.UTF_8);

            // delete temp file
            Files.deleteIfExists(openapiFilePath);
            Files.deleteIfExists(mcpConfigFilePath);

            return mcpConfigContent;

        } catch (Throwable e) {
            log.error("Error occurs when converting swagger to mcp config", e);
            throw new BusinessException(e.getMessage(), e);
        }
    }

    private static String trimCmdWithCh(String slice) {

        if (slice == null) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        for (char c : slice.toCharArray()) {
            if (isAlphabetic(c) || isDigit(c) || isSpecialChar(c) || isChineseChar(c)) {
                sb.append(c);
            }
        }

        return sb.toString();

    }

    private static boolean isAlphabetic(char c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }

    // Checks if the character is a digit (0-9)
    private static boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }

    // Checks if the character is one of the specified special characters: '_', '-', ',', '/', '.'
    private static boolean isSpecialChar(char c) {
        return c == '_' || c == '-' || c == ',' || c == '/' || c == '.';
    }

    // Checks if the character is a Chinese character (Unicode range 0x4e00 - 0x9fbb)
    private static boolean isChineseChar(char c) {
        return c >= 0x4e00 && c <= 0x9fbb;
    }
}
