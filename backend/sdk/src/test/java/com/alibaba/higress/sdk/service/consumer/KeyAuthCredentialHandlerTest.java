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
package com.alibaba.higress.sdk.service.consumer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.consumer.Credential;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredential;
import com.alibaba.higress.sdk.model.consumer.KeyAuthCredentialSource;

@SuppressWarnings("unchecked")
public class KeyAuthCredentialHandlerTest {

    private KeyAuthCredentialHandler handler;

    @BeforeEach
    public void setUp() {
        handler = new KeyAuthCredentialHandler();
    }

    @AfterEach
    public void tearDown() {
        handler = null;
    }

    // Test case of isConsumerInUse method, not used

    @Test
    public void isConsumerInUseTestNoInstance() {
        Assertions.assertFalse(handler.isConsumerInUse("zhangsan", null));
        Assertions.assertFalse(handler.isConsumerInUse("zhangsan", List.of()));
    }

    @Test
    public void isConsumerInUseTestNotFound() {
        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setGlobalTarget();
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-567890");
        addConsumer(instance, "wangwu", true, false, "Authorization", "Bearer sk-135790");
        WasmPluginInstance domainInstance = createInstance(WasmPluginInstanceScope.DOMAIN, "www.example.com");
        addAllow(domainInstance, List.of("lisi"));
        WasmPluginInstance routeInstance = createInstance(WasmPluginInstanceScope.ROUTE, "test-route");
        addAllow(routeInstance, List.of("lisi", "wangwu"));

        Assertions.assertFalse(handler.isConsumerInUse("zhangsan", List.of(instance, domainInstance, routeInstance)));
    }

    @Test
    public void isConsumerInUseTestFoundInOneInstance() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-567890");
        WasmPluginInstance domainInstance = createInstance(WasmPluginInstanceScope.DOMAIN, "www.example.com");
        addAllow(domainInstance, List.of("lisi"));
        WasmPluginInstance routeInstance = createInstance(WasmPluginInstanceScope.ROUTE, "test-route");
        addAllow(routeInstance, List.of("lisi", "zhangsan"));

