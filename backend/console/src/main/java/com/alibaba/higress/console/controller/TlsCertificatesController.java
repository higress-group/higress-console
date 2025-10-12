package com.alibaba.higress.console.controller;

import javax.annotation.Resource;
import javax.validation.constraints.NotBlank;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springdoc.api.annotations.ParameterObject;
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

import com.alibaba.higress.console.controller.dto.PaginatedResponse;
import com.alibaba.higress.console.controller.dto.Response;
import com.alibaba.higress.console.controller.util.ControllerUtil;
import com.alibaba.higress.sdk.exception.ValidationException;
import com.alibaba.higress.sdk.model.CommonPageQuery;
import com.alibaba.higress.sdk.model.PaginatedResult;
import com.alibaba.higress.sdk.model.TlsCertificate;
import com.alibaba.higress.sdk.service.TlsCertificateService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * TLS证书控制器，用于管理TLS证书的CRUD操作
 * 提供TLS证书的增删改查接口，用于HTTPS加密通信
 */
@RestController("TlsCertificatesController")
@RequestMapping("/v1/tls-certificates")
@Validated
@Tag(name = "TLS Certificate APIs")
public class TlsCertificatesController {

    /**
     * TLS证书服务类，用于处理TLS证书相关的业务逻辑
     */
    private TlsCertificateService tlsCertificateService;

    /**
     * 注入TLS证书服务
     * @param tlsCertificateService TLS证书服务实例
     */
    @Resource
    public void setTlsCertificateService(TlsCertificateService tlsCertificateService) {
        this.tlsCertificateService = tlsCertificateService;
    }

    /**
     * 获取TLS证书列表
     * @param query 分页查询参数
     * @return 分页的TLS证书列表响应
     */
    @GetMapping
    @Operation(summary = "List TLS certificates")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "TLS certificates listed successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<PaginatedResponse<TlsCertificate>> list(@ParameterObject CommonPageQuery query) {
        // 调用服务获取TLS证书列表
        PaginatedResult<TlsCertificate> certificates = tlsCertificateService.list(query);
        // 清除列表中每个证书的敏感信息
        if (CollectionUtils.isNotEmpty(certificates.getData())) {
            certificates.getData().forEach(TlsCertificatesController::stripSensitiveInfo);
        }
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(certificates);
    }

    /**
     * 添加新的TLS证书
     * @param certificate TLS证书对象
     * @return 添加后的TLS证书响应
     */
    @PostMapping
    @Operation(summary = "Add a new TLS certificate")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "TLS certificate added successfully"),
        @ApiResponse(responseCode = "400", description = "TLS certificate data is not valid"),
        @ApiResponse(responseCode = "409", description = "TLS certificate already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<TlsCertificate>> add(@RequestBody TlsCertificate certificate) {
        // 调用服务添加TLS证书
        TlsCertificate newCertificate = tlsCertificateService.add(certificate);
        // 清除敏感信息
        stripSensitiveInfo(newCertificate);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(newCertificate);
    }

    /**
     * 根据名称查询TLS证书
     * @param name TLS证书名称
     * @return TLS证书响应
     */
    @GetMapping(value = "/{name}")
    @Operation(summary = "Get TLS certificate by name")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "TLS certificate found"),
        @ApiResponse(responseCode = "404", description = "TLS certificate not found"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<TlsCertificate>> query(@PathVariable("name") @NotBlank String name) {
        // 调用服务查询TLS证书
        TlsCertificate certificate = tlsCertificateService.query(name);
        // 清除敏感信息
        stripSensitiveInfo(certificate);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(certificate);
    }

    /**
     * 更新已存在的TLS证书
     * @param certificateName TLS证书名称（从URL路径获取）
     * @param certificate TLS证书对象
     * @return 更新后的TLS证书响应
     */
    @PutMapping("/{name}")
    @Operation(summary = "Update an existed TLS certificate")
    @ApiResponses(value = {@ApiResponse(responseCode = "200", description = "TLS certificate updated successfully"),
        @ApiResponse(responseCode = "400",
            description = "TLS certificate data is not valid or TLS certificate name in the URL doesn't match the one in the body."),
        @ApiResponse(responseCode = "409", description = "TLS certificate already existed with the same name."),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<TlsCertificate>> put(@PathVariable("name") @NotBlank String certificateName,
        @RequestBody TlsCertificate certificate) {
        // 验证URL中的证书名称与请求体中的证书名称是否一致
        if (StringUtils.isNotEmpty(certificate.getName())) {
            certificate.setName(certificateName);
        } else if (!StringUtils.equals(certificateName, certificate.getName())) {
            throw new ValidationException("TlsCertificate name in the URL doesn't match the one in the body.");
        }
        // 调用服务更新TLS证书
        TlsCertificate updatedCertificate = tlsCertificateService.update(certificate);
        // 清除敏感信息
        stripSensitiveInfo(updatedCertificate);
        // 构建响应实体
        return ControllerUtil.buildResponseEntity(updatedCertificate);
    }

    /**
     * 删除TLS证书
     * @param name TLS证书名称
     * @return 删除响应
     */
    @DeleteMapping("/{name}")
    @Operation(summary = "Delete a TLS certificate")
    @ApiResponses(value = {@ApiResponse(responseCode = "204", description = "TLS certificate deleted successfully"),
        @ApiResponse(responseCode = "500", description = "Internal server error")})
    public ResponseEntity<Response<TlsCertificate>> delete(@PathVariable("name") @NotBlank String name) {
        // 调用服务删除TLS证书
        tlsCertificateService.delete(name);
        // 返回无内容响应
        return ResponseEntity.noContent().build();
    }

    /**
     * 清除TLS证书中的敏感信息
     * @param certificate TLS证书对象
     */
    private static void stripSensitiveInfo(TlsCertificate certificate) {
        // 如果证书为空则直接返回
        if (certificate == null) {
            return;
        }
        // 清除证书内容和私钥内容
        certificate.setCert(null);
        certificate.setKey(null);
    }
}
