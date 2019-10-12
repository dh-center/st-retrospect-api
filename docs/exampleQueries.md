# Query examples
## Get person by ID

Query:
```graphql
{
  persons(languages: [RU, EN]) {
    id
    firstName
    lastName
    birthDate
  }
}
```

Response:
```json
{
  "data": {
    "persons": [
      {
        "id": "5d83444a2dcafc004ef8fd12",
        "firstName": {
          "ru": "Иван",
          "en": null
        },
        "lastName": {
          "ru": "Кутайсов",
          "en": null
        },
        "birthDate": "1759 год"
      },
      {
        "id": "5d8a8d651e1e568faf13f334",
        "firstName": {
          "ru": "Павел",
          "en": "Pavel"
        },
        "lastName": {
          "ru": "Филонов",
          "en": "Filonov"
        },
        "birthDate": "8.01.1883"
      }
    ]
  }
}
```

## Get all persons

Query:
```graphql
{
  persons(languages: [RU]){
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
  locations(languages: RU) {
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
