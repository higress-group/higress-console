package com.alibaba.higress.console.controller.dto.istio;

import java.util.Map;

public class IstioEndpoint {

    private Map<String, String> Labels;

    private String Address;
    
    public Map<String, String> getLabels() {
        return Labels;
    }
    
    public void setLabels(Map<String, String> labels) {
        Labels = labels;
    }
    
    public String getAddress() {
        return Address;
    }
    
    public void setAddress(String address) {
        Address = address;
    }
}
