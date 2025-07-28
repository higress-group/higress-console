package com.alibaba.higress.sdk.service.kubernetes.crd.mcp;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.util.List;

@Data
public class VPort {
    public static final String SERIALIZED_NAME_DEFAULT_VALUE_NAME = "default";
    @SerializedName(SERIALIZED_NAME_DEFAULT_VALUE_NAME)
    private Integer defaultValue;

    public static final String SERIALIZED_NAME_SERVICES = "services";
    @SerializedName(SERIALIZED_NAME_SERVICES)
    private List<vportService> vportServices;
    @Data
    public static class vportService {
        public static final String SERIALIZED_NAME_VPORTSERVICE_NAME = "name";
        @SerializedName(SERIALIZED_NAME_VPORTSERVICE_NAME)
        private String name;
        public static final String SERIALIZED_NAME_VPORTSERVICE_VALUE = "value";
        @SerializedName(SERIALIZED_NAME_VPORTSERVICE_VALUE)
        private int value;
    }
}
