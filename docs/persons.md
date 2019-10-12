# Person queries
## person(id: string, languages: [enum])
Get person's info by ID:

Query:
```
{
  person(id: "5d83443c0cb433003f223ae7", languages: [RU, EN]){
    firstName
    id
  }
}
```
Answer:
```
{
  "data": {
    "person": {
      "firstName": {
        "ru": "Давид"
      },
      "id": "5d83443c0cb433003f223ae7"
    }
  }
}
```
## persons(languages: [enum])
Get all persons

Query:
```
{
  persons(languages: [RU]){
    lastName,
    firstName
  }
}
```
Answer:
```
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
