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

Status: 200 OK
```
OK
```

## Login

Method: GET

Variables are send in params 

Request:
```http request
api.st-retrospect.dh-center.ru/login?username=ilya88&password=qwerty123
```

Response:

Status: 200 OK
```json
{
    "payload": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInr6cCI6IkpXVCJ9"
    }
}
```
