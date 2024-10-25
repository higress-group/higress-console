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
package com.alibaba.higress.sdk.util;

import org.apache.commons.lang3.StringUtils;

public final class StringUtil {

    private static final char DEFAULT_MASK_CHAR = '*';
    private static final int DEFAULT_MASK_START_OFFSET = 2;
    private static final int DEFAULT_MASK_END_OFFSET = 2;

    private StringUtil() {}

    public static String mask(String str) {
        return mask(str, DEFAULT_MASK_CHAR, DEFAULT_MASK_START_OFFSET, DEFAULT_MASK_END_OFFSET);
    }

    public static String mask(String str, char maskChar) {
        return mask(str, maskChar, DEFAULT_MASK_START_OFFSET, DEFAULT_MASK_END_OFFSET);
    }

    public static String mask(String str, char maskChar, int startOffset, int endOffset) {
        if (StringUtils.isEmpty(str)) {
            return str;
        }
        startOffset = Math.max(0, startOffset);
        endOffset = Math.max(0, endOffset);
        int length = str.length();
        if (length <= startOffset + endOffset) {
            int diff = startOffset + endOffset - length;
            if (diff == 0) {
                if (startOffset >= endOffset) {
                    --startOffset;
                } else {
                    --endOffset;
                }
            } else {
                int halfDiff = (diff + 1) / 2;
                if (startOffset >= endOffset) {
                    startOffset -= halfDiff;
                    endOffset -= diff - halfDiff;
                } else {
                    startOffset -= diff - halfDiff;
                    endOffset -= halfDiff;
                }
            }
            return mask(str, maskChar, startOffset, endOffset);
        }
        StringBuilder sb = new StringBuilder(length);
        sb.append(str, 0, startOffset);
        sb.append(String.valueOf(maskChar).repeat(Math.max(0, length - endOffset - startOffset)));
        sb.append(str, length - endOffset, length);
        return sb.toString();
    }

    public static void replace(StringBuilder builder, String target, String replacement) {
        int indexOfTarget;
        while ((indexOfTarget = builder.indexOf(target)) >= 0) {
            builder.replace(indexOfTarget, indexOfTarget + target.length(), replacement);
        }
    }
}
