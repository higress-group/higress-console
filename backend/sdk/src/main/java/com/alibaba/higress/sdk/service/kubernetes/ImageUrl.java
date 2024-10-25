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

import com.alibaba.higress.sdk.constant.CommonKey;
import com.alibaba.higress.sdk.constant.Separators;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageUrl {

    private String repository;
    private String tag;

    public String toUrlString() {
        return tag != null ? repository + ":" + tag : repository;
    }

    public static ImageUrl parse(String url) {
        int colonIndex = url.lastIndexOf(Separators.COLON);
        if (colonIndex == -1) {
            return new ImageUrl(url, null);
        }
        int protocolIndex = url.indexOf(CommonKey.PROTOCOL_KEYWORD);
        if (colonIndex <= protocolIndex) {
            return new ImageUrl(url, null);
        }
        return new ImageUrl(url.substring(0, colonIndex), url.substring(colonIndex + 1));
    }
}
