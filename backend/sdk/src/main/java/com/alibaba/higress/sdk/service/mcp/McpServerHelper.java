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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import javax.annotation.PostConstruct;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.HigressConstants;
import com.alibaba.higress.sdk.constant.McpConstants;
import com.alibaba.higress.sdk.exception.BusinessException;
import com.alibaba.higress.sdk.model.Route;
import com.alibaba.higress.sdk.model.RouteAuthConfig;
import com.alibaba.higress.sdk.model.mcp.ConsumerAuthInfo;
import com.alibaba.higress.sdk.model.mcp.McpServer;
import com.alibaba.higress.sdk.model.mcp.McpServerConstants;
import com.alibaba.higress.sdk.model.mcp.McpServerTypeEnum;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.fasterxml.jackson.dataformat.yaml.YAMLGenerator;

import lombok.extern.slf4j.Slf4j;

/**
 * @author fuyang
 */
@Slf4j
public class McpServerHelper {

    private static final ObjectMapper YAML_MAPPER = new ObjectMapper(new YAMLFactory()
        .enable(YAMLGenerator.Feature.LITERAL_BLOCK_STYLE).disable(YAMLGenerator.Feature.WRITE_DOC_START_MARKER));
    private static final ObjectMapper JSON_MAPPER = new ObjectMapper();

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

