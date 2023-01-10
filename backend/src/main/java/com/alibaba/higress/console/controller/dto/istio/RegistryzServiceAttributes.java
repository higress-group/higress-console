package com.alibaba.higress.console.controller.dto.istio;


public class RegistryzServiceAttributes {
    
    private String ServiceRegistry;

    private String Name;

    private String Namespace;
    
    public String getServiceRegistry() {
        return ServiceRegistry;
    }
    
    public void setServiceRegistry(String serviceRegistry) {
        ServiceRegistry = serviceRegistry;
    }
    
    public String getName() {
        return Name;
    }
    
    public void setName(String name) {
        Name = name;
    }
    
    public String getNamespace() {
        return Namespace;
    }
    
    public void setNamespace(String namespace) {
        Namespace = namespace;
    }
}