        Assertions.assertTrue(handler.isConsumerInUse("zhangsan", List.of(instance, domainInstance, routeInstance)));
    }

    @Test
    public void isConsumerInUseTestFoundInMultiInstances() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-567890");
        WasmPluginInstance domainInstance = createInstance(WasmPluginInstanceScope.DOMAIN, "test-domain");
        addAllow(domainInstance, List.of("lisi"));
        WasmPluginInstance routeInstance = createInstance(WasmPluginInstanceScope.ROUTE, "test-route");
        addAllow(routeInstance, List.of("lisi", "zhangsan", "wangwu"));

        Assertions.assertTrue(handler.isConsumerInUse("zhangsan", List.of(instance, domainInstance, routeInstance)));
    }

    @Test
    public void extractConsumersTestEmptyConfiguration() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertTrue(consumers.isEmpty());
    }

    @Test
    public void extractConsumersTestNoConsumers() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(Map.of("test", "value"));

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertTrue(consumers.isEmpty());
    }

    @Test
    public void extractConsumersTestConsumersNotList() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(Map.of("consumers", "value"));

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertTrue(consumers.isEmpty());
    }

    @Test
    public void extractConsumersTestEmptyConsumerList() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(Map.of("consumers", List.of()));

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertTrue(consumers.isEmpty());
    }

    @Test
    public void extractConsumersTestGoodConsumerList() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "lisi", true, false, "X-API-KEY", "abcd-1234");
        addConsumer(instance, "wangwu", false, true, "api_key", "efgh-5678");
        addConsumer(instance, "zhaoliu", true, false, "Authorization", "sk-654321");

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(4, consumers.size());
        Assertions.assertTrue(consumers.contains(new Consumer("zhangsan",
            List.of(new KeyAuthCredential(KeyAuthCredentialSource.BEARER.name(), null, "sk-123456")))));
        Assertions.assertTrue(consumers.contains(new Consumer("lisi",
            List.of(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "X-API-KEY", "abcd-1234")))));
        Assertions.assertTrue(consumers.contains(new Consumer("wangwu",
            List.of(new KeyAuthCredential(KeyAuthCredentialSource.QUERY.name(), "api_key", "efgh-5678")))));
        Assertions.assertTrue(consumers.contains(new Consumer("zhaoliu",
            List.of(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "Authorization", "sk-654321")))));
    }

    @Test
    public void saveConsumerTestFromNothingBearer() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Consumer consumer = new Consumer("zhangsan",
            List.of(new KeyAuthCredential(KeyAuthCredentialSource.BEARER.name(), null, "sk-123456")));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(List.of("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals("Bearer sk-123456", consumerMap.get("credential"));
    }

    @Test
    public void saveConsumerTestBadConsumersHeader() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(new HashMap<>(Map.of("consumers", "value")));

        Consumer consumer = new Consumer("zhangsan",
            List.of(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "X-API-KEY", "sk-123456")));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(List.of("X-API-KEY"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals("sk-123456", consumerMap.get("credential"));
    }

    @Test
    public void saveConsumerTestUpdateQuery() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");

        Consumer consumer = new Consumer("zhangsan",
            List.of(new KeyAuthCredential(KeyAuthCredentialSource.QUERY.name(), "token", "sk-123456")));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(List.of("token"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_query"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_header"));
        Assertions.assertEquals("sk-123456", consumerMap.get("credential"));
    }

    @Test
    public void saveConsumerTestNoUpdateEmptyData() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");

        Consumer consumer = new Consumer("zhangsan", List.of(new KeyAuthCredential()));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(List.of("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals("Bearer sk-123456", consumerMap.get("credential"));
    }

    @Test
    public void saveConsumerTestNoUpdatePartialData() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");

        Consumer consumer = new Consumer("zhangsan",
            List.of(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "X-API-KEY", null)));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(List.of("X-API-KEY"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals("sk-123456", consumerMap.get("credential"));
    }

    @Test
    public void saveConsumerTestDeleteExistedCredential() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");

        Consumer consumer = new Consumer("zhangsan", List.of(new Credential("DUMMY")));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(0, consumers.size());
    }

    @Test
    public void deleteConsumerTestEmptyConfiguration() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);

        Assertions.assertFalse(handler.deleteConsumer(instance, "zhangsan"));
    }

    @Test
    public void deleteConsumerTestNoConsumers() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(Map.of("test", "value"));

        Assertions.assertFalse(handler.deleteConsumer(instance, "zhangsan"));
    }

    @Test
    public void deleteConsumerTestBadConsumers() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(Map.of("consumer", "value"));

        Assertions.assertFalse(handler.deleteConsumer(instance, "zhangsan"));
    }

    @Test
    public void deleteConsumerTestNotFound() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-123456");

        Assertions.assertFalse(handler.deleteConsumer(instance, "zhangsan"));
    }

    @Test
    public void deleteConsumerTestFoundOnce() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-abcdefg");
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-123456");

        Assertions.assertTrue(handler.deleteConsumer(instance, "zhangsan"));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("lisi", consumerMap.get("name"));
        Assertions.assertEquals(List.of("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals("Bearer sk-123456", consumerMap.get("credential"));
    }

    @Test
    public void deleteConsumerTestFoundTwice() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-abcdefg");
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "zhangsan", false, true, "token", "abcdefg");

        Assertions.assertTrue(handler.deleteConsumer(instance, "zhangsan"));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("lisi", consumerMap.get("name"));
        Assertions.assertEquals(List.of("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals("Bearer sk-123456", consumerMap.get("credential"));
    }

    private WasmPluginInstance createInstance(WasmPluginInstanceScope scope, String target) {
        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setPluginName(handler.getPluginName());
        instance.setPluginVersion("1.0.0");
        instance.setTarget(scope, target);
        instance.setInternal(true);
        return instance;
    }

    private void addConsumer(WasmPluginInstance instance, String name, boolean inHeader, boolean inQuery, String key,
        String credential) {
        Map<String, Object> configurations = instance.getConfigurations();
        if (configurations == null) {
            configurations = new HashMap<>();
        }
        List<Map<String, Object>> consumers =
            (List<Map<String, Object>>)configurations.computeIfAbsent("consumers", k -> new ArrayList<>());
        Map<String, Object> consumer = new HashMap<>();
        consumer.put("name", name);
        consumer.put("keys", List.of(key));
        consumer.put("credential", credential);
        if (inHeader) {
            consumer.put("in_header", true);
        }
        if (inQuery) {
            consumer.put("in_query", true);
        }
        consumers.add(consumer);
        instance.setConfigurations(configurations);
    }

    private void addAllow(WasmPluginInstance instance, List<String> consumerNames) {
        Map<String, Object> configurations = instance.getConfigurations();
        if (configurations == null) {
            configurations = new HashMap<>();
        }
        configurations.put("allow", new ArrayList<>(consumerNames));
        instance.setConfigurations(configurations);
    }
}
