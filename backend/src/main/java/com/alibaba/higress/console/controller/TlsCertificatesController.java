/*
 * Copyright (c) 2022-2023 Alibaba Group Holding Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.PaginatedResult;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.dto.TlsCertificate;
import com.alibaba.higress.console.controller.exception.ValidationException;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.console.service.TlsCertificateService;

@RestController("TlsCertificatesController")
@RequestMapping("/v1/tls-certificates")
@Validated
public class TlsCertificatesController {

    private TlsCertificateService tlsCertificateService;

    @Resource
    public void setTlsCertificateService(TlsCertificateService tlsCertificateService) {
        this.tlsCertificateService = tlsCertificateService;
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<TlsCertificate>> list(CommonPageQuery query) {
        PaginatedResult<TlsCertificate> certificates = tlsCertificateService.list(query);
        if (CollectionUtils.isNotEmpty(certificates.getData())) {
            certificates.getData().forEach(TlsCertificatesController::stripSensitiveInfo);
        }
        return ControllerUtil.buildResponseEntity(certificates);
    }

    @PostMapping
    public ResponseEntity<Response<TlsCertificate>> add(@RequestBody TlsCertificate certificate) {
        TlsCertificate newCertificate = tlsCertificateService.add(certificate);
        stripSensitiveInfo(newCertificate);
        return ControllerUtil.buildResponseEntity(newCertificate);
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Response<TlsCertificate>> query(@PathVariable("name") @NotBlank String name) {
        TlsCertificate certificate = tlsCertificateService.query(name);
        stripSensitiveInfo(certificate);
        return ControllerUtil.buildResponseEntity(certificate);
    }

    @PutMapping("/{name}")
    public ResponseEntity<Response<TlsCertificate>> put(@PathVariable("name") @NotBlank String certificateName,
        @RequestBody TlsCertificate certificate) {
        if (StringUtils.isNotEmpty(certificate.getName())) {
            certificate.setName(certificateName);
        } else if (!StringUtils.equals(certificateName, certificate.getName())) {
            throw new ValidationException("TlsCertificate name in the URL doesn't match the one in the body.");
        }
        TlsCertificate updatedCertificate = tlsCertificateService.update(certificate);
        stripSensitiveInfo(updatedCertificate);
        return ControllerUtil.buildResponseEntity(updatedCertificate);
    }

    @DeleteMapping("/{name}")
    public void delete(@PathVariable("name") @NotBlank String name) {
        tlsCertificateService.delete(name);
    }

    private static void stripSensitiveInfo(TlsCertificate certificate) {
        if (certificate == null) {
            return;
        }
        certificate.setCert(null);
        certificate.setKey(null);
    }
}
