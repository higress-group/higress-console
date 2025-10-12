package com.alibaba.higress.console.util;

import java.io.IOException;
import java.io.StringWriter;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.SecureRandom;
import java.util.Date;

import javax.security.auth.x500.X500Principal;

import org.bouncycastle.asn1.ASN1Encodable;
import org.bouncycastle.asn1.DERSequence;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.asn1.x509.ExtendedKeyUsage;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.GeneralName;
import org.bouncycastle.asn1.x509.KeyPurposeId;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.OperatorException;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.util.io.pem.PemObject;
import org.bouncycastle.util.io.pem.PemWriter;

/**
 * 证书工具类，提供RSA密钥对生成、自签名证书生成和PEM格式转换功能
 * 主要用于TLS证书的生成和处理
 */
public class CertificateUtil {

    /**
     * RSA私钥PEM类型标识
     */
    public static final String RSA_PRIVATE_KEY_PEM_TYPE = "RSA PRIVATE KEY";

    /**
     * 证书PEM类型标识
     */
    public static final String CERTIFICATE_PEM_TYPE = "CERTIFICATE";

    /**
     * 生成指定大小的RSA密钥对
     *
     * @param keySize 密钥长度，通常为1024、2048或4096位
     * @return 生成的RSA密钥对
     * @throws Exception 密钥生成过程中可能出现的异常
     */
    public static KeyPair generateRsaKeyPair(int keySize) throws Exception {
        // 获取RSA密钥对生成器实例
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        // 初始化生成器，设置密钥大小和安全随机数生成器
        keyPairGenerator.initialize(keySize, new SecureRandom());
        // 生成并返回密钥对
        return keyPairGenerator.generateKeyPair();
    }

    /**
     * 生成自签名X.509证书
     *
     * @param keyPair 用于签名的密钥对
     * @param host 证书主机名
     * @param durationInMs 证书有效期（毫秒）
     * @return 生成的X.509证书持有者对象
     * @throws OperatorException 操作员异常
     * @throws IOException IO异常
     */
    public static X509CertificateHolder generateSelfSignedCertificate(KeyPair keyPair, String host, long durationInMs)
        throws OperatorException, IOException {
        // 创建证书主体信息，使用主机名作为Common Name
        X500Principal subject = new X500Principal("CN=" + host);

        // 计算证书的有效期
        long notBefore = System.currentTimeMillis();  // 证书开始时间
        long notAfter = notBefore + durationInMs;     // 证书结束时间

        // 创建主题备用名称（Subject Alternative Name）扩展
        ASN1Encodable[] encodableAltNames = new ASN1Encodable[] {new GeneralName(GeneralName.dNSName, host)};
        // 定义扩展密钥用法：服务器认证和客户端认证
        KeyPurposeId[] purposes = new KeyPurposeId[] {KeyPurposeId.id_kp_serverAuth, KeyPurposeId.id_kp_clientAuth};

        // 创建证书构建器
        X509v3CertificateBuilder certBuilder = new JcaX509v3CertificateBuilder(subject, BigInteger.ONE,
            new Date(notBefore), new Date(notAfter), subject, keyPair.getPublic());

        // 添加基本约束扩展（非CA证书）
        certBuilder.addExtension(Extension.basicConstraints, true, new BasicConstraints(false));
        // 添加密钥用法扩展（数字签名和密钥加密）
        certBuilder.addExtension(Extension.keyUsage, true,
            new KeyUsage(KeyUsage.digitalSignature + KeyUsage.keyEncipherment));
        // 添加扩展密钥用法扩展
        certBuilder.addExtension(Extension.extendedKeyUsage, false, new ExtendedKeyUsage(purposes));
        // 添加主题备用名称扩展
        certBuilder.addExtension(Extension.subjectAlternativeName, false, new DERSequence(encodableAltNames));

        // 创建内容签名器，使用SHA256withRSA算法
        final ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA").build(keyPair.getPrivate());
        // 构建并返回证书
        return certBuilder.build(signer);
    }

    /**
     * 将内容转换为PEM格式字符串
     *
     * @param type PEM对象类型（如"CERTIFICATE"或"RSA PRIVATE KEY"）
     * @param content 需要编码的字节内容
     * @return PEM格式的字符串
     * @throws IOException IO异常
     */
    public static String toPem(String type, byte[] content) throws IOException {
        // 创建PEM对象
        PemObject pemObject = new PemObject(type, content);
        // 创建字符串写入器
        StringWriter stringWriter = new StringWriter();
        // 使用PEM写入器写入对象
        try (PemWriter pemWriter = new PemWriter(stringWriter)) {
            pemWriter.writeObject(pemObject);
        }
        // 返回PEM格式字符串
        return stringWriter.toString();
    }
}
