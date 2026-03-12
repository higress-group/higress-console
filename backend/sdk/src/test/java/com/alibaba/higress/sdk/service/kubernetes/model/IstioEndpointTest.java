package com.alibaba.higress.sdk.service.kubernetes.model;

import com.alibaba.fastjson.JSON;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Arrays;

public class IstioEndpointTest {

    @Test
    public void testDeserializeAddresses() {
        String json = "{\"Addresses\":[\"192.168.1.1\",\"192.168.1.2\"]}";
        IstioEndpoint ep = JSON.parseObject(json, IstioEndpoint.class);
        assertEquals(Arrays.asList("192.168.1.1", "192.168.1.2"), ep.getAddresses());
        assertEquals("192.168.1.1", ep.getAddress());
    }

    @Test
    public void testDeserializeEmptyAddresses() {
        String json = "{\"Addresses\":[]}";
        IstioEndpoint ep = JSON.parseObject(json, IstioEndpoint.class);
        assertNull(ep.getAddress());
    }
}