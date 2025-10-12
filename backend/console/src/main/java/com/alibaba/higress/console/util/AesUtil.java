package com.alibaba.higress.console.util;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;

/**
 * AES加密工具类，提供AES/CBC/PKCS5Padding模式的加密和解密功能
 * 用于对敏感数据进行加密存储和传输
 */
public class AesUtil {

    /**
     * 加密算法模式：AES/CBC/PKCS5Padding
     */
    private static final String CIPHER_ALGORITHM = "AES/CBC/PKCS5Padding";

    /**
     * 加密算法名称：AES
     */
    private static final String AES = "AES";

    /**
     * 静态初始化块，设置Java加密策略为无限制强度
     * 允许使用更长的密钥长度
     */
    static {
        java.security.Security.setProperty("crypto.policy", "unlimited");
    }

    /**
     * AES加密方法
     * 使用AES/CBC/PKCS5Padding模式对内容进行加密
     *
     * @param key 加密密钥
     * @param iv 初始化向量
     * @param content 待加密的内容
     * @return 加密后经过Base64编码的字符串
     * @throws GeneralSecurityException 加密过程中可能出现的安全异常
     */
    public static String encrypt(String key, String iv, String content) throws GeneralSecurityException {
        // 创建AES密钥对象
        SecretKey secretKey = new javax.crypto.spec.SecretKeySpec(key.getBytes(), AES);
        // 获取加密器实例
        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM);
        // 初始化加密器为加密模式
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new IvParameterSpec(iv.getBytes()));
        // 执行加密操作
        byte[] aesBytes = cipher.doFinal(content.getBytes(StandardCharsets.UTF_8));
        // 对加密结果进行Base64编码并返回
        return Base64.getEncoder().encodeToString(aesBytes);
    }

    /**
     * AES解密方法
     * 使用AES/CBC/PKCS5Padding模式对内容进行解密
     *
     * @param key 解密密钥
     * @param iv 初始化向量
     * @param content 待解密的内容（Base64编码的字符串）
     * @return 解密后的原始字符串
     * @throws GeneralSecurityException 解密过程中可能出现的安全异常
     */
    public static String decrypt(String key, String iv, String content) throws GeneralSecurityException {
        // 创建AES密钥对象
        javax.crypto.SecretKey secretKey = new javax.crypto.spec.SecretKeySpec(key.getBytes(), AES);
        // 获取解密器实例
        javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(CIPHER_ALGORITHM);
        // 初始化解密器为解密模式
        cipher.init(javax.crypto.Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(iv.getBytes()));
        // 对输入内容进行Base64解码
        byte[] byteDecode = cipher.doFinal(Base64.getDecoder().decode(content));
        // 将解密后的字节数组转换为UTF-8字符串并返回
        return new String(byteDecode, StandardCharsets.UTF_8);
    }
}
