package com.alibaba.higress.console.controller.dto;

public class CommonPageQuery<T> {
    
    /**
     * Min value = 1
     */
    private int pageNumber;
    
    /**
     * Min value = 1
     */
    private int pageSize;

    private T filter;
    
    public int getLimitNum() {
        return pageSize > 0 ? pageSize : 10;
    }
    
    public int getStartFrom() {
        return (pageNumber > 0 && pageSize > 0) ? (pageNumber -1) * pageSize : 0;
    }
    
    public int getPageNumber() {
        return pageNumber;
    }
    
    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }
    
    public int getPageSize() {
        return pageSize;
    }
    
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
    
    public T getFilter() {
        return filter;
    }
    
    public void setFilter(T filter) {
        this.filter = filter;
    }
}