            // Fix missing requestBody parameters in the converted config
            try {
                mcpConfigContent = fixRequestBodyInMcpConfig(mcpConfigContent, swaggerContent);
            } catch (Exception e) {
                log.warn("Failed to fix requestBody in mcp config, using original config: {}", e.getMessage());
            }

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
            if (isLetter(c) || isDigit(c) || isUpperCase(c) || isSpecialChar(c) || isChineseChar(c)) {
                sb.append(c);
            }
        }

        return sb.toString();

    }

    // Checks if the character is a lowercase letter (a-z)
    private static boolean isLetter(char c) {
        return c >= 'a' && c <= 'z';
    }

    // Checks if the character is a digit (0-9)
    private static boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }

    // Checks if the character is an uppercase letter (A-Z)
    private static boolean isUpperCase(char c) {
        return c >= 'A' && c <= 'Z';
    }

    // Checks if the character is one of the specified special characters: '_', '-', ',', '/', '.'
    private static boolean isSpecialChar(char c) {
        return c == '_' || c == '-' || c == ',' || c == '/' || c == '.';
    }

    // Checks if the character is a Chinese character (Unicode range 0x4e00 - 0x9fbb)
    private static boolean isChineseChar(char c) {
        return c >= 0x4e00 && c <= 0x9fbb;
    }

    public static String mcpServerName2RouteName(String mcpServerName) {
        if (StringUtils.startsWith(mcpServerName, CommonKey.MCP_SERVER_ROUTE_PREFIX)
            && StringUtils.endsWith(mcpServerName, HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX)) {
            return mcpServerName;
        }
        return StringUtils.join(CommonKey.MCP_SERVER_ROUTE_PREFIX, mcpServerName,
            HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX);
    }

    public static String routeName2McpServerName(String mcpServerName) {
        if (StringUtils.isBlank(mcpServerName)) {
            return StringUtils.EMPTY;
        }
        if (!mcpServerName.startsWith(CommonKey.MCP_SERVER_ROUTE_PREFIX)) {
            return mcpServerName;
        }
        return mcpServerName.replaceFirst(CommonKey.MCP_SERVER_ROUTE_PREFIX, StringUtils.EMPTY)
            .replace(HigressConstants.INTERNAL_RESOURCE_NAME_SUFFIX, StringUtils.EMPTY);
    }

    public static McpServer routeToMcpServer(Route route) {
        if (Objects.isNull(route)) {
            return null;
        }
        McpServer result = new McpServer();
        String mcpServerName = routeName2McpServerName(route.getName());
        result.setName(mcpServerName);
        result.setServices(route.getServices());
        result.setDomains(route.getDomains());

        Map<String, String> customConfigs = route.getCustomConfigs();
        if (MapUtils.isNotEmpty(customConfigs)) {
            result.setDescription(customConfigs.get(McpServerConstants.Annotation.RESOURCE_DESCRIPTION_KEY));
        }

        Map<String, String> customLabels = route.getCustomLabels();
        if (MapUtils.isNotEmpty(customLabels)) {
            String mcpServerTypeStr = customLabels.get(McpServerConstants.Label.RESOURCE_MCP_SERVER_TYPE_KEY);
            Optional.ofNullable(mcpServerTypeStr).ifPresent(s -> result.setType(McpServerTypeEnum.fromName(s)));
        }

        RouteAuthConfig routeAuthConfig = route.getAuthConfig();
        if (routeAuthConfig != null) {
            ConsumerAuthInfo consumerAuthInfo = new ConsumerAuthInfo();
            List<String> allowedCredentialTypes = routeAuthConfig.getAllowedCredentialTypes();
            if (CollectionUtils.isEmpty(allowedCredentialTypes)) {
                log.warn("Unexpected empty allowedCredentialTypes found in Route {}", route.getName());
            } else {
                if (allowedCredentialTypes.size() != 1) {
                    log.warn("Unexpected multiple allowedCredentialTypes found in Route {}: {}", route.getName(),
                        String.join(",", allowedCredentialTypes));
                }
                consumerAuthInfo.setType(allowedCredentialTypes.get(0));
            }
            consumerAuthInfo.setAllowedConsumers(routeAuthConfig.getAllowedConsumers());
            consumerAuthInfo.setEnable(routeAuthConfig.getEnabled());
            result.setConsumerAuthInfo(consumerAuthInfo);
        }

        return result;
    }

    /**
     * Fix missing requestBody parameters in MCP config by extracting them from OpenAPI spec
     *
     * @param mcpConfigContent MCP config YAML content
     * @param swaggerContent OpenAPI/Swagger JSON content
     * @return Fixed MCP config YAML content
     */
    @SuppressWarnings("unchecked")
    private String fixRequestBodyInMcpConfig(String mcpConfigContent, String swaggerContent) throws Exception {
        if (StringUtils.isBlank(mcpConfigContent) || StringUtils.isBlank(swaggerContent)) {
            return mcpConfigContent;
        }

        // Parse MCP config YAML
        Map<String, Object> mcpConfig = YAML_MAPPER.readValue(mcpConfigContent, Map.class);
        
        // Parse OpenAPI spec JSON
        Map<String, Object> openApiSpec = JSON_MAPPER.readValue(swaggerContent, Map.class);
        
        // Extract paths from OpenAPI spec
        Map<String, Object> paths = (Map<String, Object>) openApiSpec.get("paths");
        if (paths == null) {
            return mcpConfigContent;
        }

        // Get tools from MCP config
        List<Map<String, Object>> tools = (List<Map<String, Object>>) mcpConfig.get("tools");
        if (tools == null) {
            return mcpConfigContent;
        }

        // Build operationId to path mapping from OpenAPI
        Map<String, Map<String, Object>> operationMap = new LinkedHashMap<>();
        for (Map.Entry<String, Object> pathEntry : paths.entrySet()) {
            String path = pathEntry.getKey();
            Map<String, Object> pathMethods = (Map<String, Object>) pathEntry.getValue();
            
            for (Map.Entry<String, Object> methodEntry : pathMethods.entrySet()) {
                String method = methodEntry.getKey().toLowerCase();
                Map<String, Object> operation = (Map<String, Object>) methodEntry.getValue();
                String operationId = (String) operation.get("operationId");
                
                if (StringUtils.isNotBlank(operationId)) {
                    operationMap.put(operationId, operation);
                }
            }
        }

        // Fix each tool
        boolean hasChanges = false;
        for (Map<String, Object> tool : tools) {
            String toolName = (String) tool.get("name");
            if (StringUtils.isBlank(toolName)) {
                continue;
            }

            // Try to find matching operation in OpenAPI spec
            Map<String, Object> operation = operationMap.get(toolName);
            if (operation == null) {
                // Try to find by matching description or summary
                for (Map.Entry<String, Map<String, Object>> entry : operationMap.entrySet()) {
                    Map<String, Object> op = entry.getValue();
                    String summary = (String) op.get("summary");
                    String description = (String) op.get("description");
                    String toolDescription = (String) tool.get("description");
                    
                    if ((StringUtils.isNotBlank(summary) && summary.equals(toolDescription)) ||
                        (StringUtils.isNotBlank(description) && description.equals(toolDescription))) {
                        operation = op;
                        break;
                    }
                }
            }

            if (operation == null) {
                continue;
            }

            // Check if operation has requestBody
            Map<String, Object> requestBody = (Map<String, Object>) operation.get("requestBody");
            if (requestBody == null) {
                continue;
            }

            // Get existing args
            List<Map<String, Object>> args = (List<Map<String, Object>>) tool.get("args");
            if (args == null) {
                args = new ArrayList<>();
                tool.put("args", args);
                hasChanges = true;
            }

            // Extract requestBody schema
            Map<String, Object> content = (Map<String, Object>) requestBody.get("content");
            if (content == null) {
                continue;
            }

            // Find the first content type (prefer application/json, then application/x-www-form-urlencoded)
            String contentType = null;
            Map<String, Object> schemaMap = null;
            
            if (content.containsKey("application/json")) {
                contentType = "application/json";
                Map<String, Object> jsonContent = (Map<String, Object>) content.get("application/json");
                schemaMap = (Map<String, Object>) jsonContent.get("schema");
            } else if (content.containsKey("application/x-www-form-urlencoded")) {
                contentType = "application/x-www-form-urlencoded";
                Map<String, Object> formContent = (Map<String, Object>) content.get("application/x-www-form-urlencoded");
                schemaMap = (Map<String, Object>) formContent.get("schema");
            } else {
                // Get the first available content type
                for (Map.Entry<String, Object> contentEntry : content.entrySet()) {
                    contentType = contentEntry.getKey();
                    Map<String, Object> contentValue = (Map<String, Object>) contentEntry.getValue();
                    schemaMap = (Map<String, Object>) contentValue.get("schema");
                    break;
                }
            }

            if (schemaMap == null) {
                continue;
            }

            // Extract properties from schema
            Map<String, Object> properties = (Map<String, Object>) schemaMap.get("properties");
            if (properties == null || properties.isEmpty()) {
                continue;
            }

            // Get required fields
            List<String> required = (List<String>) schemaMap.get("required");
            if (required == null) {
                required = new ArrayList<>();
            }

            // Check if args already contain requestBody parameters
            Map<String, Boolean> existingArgs = new LinkedHashMap<>();
            for (Map<String, Object> arg : args) {
                String argName = (String) arg.get("name");
                if (argName != null) {
                    existingArgs.put(argName, true);
                }
            }

            // Add missing parameters from requestBody
            for (Map.Entry<String, Object> propEntry : properties.entrySet()) {
                String propName = propEntry.getKey();
                Map<String, Object> propSchema = (Map<String, Object>) propEntry.getValue();
                
                // Skip if already exists
                if (existingArgs.containsKey(propName)) {
                    continue;
                }

                Map<String, Object> newArg = new LinkedHashMap<>();
                newArg.put("name", propName);
                
                // Set description
                String propDescription = (String) propSchema.get("description");
                if (StringUtils.isNotBlank(propDescription)) {
                    newArg.put("description", propDescription);
                }
                
                // Set type
                String propType = (String) propSchema.get("type");
                if (StringUtils.isNotBlank(propType)) {
                    newArg.put("type", propType);
                }
                
                // Set required
                newArg.put("required", required.contains(propName));
                
                // Set position to body for POST/PUT/PATCH requests
                newArg.put("position", "body");
                
                args.add(newArg);
                hasChanges = true;
            }

            // Update requestTemplate to include body for POST/PUT/PATCH requests
            if (hasChanges && (contentType != null && (contentType.equals("application/json") || 
                contentType.equals("application/x-www-form-urlencoded")))) {
                Map<String, Object> requestTemplate = (Map<String, Object>) tool.get("requestTemplate");
                if (requestTemplate == null) {
                    requestTemplate = new LinkedHashMap<>();
                    tool.put("requestTemplate", requestTemplate);
                }

                String method = (String) requestTemplate.get("method");
                if (method == null || method.equalsIgnoreCase("GET")) {
                    // Set default method to POST if not specified and has requestBody
                    requestTemplate.put("method", "POST");
                }

                // Ensure Content-Type header is set
                List<Map<String, String>> headers = (List<Map<String, String>>) requestTemplate.get("headers");
                if (headers == null) {
                    headers = new ArrayList<>();
                    requestTemplate.put("headers", headers);
                }

                // Check if Content-Type header already exists
                boolean hasContentType = false;
                for (Map<String, String> header : headers) {
                    if ("Content-Type".equalsIgnoreCase(header.get("key"))) {
                        hasContentType = true;
                        break;
                    }
                }

                if (!hasContentType) {
                    Map<String, String> contentTypeHeader = new LinkedHashMap<>();
                    contentTypeHeader.put("key", "Content-Type");
                    contentTypeHeader.put("value", contentType);
                    headers.add(contentTypeHeader);
                }
            }
        }

        if (hasChanges) {
            return YAML_MAPPER.writeValueAsString(mcpConfig);
        }

        return mcpConfigContent;
    }
}
