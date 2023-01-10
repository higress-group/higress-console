package com.alibaba.higress.console.controller.dto.istio;

import java.util.List;

public class RegistryzService {
    private RegistryzServiceAttributes Attributes;

    private String hostname;

    private List<Port> ports;
    
    public RegistryzServiceAttributes getAttributes() {
        return Attributes;
    }
    
    public void setAttributes(RegistryzServiceAttributes attributes) {
        Attributes = attributes;
    }
    
    public String getHostname() {
        return hostname;
    }
    
    public void setHostname(String hostname) {
        this.hostname = hostname;
    }
    
    public List<Port> getPorts() {
        return ports;
    }
    
    public void setPorts(List<Port> ports) {
        this.ports = ports;
    }
}
