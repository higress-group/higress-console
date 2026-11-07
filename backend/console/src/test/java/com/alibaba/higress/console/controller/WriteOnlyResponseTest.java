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
package com.alibaba.higress.console.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.alibaba.higress.console.context.HttpContext;
import com.alibaba.higress.console.controller.ai.LlmProvidersController;
import com.alibaba.higress.sdk.exception.ResourceConflictException;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.ai.LlmProvider;
import com.alibaba.higress.sdk.model.ai.LlmProviderType;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.consumer.CredentialType;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredential;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredentialSource;
import com.alibaba.higress.sdk.service.ai.LlmProviderService;
import com.alibaba.higress.sdk.service.consumer.ConsumerService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

class WriteOnlyResponseTest {

    private static final String PROVIDER_NAME = "provider";
    private static final String CONSUMER_NAME = "consumer";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private LlmProviderService llmProviderService;
    private ConsumerService consumerService;
    private LlmProvidersController llmProvidersController;
    private ConsumersController consumersController;

    @BeforeEach
    void setUp() {
        llmProviderService = mock(LlmProviderService.class);
        consumerService = mock(ConsumerService.class);
        llmProvidersController = new LlmProvidersController();
        llmProvidersController.setLlmProviderService(llmProviderService);
        consumersController = new ConsumersController();
        consumersController.setConsumerService(consumerService);
    }

    @AfterEach
    void tearDown() {
        HttpContext.release();
    }

    @Test
    void providerListOmitsCredentialValues() throws Exception {
        initContext(HttpMethod.GET);
        when(llmProviderService.list(any())).thenReturn(providerPage());

        Object body = llmProvidersController.list(null).getBody();

        assertProviderResponse(serialize(body).get("data").get(0));
    }

    @Test
    void providerGetOmitsCredentialValues() throws Exception {
        initContext(HttpMethod.GET);
        when(llmProviderService.query(PROVIDER_NAME)).thenReturn(createSecretProvider());

        Object body = llmProvidersController.query(PROVIDER_NAME).getBody();

        assertProviderResponse(serialize(body).get("data"));
    }

    @Test
    void providerPostRootIncludesCredentialValuesOnce() throws Exception {
        initContext(HttpMethod.POST);
        when(llmProviderService.add(any())).thenReturn(createSecretProvider());

        Object body = llmProvidersController.add(createProviderRequest()).getBody();

        assertProviderCreateResponse(serialize(body));
    }

    @Test
    void providerPostExistingProviderThrowsConflictWithoutSecrets() {
        initContext(HttpMethod.POST);
        when(llmProviderService.add(any())).thenThrow(
            new ResourceConflictException("Provider " + PROVIDER_NAME + " already exists. Use PUT to update it."));

        ResourceConflictException exception = assertThrows(ResourceConflictException.class,
            () -> llmProvidersController.add(createProviderRequest()));

        assertFalse(exception.getMessage().contains("provider-token"));
        assertFalse(exception.getMessage().contains("aws-access"));
        assertFalse(exception.getMessage().contains("vertex-secret"));
        verify(llmProviderService).add(any());
        verify(llmProviderService, never()).addOrUpdate(any());
    }

    @Test
    void providerPutRootOmitsCredentialValues() throws Exception {
        initContext(HttpMethod.PUT);
        when(llmProviderService.addOrUpdate(any())).thenReturn(createSecretProvider());

        Object body = llmProvidersController.put(PROVIDER_NAME, createProviderRequest()).getBody();

        assertProviderResponse(serialize(body));
    }

    @Test
    void consumerListOmitsCredentialValues() throws Exception {
        initContext(HttpMethod.GET);
        when(consumerService.list(any())).thenReturn(consumerPage());

        Object body = consumersController.list(null).getBody();

        assertConsumerResponse(serialize(body).get("data").get(0));
    }

    @Test
    void consumerGetOmitsCredentialValues() throws Exception {
        initContext(HttpMethod.GET);
        when(consumerService.query(CONSUMER_NAME)).thenReturn(createSecretConsumer());

        Object body = consumersController.query(CONSUMER_NAME).getBody();

        assertConsumerResponse(serialize(body).get("data"));
    }

    @Test
    void consumerPostRootIncludesCredentialValuesOnce() throws Exception {
        initContext(HttpMethod.POST);
        when(consumerService.add(any())).thenReturn(createSecretConsumer());

        Object body = consumersController.add(createConsumerRequest()).getBody();

        assertConsumerCreateResponse(serialize(body));
    }

    @Test
    void consumerPostExistingConsumerThrowsConflictWithoutSecrets() {
        initContext(HttpMethod.POST);
        when(consumerService.add(any())).thenThrow(
            new ResourceConflictException("Consumer " + CONSUMER_NAME + " already exists. Use PUT to update it."));

        ResourceConflictException exception = assertThrows(ResourceConflictException.class,
            () -> consumersController.add(createConsumerRequest()));

        assertFalse(exception.getMessage().contains("consumer-secret"));
        verify(consumerService).add(any());
        verify(consumerService, never()).addOrUpdate(any());
    }

    @Test
    void consumerPutRootOmitsCredentialValues() throws Exception {
        initContext(HttpMethod.PUT);
        when(consumerService.addOrUpdate(any())).thenReturn(createSecretConsumer());

        Object body = consumersController.put(CONSUMER_NAME, createConsumerRequest()).getBody();

        assertConsumerResponse(serialize(body));
    }

