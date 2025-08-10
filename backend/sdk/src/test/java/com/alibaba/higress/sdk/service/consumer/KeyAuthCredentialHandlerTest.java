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

import com.alibaba.higress.sdk.constant.plugin.BuiltInPluginName;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.WasmPluginInstance;
import com.alibaba.higress.sdk.model.WasmPluginInstanceScope;
import com.alibaba.higress.sdk.model.consumer.AllowListOperation;
import com.alibaba.higress.sdk.model.consumer.Consumer;
import com.alibaba.higress.sdk.model.consumer.Credential;
import com.alibaba.higress.sdk.model.consumer.CredentialType;
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

    @Test
    public void extractConsumersTestMixedConsumerTypes() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Map<String, Object> configurations = new HashMap<>();
        List<Object> consumers = new ArrayList<>();

        // 添加有效的consumer
        Map<String, Object> validConsumer = new HashMap<>();
        validConsumer.put("name", "valid");
        validConsumer.put("keys", Lists.newArrayList("Authorization"));
        validConsumer.put("in_header", true);
        validConsumer.put("credentials", Lists.newArrayList("Bearer token1"));
        consumers.add(validConsumer);

        // 添加无效的consumer (非Map类型)
        consumers.add("invalid_consumer");

        // 添加空名称的consumer
        Map<String, Object> emptyNameConsumer = new HashMap<>();
        emptyNameConsumer.put("name", "");
        emptyNameConsumer.put("keys", Lists.newArrayList("X-API-KEY"));
        consumers.add(emptyNameConsumer);

        // 添加null名称的consumer
        Map<String, Object> nullNameConsumer = new HashMap<>();
        nullNameConsumer.put("keys", Lists.newArrayList("X-API-KEY"));
        consumers.add(nullNameConsumer);

        // 添加无keys的consumer
        Map<String, Object> noKeysConsumer = new HashMap<>();
        noKeysConsumer.put("name", "nokeys");
        consumers.add(noKeysConsumer);

        configurations.put("consumers", consumers);
        instance.setConfigurations(configurations);

        List<Consumer> result = handler.extractConsumers(instance);
        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals("valid", result.get(0).getName());
    }

    @Test
    public void saveConsumerTestInvalidCredentialSource() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Consumer consumer = new Consumer("testuser",
            Lists.newArrayList(new KeyAuthCredential("INVALID_SOURCE", "X-API-KEY", Lists.newArrayList("test-key"))));

        Assertions.assertThrows(ValidationException.class, () -> {
            handler.saveConsumer(instance, consumer);
        });
    }

    @Test
    public void saveConsumerTestDuplicateCredential() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);

        // 先添加一个consumer
        Consumer consumer1 = new Consumer("user1", Lists.newArrayList(
            new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "X-API-KEY", Lists.newArrayList("same-key"))));
        handler.saveConsumer(instance, consumer1);

        // 尝试添加具有相同凭证的另一个consumer
        Consumer consumer2 = new Consumer("user2", Lists.newArrayList(
            new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "X-API-KEY", Lists.newArrayList("same-key"))));

        Assertions.assertThrows(IllegalArgumentException.class, () -> {
            handler.saveConsumer(instance, consumer2);
        });
    }

    @Test
    public void saveConsumerTestValidationFailure() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);

        // 创建一个无效的凭证（空values）
        KeyAuthCredential invalidCredential =
            new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "X-API-KEY", null);
        Consumer consumer = new Consumer("testuser", Lists.newArrayList(invalidCredential));

        Assertions.assertThrows(ValidationException.class, () -> {
            handler.saveConsumer(instance, consumer);
        });
    }

    @Test
    public void saveConsumerTestNoCredentials() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Consumer consumer = new Consumer("testuser", Lists.newArrayList());

        Assertions.assertFalse(handler.saveConsumer(instance, consumer));
    }

    @Test
    public void extractConsumersTestLegacyCredentialFormat() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        addConsumer(instance, "legacy_user", true, false, "Authorization", true, "Bearer legacy-token");

        List<Consumer> consumers = handler.extractConsumers(instance);
        Assertions.assertNotNull(consumers);
        Assertions.assertEquals(1, consumers.size());

        Consumer consumer = consumers.get(0);
        Assertions.assertEquals("legacy_user", consumer.getName());
        KeyAuthCredential credential = (KeyAuthCredential)consumer.getCredentials().get(0);
        Assertions.assertEquals(KeyAuthCredentialSource.BEARER.name(), credential.getSource());
        Assertions.assertEquals(Lists.newArrayList("legacy-token"), credential.getValues());
    }

    @Test
    public void parseCredentialTestEdgeCases() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Map<String, Object> configurations = new HashMap<>();
        List<Object> consumers = new ArrayList<>();

        // Consumer with empty keys list
        Map<String, Object> emptyKeysConsumer = new HashMap<>();
        emptyKeysConsumer.put("name", "emptykeys");
        emptyKeysConsumer.put("keys", Lists.newArrayList());
        emptyKeysConsumer.put("in_header", true);
        consumers.add(emptyKeysConsumer);

        // Consumer with non-string keys
        Map<String, Object> nonStringKeysConsumer = new HashMap<>();
        nonStringKeysConsumer.put("name", "nonstringkeys");
        nonStringKeysConsumer.put("keys", Lists.newArrayList(123, null, ""));
        nonStringKeysConsumer.put("in_header", true);
        consumers.add(nonStringKeysConsumer);

        // Consumer with neither in_header nor in_query set to true
        Map<String, Object> noLocationConsumer = new HashMap<>();
        noLocationConsumer.put("name", "nolocation");
        noLocationConsumer.put("keys", Lists.newArrayList("X-API-KEY"));
        consumers.add(noLocationConsumer);

        // Consumer with non-list keys
        Map<String, Object> nonListKeysConsumer = new HashMap<>();
        nonListKeysConsumer.put("name", "nonlistkeys");
        nonListKeysConsumer.put("keys", "not-a-list");
        nonListKeysConsumer.put("in_header", true);
        consumers.add(nonListKeysConsumer);

        configurations.put("consumers", consumers);
        instance.setConfigurations(configurations);

        List<Consumer> result = handler.extractConsumers(instance);
        Assertions.assertNotNull(result);
        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    public void saveConsumerTestMergeExistingConfig() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);

        // 先添加一个consumer
        addConsumer(instance, "testuser", true, false, "Authorization", "Bearer old-token");

        // 只更新key，不提供source和values
        Consumer partialConsumer = new Consumer("testuser",
            Lists.newArrayList(new KeyAuthCredential(KeyAuthCredentialSource.HEADER.name(), "X-API-KEY", null)));

        Assertions.assertTrue(handler.saveConsumer(instance, partialConsumer));

        List<Map<String, Object>> consumers = (List<Map<String, Object>>)instance.getConfigurations().get("consumers");
        Assertions.assertEquals(1, consumers.size());
        Map<String, Object> consumerMap = consumers.get(0);
        Assertions.assertEquals("testuser", consumerMap.get("name"));
        Assertions.assertEquals(Lists.newArrayList("X-API-KEY"), consumerMap.get("keys"));
        Assertions.assertEquals(Lists.newArrayList("old-token"), consumerMap.get("credentials"));
        Assertions.assertEquals(true, consumerMap.get("in_header"));
        Assertions.assertEquals(false, consumerMap.get("in_query"));
    }

    @Test
    public void deleteConsumerTestConsumersNotList() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Map<String, Object> configurations = new HashMap<>();
        configurations.put("consumers", "not-a-list");
        instance.setConfigurations(configurations);

        Assertions.assertFalse(handler.deleteConsumer(instance, "testuser"));
    }

    @Test
    public void deleteConsumerTestNonMapConsumer() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Map<String, Object> configurations = new HashMap<>();
        List<Object> consumers = new ArrayList<>();
        consumers.add("not-a-map");
        consumers.add(123);
        configurations.put("consumers", consumers);
        instance.setConfigurations(configurations);

        Assertions.assertFalse(handler.deleteConsumer(instance, "testuser"));
    }

    @Test
    public void isConsumerInUseTestEmptyAllowList() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.DOMAIN, "example.com");
        Map<String, Object> configurations = new HashMap<>();
        configurations.put("allow", Lists.newArrayList());
        instance.setConfigurations(configurations);

        Assertions.assertFalse(handler.isConsumerInUse("testuser", Lists.newArrayList(instance)));
    }

    @Test
    public void isConsumerInUseTestNonListAllow() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.DOMAIN, "example.com");
        Map<String, Object> configurations = new HashMap<>();
        configurations.put("allow", "not-a-list");
        instance.setConfigurations(configurations);

        Assertions.assertFalse(handler.isConsumerInUse("testuser", Lists.newArrayList(instance)));
    }

    @Test
    public void testGetType() {
        Assertions.assertEquals(CredentialType.KEY_AUTH, handler.getType());
    }

    @Test
    public void testGetPluginName() {
        Assertions.assertEquals(BuiltInPluginName.KEY_AUTH, handler.getPluginName());
    }

    @Test
    public void extractConsumersTestWithBothCredentialAndCredentials() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);
        Map<String, Object> configurations = new HashMap<>();
        List<Object> consumers = new ArrayList<>();

        // Consumer with both legacy credential and new credentials
        Map<String, Object> consumer = new HashMap<>();
        consumer.put("name", "testuser");
        consumer.put("keys", Lists.newArrayList("Authorization"));
        consumer.put("in_header", true);
        consumer.put("credential", "Bearer old-token");
        consumer.put("credentials", Lists.newArrayList("Bearer new-token"));
        consumers.add(consumer);

        configurations.put("consumers", consumers);
        instance.setConfigurations(configurations);

        List<Consumer> result = handler.extractConsumers(instance);
        Assertions.assertNotNull(result);
        Assertions.assertEquals(1, result.size());

        Consumer extractedConsumer = result.get(0);
        KeyAuthCredential credential = (KeyAuthCredential)extractedConsumer.getCredentials().get(0);
        // Should prefer new credentials format over legacy
        Assertions.assertEquals(Lists.newArrayList("new-token", "old-token"), credential.getValues());
    }

    @Test
    public void saveConsumerTestUnsupportedCredentialSource() {
        WasmPluginInstance instance = createInstance(WasmPluginInstanceScope.GLOBAL, null);

        // Mock an unsupported source by using a custom KeyAuthCredential with invalid source
        Consumer consumer = new Consumer("testuser",
            Lists.newArrayList(new KeyAuthCredential("UNSUPPORTED", "X-API-KEY", Lists.newArrayList("test-key"))));

        Assertions.assertThrows(ValidationException.class, () -> handler.saveConsumer(instance, consumer));
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
            consumer.put("credentials", Lists.newArrayList(credentials));
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
