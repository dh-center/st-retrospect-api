# Queries and mutations for user data
**You need to be authorized!**

## Query examples
### Get username

Query:
```graphql
{
  me{
    username
  }
}
```

Response:
```json
{
  "data": {
    "me": {
      "username": "ilyamore88"
    }
  }
}
```

### Get saved routes

Query:
```graphql
{
  me{
    savedRoutes{
      id,
      name
    }
  }
}
```

Response:
```json
{
  "data": {
    "me": {
      "savedRoutes": [
        {
          "id": "5db32b6977c44a187bef2c8f",
          "name": {
            "ru": "Маршрут на буклет \"Утраченный Петербург\""
          }
        }
      ]
    }
  }
}
```
**Writing locations data is unsupported**

### Get liked routes

Query:
```graphql
{
  me{
    likedRoutes{
      id,
      name
    }
  }
}
```

Response:
```json
{
  "data": {
    "me": {
      "likedRoutes": [
        {
          "id": "5db32b6977c44a187bef2c8f",
          "name": {
            "ru": "Маршрут на буклет \"Утраченный Петербург\""
          }
        }
      ]
    }
  }
}
```
**Writing locations data is unsupported**

## Mutations
### Save route

Mutation:
```graphql
mutation {
  saveRoute(routeId: "5db32b6977c44a187bef2c8f"){
    id
  }
}
```

Response:
```json
{
  "data": {
    "saveRoute": [
      {
        "id": "5db32b6977c44a187bef2c8f"
      }
    ]
  }
}
```
**Writing locations data is unsupported**

### Like route

Mutation:
```graphql
mutation {
  likeRoute(routeId: "5db32b6977c44a187bef2c8f"){
    id
  }
}
```

Response:
```json
{
  "data": {
    "likeRoute": [
      {
        "id": "5db32b6977c44a187bef2c8f"
      }
    ]
  }
}
```
**Writing locations data is unsupported**
