---
title: MCP Server
keywords: [higress,mcp,ai]
description: MCP Server Plugin Configuration Reference
---

## Feature Description

The `mcp-server` plugin provides AI tool integration capabilities based on the Model Context Protocol (MCP). MCP is a protocol designed specifically for AI assistants, defining a standard way for AI models to interact with external tools and resources. Through this plugin, you can:

1. Convert existing REST APIs into tools callable by AI assistants without writing any code
2. Leverage Higress gateway's unified authentication, authorization, rate limiting, and observability capabilities
3. Quickly build and deploy AI tools and services

![](https://img.alicdn.com/imgextra/i1/O1CN01wv8H4g1mS4MUzC1QC_!!6000000004952-2-tps-1764-597.png)

By hosting MCP Servers with Higress, you can achieve:
- Unified authentication and authorization mechanisms, ensuring the security of AI tool calls
- Fine-grained rate limiting to prevent abuse and resource exhaustion
- Comprehensive audit logs recording all tool call behaviors
- Rich observability for monitoring the performance and health of tool calls
- Simplified deployment and management through Higress's plugin mechanism for quickly adding new MCP Servers

## Runtime Properties

Plugin execution phase: `Default Phase`
Plugin execution priority: `30`

## Configuration Fields

### Server Configuration

| Name         | Data Type   | Required | Default | Description                           |
| ------------ | ---------- | -------- | ------ | ------------------------------ |
| `server.name` | string     | Yes     | -      | Name of the MCP server. If using a pre-integrated MCP server (like quark-search), you only need to configure this field with the corresponding name and don't need to configure the tools field. For REST-to-MCP scenarios, this field can be any arbitrary value. |
| `server.config` | object     | No     | {}     | Server configuration, such as API keys      |
| `server.allowTools` | array of string | No | - | List of tools allowed to be called. If not specified, all tools are allowed |

### REST-to-MCP Tool Configuration

| Name                          | Data Type        | Required | Default | Description                           |
| ----------------------------- | --------------- | -------- | ------ | ------------------------------ |
| `tools`                       | array of object | No     | []     | List of REST-to-MCP tool configurations       |
| `tools[].name`                | string          | Yes     | -      | Tool name                       |
| `tools[].description`         | string          | Yes     | -      | Tool functionality description                   |
| `tools[].args`                | array of object | Yes     | []     | Tool parameter definitions                   |
| `tools[].args[].name`         | string          | Yes     | -      | Parameter name                       |
| `tools[].args[].description`  | string          | Yes     | -      | Parameter description                       |
| `tools[].args[].type`         | string          | No     | string | Parameter type (string, number, integer, boolean, array, object) |
| `tools[].args[].required`     | boolean         | No     | false  | Whether the parameter is required                   |
| `tools[].args[].default`      | any             | No     | -      | Parameter default value                     |
| `tools[].args[].enum`         | array           | No     | -      | List of allowed values for the parameter               |
| `tools[].args[].items`        | object          | No     | -      | Schema for array items (when type is array)  |
| `tools[].args[].properties`   | object          | No     | -      | Schema for object properties (when type is object)|
| `tools[].requestTemplate`     | object          | Yes     | -      | HTTP request template                  |
| `tools[].requestTemplate.url` | string          | Yes     | -      | Request URL template                  |
| `tools[].requestTemplate.method` | string       | Yes     | -      | HTTP method (GET/POST, etc.)          |
| `tools[].requestTemplate.headers` | array of object | No | [] | Request header templates                     |
| `tools[].requestTemplate.headers[].key` | string | Yes   | -      | Request header name                     |
| `tools[].requestTemplate.headers[].value` | string | Yes | -      | Request header value template                   |
| `tools[].requestTemplate.body` | string         | No     | -      | Request body template (mutually exclusive with argsToJsonBody, argsToUrlParam, argsToFormBody) |
| `tools[].requestTemplate.argsToJsonBody` | boolean | No  | false  | When true, arguments will be used directly as the JSON request body (mutually exclusive with body, argsToUrlParam, argsToFormBody) |
| `tools[].requestTemplate.argsToUrlParam` | boolean | No  | false  | When true, arguments will be added to the URL as query parameters (mutually exclusive with body, argsToJsonBody, argsToFormBody) |
| `tools[].requestTemplate.argsToFormBody` | boolean | No  | false  | When true, arguments will be encoded as application/x-www-form-urlencoded in the request body (mutually exclusive with body, argsToJsonBody, argsToUrlParam) |
| `tools[].responseTemplate`    | object          | Yes     | -      | HTTP response transformation template              |
| `tools[].responseTemplate.body` | string        | Yes     | -      | Response body transformation template                 |

## Parameter Type Support

REST-to-MCP tools support various parameter types, allowing you to define tool parameters more precisely:

- **string**: String type (default)
- **number**: Number type (floating point)
- **integer**: Integer type
- **boolean**: Boolean type (true/false)
- **array**: Array type, using the `items` field to define the schema for array elements
- **object**: Object type, using the `properties` field to define the schema for object properties

Example:

```yaml
args:
- name: query
  description: "Search keyword"
  type: string
  required: true
- name: limit
  description: "Number of results to return"
  type: integer
  default: 10
- name: filters
  description: "Filter conditions"
  type: object
  properties:
    category:
      type: string
      enum: ["food", "hotel", "attraction"]
    price:
      type: integer
      minimum: 0
- name: coordinates
  description: "List of coordinate points"
  type: array
  items:
    type: object
    properties:
      lat:
        type: number
      lng:
        type: number
```

## Request Parameter Passing Methods

REST-to-MCP tools support four different request parameter passing methods, which are **mutually exclusive** - only one can be used:

1. **body**: Manually construct the request body using a template. This is the most flexible approach, allowing you complete control over the request body format.
   ```yaml
   requestTemplate:
     body: |
       {
         "query": "{{.args.query}}",
         "filters": {{toJson .args.filters}},
         "options": {
           "limit": {{.args.limit}}
         }
       }
   ```

2. **argsToJsonBody**: When set to `true`, tool parameters will be sent directly as a JSON object in the request body, and the `Content-Type: application/json; charset=utf-8` header will be automatically added.
   ```yaml
   requestTemplate:
     argsToJsonBody: true
   ```

3. **argsToUrlParam**: When set to `true`, tool parameters will be added to the URL as query parameters.
   ```yaml
   requestTemplate:
     argsToUrlParam: true
   ```

4. **argsToFormBody**: When set to `true`, tool parameters will be encoded as `application/x-www-form-urlencoded` in the request body, and the appropriate Content-Type header will be automatically added.
   ```yaml
   requestTemplate:
     argsToFormBody: true
   ```

These options simplify the configuration of common API call patterns without having to manually construct request bodies or URL parameters. Note that these four options are mutually exclusive, and only one can be used in a tool configuration. If multiple options are configured simultaneously, the system will return an error and refuse to load the tool configuration.

## Template Syntax

The REST-to-MCP feature uses the [GJSON Template](https://github.com/higress-group/gjson_template) library for template rendering, which combines Go's template syntax with GJSON's powerful path syntax:

### Request Templates

Used to construct HTTP request URLs, headers, and bodies:
- Access configuration values: `.config.fieldName`
- Access tool parameters: `.args.paramName`

### Response Templates

Used to transform HTTP responses into formats suitable for AI consumption:
- Access JSON response fields using GJSON path syntax
- Use template functions like `add`, `upper`, `lower`, etc.
- Use control structures like `if`, `range`, etc.

GJSON Template includes all [Sprig](https://github.com/Masterminds/sprig) functions, providing 70+ template functions for string manipulation, mathematical operations, date formatting, and more, making it functionally equivalent to Helm's template capabilities.

Commonly used Sprig functions include:

- **String manipulation**: `trim`, `upper`, `lower`, `replace`, `plural`, `nospace`
- **Math operations**: `add`, `sub`, `mul`, `div`, `max`, `min`
- **Date formatting**: `now`, `date`, `dateInZone`, `dateModify`
- **List operations**: `list`, `first`, `last`, `uniq`, `sortAlpha`
- **Dictionary operations**: `dict`, `get`, `set`, `hasKey`, `pluck`
- **Flow control**: `ternary`, `default`, `empty`, `coalesce`
- **Type conversion**: `toString`, `toJson`, `toPrettyJson`, `toRawJson`
- **Encoding/decoding**: `b64enc`, `b64dec`, `urlquery`, `urlqueryescape`
- **UUID generation**: `uuidv4`

For a complete reference of all available functions, see the [Helm function documentation](https://helm.sh/docs/chart_template_guide/function_list/), as GJSON Template includes the same function set.

### GJSON Path Syntax

GJSON provides powerful JSON querying capabilities:

- **Dot notation**: `address.city`
- **Array indexing**: `users.0.name`
- **Array iteration**: `users.#.name`
- **Array filtering**: `users.#(age>=30)#.name`
- **Modifiers**: `users.@reverse.#.name`
- **Multipath**: `{name:users.0.name,count:users.#}`
- **Escape characters**: `path.with\.dot`

For more complex queries, you can use the `gjson` function:

```
<!-- Using the gjson function for complex queries -->
Active users: {{gjson "users.#(active==true)#.name"}}

<!-- Array filtering with multiple conditions -->
Active developers over 30: {{gjson "users.#(active==true && age>30)#.name"}}

<!-- Using modifiers -->
User names (reversed): {{gjson "users.@reverse.#.name"}}

<!-- Iterating over filtered results -->
Admins:
{{range $user := gjson "users.#(roles.#(==admin)>0)#"}}
  - {{$user.name}} ({{$user.age}})
{{end}}
```

For a complete reference of GJSON path syntax, see the [GJSON documentation](https://github.com/tidwall/gjson#path-syntax).

## Configuration Examples

### Using Built-in MCP Server Example: Configuring quark-search

```yaml
server:
  name: "quark-search"
  config:
    apiKey: "xxxx"
```

This configuration uses Higress's built-in quark-search MCP server. In this case, you only need to specify the server name and necessary configuration (such as API key), without configuring the tools field, as the tools are already predefined in the server.

### Basic Example: Converting AMap API

```yaml
server:
  name: rest-amap-server
  config:
    apiKey: your-api-key-here
tools:
- name: maps-geo
  description: "Convert structured address information to latitude and longitude coordinates. Supports parsing landmarks, scenic spots, and building names into coordinates."
  args:
  - name: address
    description: "The structured address to parse"
    type: string
    required: true
  - name: city
    description: "The city to search in"
    type: string
    required: false
  - name: output
    description: "Output format"
    type: string
    enum: ["json", "xml"]
    default: "json"
  requestTemplate:
    url: "https://restapi.amap.com/v3/geocode/geo"
    method: GET
    argsToUrlParam: true
    headers:
    - key: x-api-key
      value: "{{.config.apiKey}}"
  responseTemplate:
    body: |
      # Geocoding Information
      {{- range $index, $geo := .geocodes }}
      ## Location {{add $index 1}}

      - **Country**: {{ $geo.country }}
      - **Province**: {{ $geo.province }}
      - **City**: {{ $geo.city }}
      - **City Code**: {{ $geo.citycode }}
      - **District**: {{ $geo.district }}
      - **Street**: {{ $geo.street }}
      - **Number**: {{ $geo.number }}
      - **Administrative Code**: {{ $geo.adcode }}
      - **Coordinates**: {{ $geo.location }}
      - **Level**: {{ $geo.level }}
      {{- end }}
```

This configuration converts AMap's geocoding API into a tool callable by AI. When the AI calls this tool:

1. It builds an API request using the provided address and city parameters
2. Calls the AMap API
3. Transforms the JSON response into an easy-to-read Markdown format
4. Returns the formatted result to the AI assistant

### Advanced Example: Complex Response Processing with Conditional Logic

```yaml
server:
  name: weather-api-server
  config:
    apiKey: your-weather-api-key
tools:
- name: get-weather
  description: "Get weather forecast information for a specified city"
  args:
  - name: city
    description: "City name"
    type: string
    required: true
  - name: days
    description: "Number of days (1-7)"
    type: integer
    required: false
    default: 3
  - name: include_hourly
    description: "Whether to include hourly forecasts"
    type: boolean
    default: true
  requestTemplate:
    url: "https://api.weatherapi.com/v1/forecast.json"
    method: GET
    argsToUrlParam: true
    headers:
    - key: x-api-key
      value: "{{.config.apiKey}}"
  responseTemplate:
    body: |
      # {{.location.name}}, {{.location.country}} Weather Forecast

      **Current Temperature**: {{.current.temp_c}}°C
      **Feels Like**: {{.current.feelslike_c}}°C
      **Conditions**: {{.current.condition.text}}
      **Humidity**: {{.current.humidity}}%
      **Wind Speed**: {{.current.wind_kph}} km/h

      ## Future Forecast
      {{range $index, $day := .forecast.forecastday}}
      ### {{$day.date}} ({{dateFormat "Monday" $day.date_epoch | title}})
      
      {{if gt $day.day.maxtemp_c 30}}🔥 **High Temperature Alert!**{{end}}
      {{if lt $day.day.mintemp_c 0}}❄️ **Low Temperature Alert!**{{end}}
      
      - **Max Temperature**: {{$day.day.maxtemp_c}}°C
      - **Min Temperature**: {{$day.day.mintemp_c}}°C
      - **Chance of Rain**: {{$day.day.daily_chance_of_rain}}%
      - **Conditions**: {{$day.day.condition.text}}
      
      #### Hourly Forecast
      {{range $hour := slice $day.hour 6 24 3}}
      - **{{dateFormat "15:04" $hour.time_epoch}}**: {{$hour.temp_c}}°C, {{$hour.condition.text}}
      {{end}}
      {{end}}
```

This example demonstrates:
- Using conditional statements (`if`) for temperature alerts
- Using date formatting functions (`dateFormat`)
- Using array slicing (`slice`) to select specific weather times
- Nested loops to iterate through multiple days and time periods of weather data


## AI Prompt for Template Generation

When working with AI assistants to generate templates for REST-to-MCP configuration, you can use the following prompt:

```
Please help me create a REST-to-MCP configuration for Higress that converts a REST API to an MCP tool.

## Configuration Format

The configuration should follow this format:

```yaml
server:
  name: rest-api-server
  config:
    apiKey: your-api-key-here
tools:
- name: tool-name
  description: "Detailed description of what this tool does"
  args:
  - name: arg1
    description: "Description of argument 1"
    type: string  # Optional types: string, number, integer, boolean, array, object
    required: true
  - name: arg2
    description: "Description of argument 2"
    type: integer
    required: false
    default: 10
  - name: arg3
    description: "Description of argument 3"
    type: array
    items:
      type: string
  - name: arg4
    description: "Description of argument 4"
    type: object
    properties:
      subfield1:
        type: string
      subfield2:
        type: number
  requestTemplate:
    url: "https://api.example.com/endpoint"
    method: POST
    # The following four options are mutually exclusive, only one can be used
    argsToUrlParam: true  # Add arguments to URL query parameters
    # OR
    # argsToJsonBody: true  # Send arguments as a JSON object in the request body
    # OR
    # argsToFormBody: true  # Send arguments as form-encoded in the request body
    # OR
    # body: |  # Manually construct the request body
    #   {
    #     "param1": "{{.args.arg1}}",
    #     "param2": {{.args.arg2}},
    #     "complex": {{toJson .args.arg4}}
    #   }
    headers:
    - key: x-api-key
      value: "{{.config.apiKey}}"
  responseTemplate:
    body: |
      # Result
      {{- range $index, $item := .items }}
      ## Item {{add $index 1}}
      - **Name**: {{ $item.name }}
      - **Value**: {{ $item.value }}
      {{- end }}
```

## Template Syntax

The templates use GJSON Template syntax (https://github.com/higress-group/gjson_template), which combines Go templates with GJSON path syntax for JSON processing. The template engine supports:

1. Basic dot notation for accessing fields: {{.fieldName}}
2. The gjson function for complex queries: {{gjson "users.#(active==true)#.name"}}
3. All Sprig template functions (like Helm): {{add}}, {{upper}}, {{lower}}, {{date}}, etc.
4. Control structures: {{if}}, {{range}}, {{with}}, etc.
5. Variable assignment: {{$var := .value}}

For complex JSON responses, consider using GJSON's powerful filtering and querying capabilities to extract and format the most relevant information.

## My API Information

The REST API I want to convert is:

[Describe your API here, including endpoints, parameters, and response format, or paste a Swagger/OpenAPI specification]
```
