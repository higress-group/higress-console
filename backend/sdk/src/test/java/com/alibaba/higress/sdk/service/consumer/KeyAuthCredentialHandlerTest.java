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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.higress.sdk.model.consumer.AllowListOperation;
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
import com.alibaba.higress.sdk.util.MapUtil;
import com.google.common.collect.Lists;

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
        Assertions.assertFalse(handler.isConsumerInUse("zhangsan", Lists.newArrayList()));
    }

    @Test
    public void isConsumerInUseTestNotFound() {
        WasmPluginInstance instance = new WasmPluginInstance();
        instance.setGlobalTarget();
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-567890");
        addConsumer(instance, "wangwu", true, false, "Authorization", "Bearer sk-135790");
        WasmPluginInstance domainInstance = createInstance(WasmPluginInstanceScope.DOMAIN, "www.example.com");
        addAllow(domainInstance, Lists.newArrayList("lisi"));
        WasmPluginInstance routeInstance = createInstance(WasmPluginInstanceScope.ROUTE, "test-route");
        addAllow(routeInstance, Lists.newArrayList("lisi", "wangwu"));

        Assertions.assertFalse(
            handler.isConsumerInUse("zhangsan", Lists.newArrayList(instance, domainInstance, routeInstance)));
    }

    @Test
    public void isConsumerInUseTestFoundInOneInstance() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-567890");
        WasmPluginInstance domainInstance = createInstance(WasmPluginInstanceScope.DOMAIN, "www.example.com");
        addAllow(domainInstance, Lists.newArrayList("lisi"));
        WasmPluginInstance routeInstance = createInstance(WasmPluginInstanceScope.ROUTE, "test-route");
        addAllow(routeInstance, Lists.newArrayList("lisi", "zhangsan"));

        Assertions.assertTrue(
            handler.isConsumerInUse("zhangsan", Lists.newArrayList(instance, domainInstance, routeInstance)));
    }

    @Test
    public void isConsumerInUseTestFoundInMultiInstances() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "lisi", true, false, "Authorization", "Bearer sk-567890");
        WasmPluginInstance domainInstance = createInstance(WasmPluginInstanceScope.DOMAIN, "test-domain");
        addAllow(domainInstance, Lists.newArrayList("lisi"));
        WasmPluginInstance routeInstance = createInstance(WasmPluginInstanceScope.ROUTE, "test-route");
        addAllow(routeInstance, Lists.newArrayList("lisi", "zhangsan", "wangwu"));

        Assertions.assertTrue(
            handler.isConsumerInUse("zhangsan", Lists.newArrayList(instance, domainInstance, routeInstance)));
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
        instance.setConfigurations(MapUtil.of("test", "value"));

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertTrue(consumers.isEmpty());
    }

    @Test
    public void extractConsumersTestConsumersNotList() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(MapUtil.of("consumers", "value"));

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertTrue(consumers.isEmpty());
    }

    @Test
    public void extractConsumersTestEmptyConsumerList() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(MapUtil.of("consumers", Lists.newArrayList()));

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertTrue(consumers.isEmpty());
    }

    @Test
    public void extractConsumersTestGoodConsumerList() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");
        addConsumer(instance, "lisi", true, false, "X-API-KEY", "abcd-1234");
        addConsumer(instance, "wangwu", false, true, "api_key", "efgh-5678", "ijkl-91011");
        addConsumer(instance, "zhaoliu", true, false, "Authorization", "sk-654321");
        addConsumer(instance, "guoqi", true, false, "Authorization", true, "sk-abcdefg");

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(5, consumers.size());
        Assertions.assertTrue(consumers.contains(new Consumer("zhangsan", Lists.newArrayList(
            new KeyAuthCredential(KeyAuthCredentialSource.BEARER.name(), null, Lists.newArrayList("sk-123456"))))));
        Assertions.assertTrue(consumers.contains(
            new Consumer("lisi", Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(),
                "X-API-KEY", Lists.newArrayList("abcd-1234"))))));
        Assertions.assertTrue(consumers.contains(
            new Consumer("wangwu", Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.QUERY.name(),
                "api_key", Lists.newArrayList("efgh-5678", "ijkl-91011"))))));
        Assertions.assertTrue(consumers.contains(
            new Consumer("zhaoliu", Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(),
                "Authorization", Lists.newArrayList("sk-654321"))))));
        Assertions.assertTrue(consumers.contains(
            new Consumer("guoqi", Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(),
                "Authorization", Lists.newArrayList("sk-abcdefg"))))));
    }

    @Test
    public void saveConsumerTestFromNothingBearer() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Consumer consumer = new Consumer("zhangsan", Lists.newArrayList(
            new KeyAuthCredential(KeyAuthCredentialSource.BEARER.name(), null, Lists.newArrayList("sk-123456"))));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(Lists.newArrayList("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals(Lists.newArrayList("Bearer sk-123456"), consumerMap.get("credentials"));
    }

    @Test
    public void saveConsumerTestFromNothingBearerMultipleValues() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Consumer consumer =
            new Consumer("zhangsan", Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.BEARER.name(),
                null, Lists.newArrayList("sk-123456", "sk-abcdefg"))));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(Lists.newArrayList("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals(Lists.newArrayList("Bearer sk-123456", "Bearer sk-abcdefg"),
            consumerMap.get("credentials"));
    }

    @Test
    public void saveConsumerTestBadConsumersHeader() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(new HashMap<>(MapUtil.of("consumers", "value")));

        Consumer consumer =
            new Consumer("zhangsan", Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(),
                "X-API-KEY", Lists.newArrayList("sk-123456"))));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(Lists.newArrayList("X-API-KEY"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals(Lists.newArrayList("sk-123456"), consumerMap.get("credentials"));
    }

    @Test
    public void saveConsumerTestBadConsumersHeaderMultipleValues() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(new HashMap<>(MapUtil.of("consumers", "value")));

        Consumer consumer =
            new Consumer("zhangsan", Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(),
                "X-API-KEY", Lists.newArrayList("sk-123456", "sk-abcdefg"))));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(Lists.newArrayList("X-API-KEY"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals(Lists.newArrayList("sk-123456", "sk-abcdefg"), consumerMap.get("credentials"));
    }

    @Test
    public void saveConsumerTestUpdateQuery() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");

        Consumer consumer = new Consumer("zhangsan", Lists.newArrayList(
            new KeyAuthCredential(KeyAuthCredentialSource.QUERY.name(), "token", Lists.newArrayList("sk-123456"))));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(Lists.newArrayList("token"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_query"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_header"));
        Assertions.assertEquals(Lists.newArrayList("sk-123456"), consumerMap.get("credentials"));
    }

    @Test
    public void saveConsumerTestNoUpdateEmptyData() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");

        Consumer consumer = new Consumer("zhangsan", Lists.newArrayList(new KeyAuthCredential()));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(Lists.newArrayList("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals(Lists.newArrayList("Bearer sk-123456"), consumerMap.get("credentials"));
    }

    @Test
    public void saveConsumerTestNoUpdatePartialData() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");

        Consumer consumer = new Consumer("zhangsan",
            Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "X-API-KEY", null)));
        Assertions.assertTrue(handler.saveConsumer(instance, consumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("zhangsan", consumerMap.get("name"));
        Assertions.assertEquals(Lists.newArrayList("X-API-KEY"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals(Lists.newArrayList("sk-123456"), consumerMap.get("credentials"));
    }

    @Test
    public void saveConsumerTestDeleteExistedCredential() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "zhangsan", true, false, "Authorization", "Bearer sk-123456");

        Consumer consumer = new Consumer("zhangsan", Lists.newArrayList(new Credential("DUMMY")));
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
        instance.setConfigurations(MapUtil.of("test", "value"));

        Assertions.assertFalse(handler.deleteConsumer(instance, "zhangsan"));
    }

    @Test
    public void deleteConsumerTestBadConsumers() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        instance.setConfigurations(MapUtil.of("consumer", "value"));

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
        Assertions.assertEquals(Lists.newArrayList("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals(Lists.newArrayList("Bearer sk-123456"), consumerMap.get("credentials"));
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
        Assertions.assertEquals(Lists.newArrayList("Authorization"), consumerMap.get("keys"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertNotEquals(Boolean.TRUE, consumerMap.get("in_query"));
        Assertions.assertEquals(Lists.newArrayList("Bearer sk-123456"), consumerMap.get("credentials"));
    }

    @Test
    public void testGetAllowList_AllBranches() {
        WasmPluginInstance instance = new WasmPluginInstance();
        // 1. 配置为null
        Assertions.assertTrue(handler.getAllowList(instance).isEmpty());
        // 2. 配置为空map
        instance.setConfigurations(new HashMap<>());
        Assertions.assertTrue(handler.getAllowList(instance).isEmpty());
        // 3. ALLOW字段不存在
        instance.setConfigurations(MapUtil.of("other", Lists.newArrayList("a")));
        Assertions.assertTrue(handler.getAllowList(instance).isEmpty());
        // 4. ALLOW字段不是List
        instance.setConfigurations(MapUtil.of("allow", "notalist"));
        Assertions.assertTrue(handler.getAllowList(instance).isEmpty());
        // 5. ALLOW字段为List但内容为空
        instance.setConfigurations(MapUtil.of("allow", Lists.newArrayList()));
        Assertions.assertTrue(handler.getAllowList(instance).isEmpty());
        // 6. ALLOW字段为List但内容为非字符串
        instance.setConfigurations(MapUtil.of("allow", Lists.newArrayList(123, true)));
        Assertions.assertTrue(handler.getAllowList(instance).isEmpty());
        // 7. ALLOW字段为List且内容为字符串
        instance.setConfigurations(MapUtil.of("allow", Lists.newArrayList("a", "b")));
        Assertions.assertEquals(Lists.newArrayList("a", "b"), handler.getAllowList(instance));
    }

    @Test
    public void testUpdateAllowList_AllBranches() {
        WasmPluginInstance instance = new WasmPluginInstance();
        // 1. 配置为null，ADD
        handler.updateAllowList(AllowListOperation.ADD, instance, Lists.newArrayList("a"));
        Assertions.assertEquals(Lists.newArrayList("a"), handler.getAllowList(instance));
        // 2. ADD已存在的
        handler.updateAllowList(AllowListOperation.ADD, instance, Lists.newArrayList("a", "b"));
        Assertions.assertEquals(Lists.newArrayList("a", "b"), handler.getAllowList(instance));
        // 3. REMOVE存在的
        handler.updateAllowList(AllowListOperation.REMOVE, instance, Lists.newArrayList("a"));
        Assertions.assertEquals(Lists.newArrayList("b"), handler.getAllowList(instance));
        // 4. REMOVE不存在的
        handler.updateAllowList(AllowListOperation.REMOVE, instance, Lists.newArrayList("notfound"));
        Assertions.assertEquals(Lists.newArrayList("b"), handler.getAllowList(instance));
        // 5. REPLACE
        handler.updateAllowList(AllowListOperation.REPLACE, instance, Lists.newArrayList("x", "y"));
        Assertions.assertEquals(Lists.newArrayList("x", "y"), handler.getAllowList(instance));
        // 6. consumerNames为空
        handler.updateAllowList(AllowListOperation.REPLACE, instance, null);
        Assertions.assertTrue(handler.getAllowList(instance).isEmpty());
        handler.updateAllowList(AllowListOperation.REPLACE, instance, Lists.newArrayList());
        Assertions.assertTrue(handler.getAllowList(instance).isEmpty());
        // 7. 不支持的operation
        try {
            handler.updateAllowList(null, instance, Lists.newArrayList("a"));
            Assertions.fail("Should throw exception");
        } catch (Exception e) {
            Assertions.assertTrue(e instanceof UnsupportedOperationException || e instanceof NullPointerException);
        }
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
        String... credentials) {
        addConsumer(instance, name, inHeader, inQuery, key, false, credentials);
    }

    private void addConsumer(WasmPluginInstance instance, String name, boolean inHeader, boolean inQuery, String key,
        boolean legacy, String... credentials) {
        Map<String, Object> configurations = instance.getConfigurations();
        if (configurations == null) {
            configurations = new HashMap<>();
        }
        List<Map<String, Object>> consumers =
            (List<Map<String, Object>>)configurations.computeIfAbsent("consumers", k -> new ArrayList<>());
        Map<String, Object> consumer = new HashMap<>();
        consumer.put("name", name);
        consumer.put("keys", Lists.newArrayList(key));
        if (legacy) {
            assert credentials.length == 1;
            consumer.put("credential", credentials[0]);
        } else {
            consumer.put("credentials", Arrays.asList(credentials));
        }
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
