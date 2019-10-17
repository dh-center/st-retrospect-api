# Auth endpoints

## Sign Up

Method: POST

Request body: 
```json
{
  "username": "username",
  "password": "password"
}
```

Request:
```http request
https://api.st-retrospect.dh-center.ru/sign-up
```

Response:

Status: 201 Created
```
Created
```

## Login

Method: GET

Variables are send in params 

Request:
```http request
https://api.st-retrospect.dh-center.ru/login?username=ilya88&password=qwerty123
```

Response:

Status: 200 OK
```json
{
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInr6cCI6IkpXVCJ9"
    }
}
```

## How to provide access token to request

Add token to request header `Authorization: Bearer <access_token>`
