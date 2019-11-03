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

## Get all routes with filter
Query:
```graphql
{
  routes(filter: { contains: "The route to the" }) {
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
        "id": "5db32b6977c44a187bef2c8f",
        "name": {
          "en": "The route to the booklet \"Lost Petersburg",
          "ru": "Маршрут на буклет \"Утраченный Петербург"
        },
        "description": {
          "en": null,
          "ru": "Этот маршрут познакомит Вас с утраченными храмами Петербурга \nПротяженность: 5, 3 км\nДлительность 1 час 20 минут"
        },
        "photoLink": "",
        "locations": [
          {
            "id": "5d83443f0cb433003f223c2b",
            "name": {
              "en": null,
              "ru": "Государственный музей истории религии"
            },
            "constructionDate": "1932"
          },
          {
            "id": "5d83443f0cb433003f223c37",
            "name": {
              "en": null,
              "ru": "Церковь Благовещения Пресвятой Богородицы лейб-гвардии конного полка"
            },
            "constructionDate": "1929"
          },
          {
            "id": "5d8b92611e1e56514a13f463",
            "name": {
              "en": null,
              "ru": "Немецкая реформатская церковь"
            },
            "constructionDate": "1862-1865"
          },
          {
            "id": "5d8fc7f6cc7c891c70565173",
            "name": {
              "en": " Church of the Protection of the Holy Virgin",
              "ru": "Церковь Покрова Пресвятой Богородицы"
            },
            "constructionDate": "1798 – 1803"
          },
          {
            "id": "5d8fe55ecc7c89c5815651ec",
            "name": {
              "en": "Church of the Savior on Sennaya Square",
              "ru": "Церковь во имя Успения Пресвятой Богородицы, Церковь Спаса на Сенной"
            },
            "constructionDate": "1765"
          },
          {
            "id": "5d98c520cc7c8919e1565b61",
            "name": {
              "en": null,
              "ru": "Церковь Воскресения Христова и Михаила Архангела в Малой Коломне"
            },
            "constructionDate": "1847-1859"
          }
        ]
      }
    ]
  }
}
```
