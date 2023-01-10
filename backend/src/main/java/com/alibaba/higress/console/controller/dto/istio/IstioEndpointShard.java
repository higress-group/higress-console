package com.alibaba.higress.console.controller.dto.istio;

import java.util.List;
import java.util.Map;

public class IstioEndpointShard {
    private Map<String, List<IstioEndpoint>> Shards;
    
    public Map<String, List<IstioEndpoint>> getShards() {
        return Shards;
    }
    
    public void setShards(Map<String, List<IstioEndpoint>> shards) {
        Shards = shards;
    }
}
