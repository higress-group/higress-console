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
package com.alibaba.higress.sdk.model.consumer;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.higress.sdk.exception.ValidationException;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Service Consumer")
public class Consumer {

    @Schema(description = "Consumer name")
    private String name;
    @Schema(description = "Consumer credentials")
    private List<Credential> credentials;

    public void validate(boolean forUpdate) {
        if (StringUtils.isBlank(name)) {
            throw new ValidationException("name cannot be blank.");
        }
        if (CollectionUtils.isEmpty(credentials)) {
            throw new ValidationException("credentials cannot be empty.");
        }
        credentials.forEach(c -> c.validate(forUpdate));
    }
}
