package com.alibaba.higress.console.util;

import org.apache.commons.lang3.RandomStringUtils;

public class TestUtil {
    private static final int ENCRYPT_IV_LENGTH = 16;
    private static final int ENCRYPT_KEY_LENGTH = 32;
    public static void main(String[] args) {
        byte[] bytes = RandomStringUtils.randomGraph(ENCRYPT_IV_LENGTH).getBytes();
        byte[] bytes1 = RandomStringUtils.randomGraph(ENCRYPT_KEY_LENGTH).getBytes();
        System.out.println(new String(bytes));
        System.out.println(new String(bytes1));
    }

}
