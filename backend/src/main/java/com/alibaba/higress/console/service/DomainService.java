package com.alibaba.higress.console.service;

import java.io.IOException;
import java.util.List;

import com.alibaba.higress.console.controller.dto.Domain;
import io.kubernetes.client.openapi.ApiException;

public interface DomainService {

    void add(Domain domain) throws ApiException, IOException;

    List<Domain> getAll() throws ApiException, IOException;

    Domain query(String domainName) throws ApiException, IOException;

    void delete(String domainName) throws ApiException, IOException;

    void put(Domain domain) throws ApiException, IOException;
}