    private JsonNode serialize(Object body) throws Exception {
        return objectMapper.readTree(objectMapper.writeValueAsString(body));
    }

    private static void assertProviderResponse(JsonNode provider) {
        assertNotNull(provider);
        assertFalse(provider.has("tokens"));
        assertEquals(2, provider.get("tokenCount").asInt());
        assertTrue(provider.get("awsAccessKeyConfigured").asBoolean());
        assertTrue(provider.get("awsSecretKeyConfigured").asBoolean());
        assertTrue(provider.get("vertexAuthKeyConfigured").asBoolean());
        JsonNode rawConfigs = provider.get("rawConfigs");
        assertNotNull(rawConfigs);
        assertFalse(rawConfigs.has("apiTokens"));
        assertFalse(rawConfigs.has("awsAccessKey"));
        assertFalse(rawConfigs.has("awsSecretKey"));
        assertFalse(rawConfigs.has("vertexAuthKey"));
        assertEquals("visible", rawConfigs.get("nonSecret").asText());
        assertFalse(provider.toString().contains("provider-token"));
        assertFalse(provider.toString().contains("aws-access"));
        assertFalse(provider.toString().contains("aws-secret"));
        assertFalse(provider.toString().contains("vertex-secret"));
    }

    private static void assertProviderCreateResponse(JsonNode provider) {
        assertNotNull(provider);
        JsonNode tokens = provider.get("tokens");
        assertNotNull(tokens);
        assertEquals(2, tokens.size());
        assertEquals("provider-token-1", tokens.get(0).asText());
        assertEquals("provider-token-2", tokens.get(1).asText());
        assertEquals(2, provider.get("tokenCount").asInt());
        assertTrue(provider.get("awsAccessKeyConfigured").asBoolean());
        assertTrue(provider.get("awsSecretKeyConfigured").asBoolean());
        assertTrue(provider.get("vertexAuthKeyConfigured").asBoolean());
        JsonNode rawConfigs = provider.get("rawConfigs");
        assertNotNull(rawConfigs);
        assertEquals(2, rawConfigs.get("apiTokens").size());
        assertEquals("aws-access", rawConfigs.get("awsAccessKey").asText());
        assertEquals("aws-secret", rawConfigs.get("awsSecretKey").asText());
        assertEquals("vertex-secret", rawConfigs.get("vertexAuthKey").asText());
        assertEquals("visible", rawConfigs.get("nonSecret").asText());
    }

    private static void assertConsumerResponse(JsonNode consumer) {
        assertNotNull(consumer);
        JsonNode credential = consumer.get("credentials").get(0);
        assertFalse(credential.has("values"));
        assertEquals(2, credential.get("credentialCount").asInt());
        assertEquals("x-api-key", credential.get("key").asText());
        assertFalse(consumer.toString().contains("consumer-secret"));
    }

    private static void assertConsumerCreateResponse(JsonNode consumer) {
        assertNotNull(consumer);
        JsonNode credential = consumer.get("credentials").get(0);
        JsonNode values = credential.get("values");
        assertNotNull(values);
        assertEquals(2, values.size());
        assertEquals("consumer-secret-1", values.get(0).asText());
        assertEquals("consumer-secret-2", values.get(1).asText());
        assertEquals(2, credential.get("credentialCount").asInt());
        assertEquals("x-api-key", credential.get("key").asText());
    }

    private static PaginatedResult<LlmProvider> providerPage() {
        return PaginatedResult.<LlmProvider>builder().pageNum(1).pageSize(10).total(1)
            .data(Collections.singletonList(createSecretProvider())).build();
    }

    private static PaginatedResult<Consumer> consumerPage() {
        return PaginatedResult.<Consumer>builder().pageNum(1).pageSize(10).total(1)
            .data(Collections.singletonList(createSecretConsumer())).build();
    }

    private static LlmProvider createSecretProvider() {
        Map<String, Object> rawConfigs = new HashMap<>();
        rawConfigs.put("apiTokens", Arrays.asList("provider-token-1", "provider-token-2"));
        rawConfigs.put("awsAccessKey", "aws-access");
        rawConfigs.put("awsSecretKey", "aws-secret");
        rawConfigs.put("vertexAuthKey", "vertex-secret");
        rawConfigs.put("nonSecret", "visible");
        return LlmProvider.builder().name(PROVIDER_NAME).type(LlmProviderType.BEDROCK)
            .tokens(Arrays.asList("provider-token-1", "provider-token-2")).rawConfigs(rawConfigs).build();
    }

    private static LlmProvider createProviderRequest() {
        return LlmProvider.builder().name(PROVIDER_NAME).type(LlmProviderType.OPENAI).build();
    }

    private static Consumer createSecretConsumer() {
        KeyAuthCredential credential = new KeyAuthCredential(CredentialType.KEY_AUTH,
            KeyAuthCredentialSource.HEADER.name(), "x-api-key", Arrays.asList("consumer-secret-1", "consumer-secret-2"));
        return Consumer.builder().name(CONSUMER_NAME).credentials(Collections.singletonList(credential)).build();
    }

    private static Consumer createConsumerRequest() {
        return createSecretConsumer();
    }

    private static void initContext(HttpMethod method) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod(method.name());
        HttpContext.init(request, new MockHttpServletResponse());
    }
}
