package com.alibaba.higress.console.controller.dto.route;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeaderModifyStageConfig {

    private List<Header> add;

    private List<Header> set;

    private List<String> delete;
}
