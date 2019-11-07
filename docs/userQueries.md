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
**Query for location data is unsupported yet**

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
**Query for location data is unsupported yet**

## Mutations
### Save route

Mutation:
```graphql
mutation {
  saveRoute(routeId: "5db32b6977c44a187bef2c8f"){
    id,
    username,
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
    "saveRoute": {
      "id": "5d8359f79d284050dab39d85",
      "username": "ilyamore88",
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
**Query for location data is unsupported yet**

### Unsave route

Mutation:
```graphql
mutation {
  unsaveRoute(routeId: "5db32b6977c44a187bef2c8f"){
    username,
    id,
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
    "unsaveRoute": {
      "username": "ilyamore88",
      "id": "5d8359f79d284050dab39d85",
      "savedRoutes": []
    }
  }
}
```
**Query for location data is unsupported yet**

### Like route

Mutation:
```graphql
mutation {
  likeRoute(routeId: "5db32b6977c44a187bef2c8f"){
    id,
    username,
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
    "likeRoute": {
      "id": "5d8359f79d284050dab39d85",
      "username": "ilyamore88",
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
**Query for location data is unsupported yet**

### Dislike route

Mutation:
```graphql
mutation {
  dislikeRoute(routeId: "5db32b6977c44a187bef2c8f"){
    username,
    id,
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
    "dislikeRoute": {
      "username": "ilyamore88",
      "id": "5d8359f79d284050dab39d85",
      "likedRoutes": []
    }
  }
}
```
**Query for location data is unsupported yet**
