package com.alibaba.higress.console.service;

import com.alibaba.higress.console.controller.dto.Domain;
import io.kubernetes.client.openapi.ApiException;

import java.util.List;

public interface DomainService {

    void add(Domain domain) throws ApiException;

    List<Domain> getAll() throws ApiException;

    Domain query(String domainName) throws ApiException;

    void delete(String domainName) throws ApiException;

    void put(Domain domain) throws ApiException;
}