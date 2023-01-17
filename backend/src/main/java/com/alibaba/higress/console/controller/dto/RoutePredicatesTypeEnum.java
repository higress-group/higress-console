package com.alibaba.higress.console.controller.dto;

public enum RoutePredicatesTypeEnum {

    EQUAL("exact", 0),
    PRE("prefix", 1),
    ERGULAR("regex", 2);

    private String desc;

    private Integer code;

    RoutePredicatesTypeEnum(String desc, Integer code) {
        this.desc = desc;
        this.code = code;
    }
    
    public Integer code() {
        return this.code;
    }

    public String desc() {
        return this.desc;
    }

}
