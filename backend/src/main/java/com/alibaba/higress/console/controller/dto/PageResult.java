package com.alibaba.higress.console.controller.dto;

import java.io.Serializable;
import java.util.List;

public class PageResult<T> implements Serializable {
    
    private Integer pageNumber;
    
    private Integer pageSize;
    
    private Integer totalSize;
    
    private List<T> list;
    
    public Integer getPageNumber() {
        return pageNumber;
    }
    
    public void setPageNumber(Integer pageNumber) {
        this.pageNumber = pageNumber;
    }
    
    public Integer getPageSize() {
        return pageSize;
    }
    
    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
    
    public Integer getTotalSize() {
        return totalSize;
    }
    
    public void setTotalSize(Integer totalSize) {
        this.totalSize = totalSize;
    }
    
    public List<T> getList() {
        return list;
    }
    
    public void setList(List<T> list) {
        this.list = list;
    }
}
