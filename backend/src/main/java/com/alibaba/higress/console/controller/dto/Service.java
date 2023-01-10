package com.alibaba.higress.console.controller.dto;

import java.util.List;

public class Service {
    
    private String name;
    
    private String namespace;

    private List<String> endPoints;
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getNamespace() {
        return namespace;
    }
    
    public void setNamespace(String namespace) {
        this.namespace = namespace;
    }
    
    public List<String> getEndPoints() {
        return endPoints;
    }
    
    public void setEndPoints(List<String> endPoints) {
        this.endPoints = endPoints;
    }
}
