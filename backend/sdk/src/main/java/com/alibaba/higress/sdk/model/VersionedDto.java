package com.alibaba.higress.sdk.model;

/**
 * DTO 接口，用于标记在更新时支持通过版本号实现乐观锁的 DTO。
 * 乐观锁是一种并发控制机制，通过版本号来确保数据的一致性。
 */
public interface VersionedDto {

    /**
     * 获取当前 DTO 的版本号。
     * 版本号用于实现乐观锁机制。
     *
     * @return 当前 DTO 的版本号。
     */
    String getVersion();

    /**
     * 设置当前 DTO 的版本号。
     * 版本号用于实现乐观锁机制。
     *
     * @param version 要设置的版本号。
     */
    void setVersion(String version);
}
