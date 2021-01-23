[![Discord](https://img.shields.io/discord/713035729768546385.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/vD86gKY)
![CI](https://github.com/dh-center/st-retrospect-api/workflows/CI/badge.svg?branch=master)
# St.Retrospect project API

## Development
1. Run `yarn install` for installing dependencies
2. Run `yarn start:dev` to start server in development mode

## Production
1. Run `yarn install` for installing dependencies
2. Run `yarn build` to build TypeScript code
3. Run `node build/index.js` to run server

## Database
We use MongoDB as our primary database.
To init necessary MongoDB indexes and collections you need to run `init-indexes.js` file with the following command:
```
docker-compose -f docker-compose.dev.yml exec mongodb mongo /scripts/init-indexes.js
```
