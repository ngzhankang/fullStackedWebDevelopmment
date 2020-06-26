# API Documentation

This document allows you to define your API schema.

Each API should include

1. HTTP Method
2. Endpoint
3. Request body/Parameters
4. Response body
5. Error Body
6. Sample Request
7. Sample Response
8. Sample Error

> Errors and it's corresponding code can be defined by yourself. You need not follow HTTP errors.

-------------------------------------------------------------------------------------

## Post Data (Insert API) - Basic

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | POST          |
| Endpoint    | /basic/insert |

### Parameters

_Not Required_

### Request Body

```json
{
  "data": [
    {
      "festivalId": IDENTIFIER,
      "performanceId": IDENTIFIER,
      "startTime": TIME,
      "endTime": TIME,
    }
  ]
}
```

### Response Body

```json
{
  "result": "success"
}
```

### Error Response

```json
{
  "error": string,
  "code": number
}
```

### Sample Request

```json
{
  "data": [
    {
      "festivalId": 1234567890,
      "performanceId": 1234567890,
      "startTime": 1000,
      "endTime": 1030
    },
    {
      "festivalID": 1234567891,
      "performanceId": 1234567891,
      "startTime": 1030,
      "endTime": 1100
    },
  ]
}
```

### Sample Error

```json
{
  "error": "Duplicate Entry",
  "code": 400
}
```
-------------------------------------------------------------------------------------
## Get Data (Result API) - Basic

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | GET           |
| Endpoint    | /basic/result |

### Parameters

| parameter  | datatype        | example    |
| ---------- | --------------- | ---------- |
| festivalId | 10 digit number | 1234567890 |

### Response Body

```json
{
  "result": [
    [
      {
        "performanceId": IDENTIFIER,
        "startTime": TIME,
        "endTime": TIME
      }
    ]
  ]
}
```

### Error

```json
{
  "error": string,
  "code": number
}
```

### Sample Request

```http
GET /basic/result?festivalId=1234567890
```

### Sample Response

```json
{
  "result": [
    [
      {
        "performanceId": 1234567890,
        "startTime": 1000,
        "endTime": 1030
      },
      {
        "performanceId": 1234567891,
        "startTime": 1030,
        "endTime": 1100,
        "
      }
    ]
  ]
}
```

### Sample Error

```json
{
  "error": "Server Error",
  "code": 500
}
```

-------------------------------------------------------------------------------------

## Post Data (Insert API) - Advance

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | POST          |
| Endpoint    | /advance/insert |

### Parameters

_Not Required_

### Request Body

```json
{
  "data": [
    {
      "festivalId": IDENTIFIER,
      "performanceId": IDENTIFIER,
      "startTime": TIME,
      "endTime": TIME,
      "popularity": Number,                
    }
  ]
}
```

### Response Body

```json
{
  "result": "success"
}
```

### Error Response

```json
{
  "error": string,
  "code": number
}
```

### Sample Request

```json
{
  "data": [
    {
      "festivalId": 1234567890,
      "performanceId": 1234567890,
      "startTime": 1000,
      "endTime": 1030,
      "popularity": 10000
    },
    {
      "festivalID": 1234567891,
      "performanceId": 1234567891,
      "startTime": 1030,
      "endTime": 1100,
      "popularity": 1000
    },
  ]
}
```

### Sample Error

```json
{
  "error": "Duplicate Entry",
  "code": 400
}
```
-------------------------------------------------------------------------------------
## Get Data (Result API) - Advance

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | GET           |
| Endpoint    | /advanced/result |

### Parameters

| parameter  | datatype        | example    |
| ---------- | --------------- | ---------- |
| festivalId | 10 digit number | 1234567890 |

### Response Body

```json
{
  "result": [
    [
      {
        "performanceId": IDENTIFIER,
        "startTime": TIME,
        "endTime": TIME,
        "popularity": Number
      }
    ]
  ]
}
```

### Error

```json
{
  "error": string,
  "code": number
}
```

### Sample Request

```http
GET /advance/result?festivalId=1234567890
```

### Sample Response

```json
{
  "result": [
    [
      {
        "performanceId": 1234567890,
        "startTime": 1000,
        "endTime": 1030,
        "popularity": 10000
      },
      {
        "performanceId": 1234567891,
        "startTime": 1030,
        "endTime": 1100,
        "popularity": 1000
      }
    ]
  ]
}
```

### Sample Error

```json
{
  "error": "Server Error",
  "code": 500
}
```
