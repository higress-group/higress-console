package com.alibaba.higress.console.controller;

import com.alibaba.higress.console.controller.dto.CommonPageQuery;
import com.alibaba.higress.console.controller.dto.Domain;
import com.alibaba.higress.console.controller.dto.PageResult;
import com.alibaba.higress.console.controller.dto.Result;
import com.alibaba.higress.console.controller.dto.Route;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController("DomainController")
@RequestMapping("/v1/domain")
public class DomainController {
    
    //FIXME mock datasource
    private ConcurrentHashMap<String, Domain> mockData = new ConcurrentHashMap<>();

    @PostConstruct
    public void initialize() {
        mockData.put("www.test.com", Domain.builder().id(1L).name("www.test.com").build());
    }
    
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public Result<PageResult<Domain>> list(@RequestBody CommonPageQuery<Domain> query) {
        //TODO
        int count = mockData.size();
        List<Domain> list = new ArrayList<>(mockData.values());
        
        return Result.successPageReturn(list, query.getPageNumber(), query.getPageSize(), count);
    }
    
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public Result<Domain> add(@RequestBody Domain domain) {
        mockData.put(domain.getName(), domain);
        //TODO
        return Result.successReturn(domain);
    }
    
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public Result<Domain> update(@RequestBody Domain domain) {
        mockData.put(domain.getName(), domain);
        //TODO
        return Result.successReturn(domain);
    }
    
    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    public Result<Domain> delete(@RequestParam("name") String name) {
        //TODO
        Domain delete = mockData.get(name);
        if(delete != null) {
            mockData.remove(name);
        }
        //TODO
        return Result.successReturn(delete);
    }
}

