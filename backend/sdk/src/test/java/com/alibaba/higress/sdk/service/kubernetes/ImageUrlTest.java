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
package com.alibaba.higress.sdk.service.kubernetes;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class ImageUrlTest {

    @Test
    public void parseImageUrlTestGoodTag() {
        String url = "oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block:1.0.0";
        ImageUrl urlObj = ImageUrl.parse(url);
        Assertions.assertEquals("oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block",
            urlObj.getRepository());
        Assertions.assertEquals("1.0.0", urlObj.getTag());
        Assertions.assertEquals(url, urlObj.toUrlString());
    }

    @Test
    public void parseImageUrlTestEmptyTag() {
        String url = "oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block:";
        ImageUrl urlObj = ImageUrl.parse(url);
        Assertions.assertEquals("oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block",
            urlObj.getRepository());
        Assertions.assertEquals("", urlObj.getTag());
        Assertions.assertEquals(url, urlObj.toUrlString());
    }

    @Test
    public void parseImageUrlTestNoTag() {
        String url = "oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block";
        ImageUrl urlObj = ImageUrl.parse(url);
        Assertions.assertEquals("oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block",
            urlObj.getRepository());
        Assertions.assertNull(urlObj.getTag());
        Assertions.assertEquals(url, urlObj.toUrlString());
    }

    @Test
    public void parseImageUrlTestNoProtocolNoTag() {
        String url = "higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block";
        ImageUrl urlObj = ImageUrl.parse(url);
        Assertions.assertEquals("higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/request-block",
            urlObj.getRepository());
        Assertions.assertNull(urlObj.getTag());
        Assertions.assertEquals(url, urlObj.toUrlString());
    }
}
