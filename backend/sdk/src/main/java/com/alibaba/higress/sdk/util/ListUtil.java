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
package com.alibaba.higress.sdk.util;

import java.util.HashSet;
import java.util.List;

import org.apache.commons.collections4.CollectionUtils;

public class ListUtil {

    public static boolean equalsUnordered(List<String> list1, List<String> list2) {
        if (CollectionUtils.isEmpty(list1) && CollectionUtils.isEmpty(list2)) {
            return true;
        }
        if (list1 == null || list2 == null) {
            return false;
        }
        return list1.size() == list2.size() && new HashSet<>(list1).containsAll(list2);
    }
}
