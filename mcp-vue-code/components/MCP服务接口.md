创建MCP服务

```shell
POST /mcpServer/createMcpServer' 
请求体示例
'{
    "gwInstanceId": "i-2697bb97e7ba51238900",  //网关实例ID
    "name": "mcp-server-bbb", //MCP服务名称
    "description": "",        //描述
    "services": [             //后端服务
        {
            "name": "httpbin.dns",
            "port": 80,
            "version": null,
            "weight": 100
        }
    ],
    "domains": [            //域名
        "eliot-test.io"
    ]
}'
```

MCP服务列表

```shell
POST /mcpServer/listMcpServers 
请求体示例
'{
    "gwInstanceId": "i-2697bb97e7ba51238900",
    "mcpServerName": "xxx",  //模糊查询MCP
    "current": 1,
    "size": 10
}'
响应示例
{
    "code": 200,
    "msg": null,
    "message": null,
    "data": {
        "total": 1,
        "current": 1,
        "size": 10,
        "records": [
            {
                "gwInstanceId": "i-2697bb97e7ba51238900",
                "name": "mcp-server-bbb",
                "description": null,
                "domains": [
                    "eliot-test.io"
                ],
                "services": [
                    {
                        "name": "httpbin.dns",
                        "port": 80,
                        "version": null,
                        "weight": 100
                    }
                ],
                "consumerAuthInfo": null,
                "rawConfigurations": "server:\n  name: \"mcp-server-bbb\""  //MCP服务的yaml
            }
        ]
    }
}
```

MCP服务详情

```shell
POST /mcpServer/getMcpServer 
请求体示例
'{
    "gwInstanceId": "i-2697bb97e7ba51238900",
    "mcpServerName": "mcp-server-bbb"
}'
响应示例
{
    "code": 200,
    "msg": null,
    "message": null,
    "data": {
        "gwInstanceId": "i-2697bb97e7ba51238900",
        "name": "mcp-server-bbb",
        "description": null,
        "domains": [
            "eliot-test.io"
        ],
        "services": [
            {
                "name": "httpbin.dns",
                "port": 80,
                "version": null,
                "weight": 100
            }
        ],
        "consumerAuthInfo": null,
        "rawConfigurations": "server:\n  name: \"mcp-server-bbb\""
    }
}
```

编辑MCP服务

```shell
POST /mcpServer/updateMcpServer 
请求体示例
'{
    "gwInstanceId": "i-2697bb97e7ba51238900",
    "name": "mcp-server-bbb",
    "services": [
        {
            "name": "httpbin.dns",
            "port": 80,
            "version": null,
            "weight": 100
        }
    ],
    "domains": [
        "eliot-test.io"
    ],
    "rawConfigurations": "server:\n  allowTools:\n  - \"maps-geo\"\n  config:\n    apiKey: \"your-api-key-here\"\n  name: \"mcp-server-bbb\"\ntools:\n- args:\n  - description: \"The structured address to parse\"\n    name: \"address\"\n    position: \"query\"\n    required: true\n    type: \"string\"\n  - description: \"The city to search in\"\n    name: \"city\"\n    position: \"query\"\n    required: false\n    type: \"string\"\n  - default: \"json\"\n    description: \"Output format\"\n    enum:\n    - \"json\"\n    - \"xml\"\n    name: \"output\"\n    position: \"query\"\n    type: \"string\"\n  description: \"Convert structured address information to latitude and longitude coordinates.\"\n  name: \"maps-geo\"\n  requestTemplate:\n    headers:\n    - key: \"x-api-key\"\n      value: \"{{.config.apiKey}}\"\n    method: \"GET\"\n    url: \"https://restapi.amap.com/v3/geocode/geo\"\n  responseTemplate:\n    body: |-\n      # Geocoding Information\n      {{- range $index, $geo := .geocodes }}\n      ## Location {{add $index 1}}\n      - **Country**: {{ $geo.country }}\n      - **Province**: {{ $geo.province }}\n      - **City**: {{ $geo.city }}\n      - **Coordinates**: {{ $geo.location }}\n      {{- end }}"
}'
```

删除MCP服务

```shell
POST /mcpServer/deleteMcpServer 
请求体示例
'{
    "gwInstanceId": "i-2697bb97e7ba51238900",
    "mcpServerName": "mcp-server-bbb"
}'
```

