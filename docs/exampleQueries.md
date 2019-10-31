# Query examples
## Select data language

Send necessary languages in header `accept-language`:
```json
{
  "accept-language": "ru"
}
```
## Get person by ID

Query:
```graphql
{
  person(id: "5d83443d0cb433003f223b62") {
    id,
    firstName,
    relations	{
      quote,
      location{
        id,
        name
      }
    }
  }
}
```

Response:
```json
{
  "data": {
    "person": {
      "id": "5d83443d0cb433003f223b62",
      "firstName": {
        "ru": "Петр"
      },
      "relations": [
        {
          "quote": {
            "ru": "Этому дому и суждено было стать первым жильем Петра Чайковского в Петербурге."
          },
          "location": {
            "id": "5d83443e0cb433003f223be6",
            "name": {
              "ru": "Доходный дом купцов Елисеевых"
            }
          }
        },
        {
          "quote": {
            "ru": "Вместе с братом Николаем его отдали в частный пансион Шмеллинга"
          },
          "location": {
            "id": "5d83443e0cb433003f223be7",
            "name": {
              "ru": "Доходный дом Н. Я. и Ф. Я. Колобовых, частный пансион Шмеллинга"
            }
          }
        }
      ]
    }
  }
}
```

## Get all persons

Query:
```graphql
{
  persons {
    lastName,
    firstName
  }
}
```

Response:
```json
{
  "data": {
    "persons": [
      {
        "lastName": {
          "ru": "Аблец"
        },
        "firstName": {
          "ru": "Исаак"
        }
      },
      {
        "lastName": {
          "ru": "Авдошина-Володарская"
        },
        "firstName": {
          "ru": "Нина"
        }
      },
      {
        "lastName": {
          "ru": "Аграновский"
        },
        "firstName": {
          "ru": "Давид"
        }
      }
    ]
  }
}
```

## Get all locations

Query:
```graphql
{
  locations {
    id
    name
    demolitionDate
  }
}
```

Response:
```json
{
  "data": {
    "locations": [
     {
       "id": "5d9b99d2cc7c891a3556624d",
       "name": {
         "ru": "Дом М. И. Кутузова"
       },
       "demolitionDate": ""
     },
     {
       "id": "5d9b9a9bcc7c89b36456624f",
       "name": {
         "ru": "Императорский Санкт-Петербургский университет"
       },
       "demolitionDate": "1917"
     }
    ]
  }
}
```

## Get all routes
Query:
```graphql
{
  routes {
    id
    name
  	description
    photoLink
    locations {
      id
      name
      constructionDate
    }
  }
}
```
Response:

```json
{
  "data": {
    "routes": [
      {
        "id": "5da784a82d5f674b9b9834d4",
        "name": {
          "en": null,
          "ru": "Вот мой тест"
        },
        "description": {
          "en": null,
          "ru": "Вот мой тест, Никита"
        },
        "photoLink": null,
        "locations": [
          {
            "id": "5d83443e0cb433003f223be6",
            "name": {
              "en": null,
              "ru": "Доходный дом купцов Елисеевых"
            },
            "constructionDate": "1842"
          },
          {
            "id": "5d83443e0cb433003f223c09",
            "name": {
              "en": null,
              "ru": "Тихвинское кладбище (Некрополь мастеров искусств)"
            },
            "constructionDate": "1823"
          }
        ]
      }
    ]
  }
}
```

# Get specific route
Query:
```graphql
{
  route(id:"5da784a82d5f674b9b9834d4"){
    id
    name
  	description
    photoLink
    locations {
      id
      name
      constructionDate
    }
  }
}
```
Response:

```json
{
  "data": {
    "route": {
      "id": "5da784a82d5f674b9b9834d4",
      "name": {
        "en": null,
        "ru": "Вот мой тест"
      },
      "description": {
        "en": null,
        "ru": "Вот мой тест, Никита"
      },
      "photoLink": null,
      "locations": [
        {
          "id": "5d83443e0cb433003f223be6",
          "name": {
            "en": null,
            "ru": "Доходный дом купцов Елисеевых"
          },
          "constructionDate": "1842"
        },
        {
          "id": "5d83443e0cb433003f223c09",
          "name": {
            "en": null,
            "ru": "Тихвинское кладбище (Некрополь мастеров искусств)"
          },
          "constructionDate": "1823"
        }
      ]
    }
  }
}
```

# Get nearest routes
Query:
```graphql
{
  nearestRoutes(
    center: { latitude: 59.972401, longitude: 30.302212 }
    radius: 4000
  ) {
    id
    name
  }
}
```

Response: 
```json
{
  "data": {
    "nearestRoutes": [
      {
        "id": "5da752522d5f6789e09834d2",
        "name": {
          "en": null,
          "ru": "Очень интересный маршрут"
        }
      },
      {
        "id": "5da784a82d5f674b9b9834d4",
        "name": {
          "en": null,
          "ru": "Второй интересный маршрут"
        }
      }
    ]
  }
}
```
