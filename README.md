
## Description

MedOn - Medical system for doctors that manage their schedule and book appointments to treat patients

## Setup project
- Install mySQL server

- Create file .env (use template .env.example)

- Run command

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Deploy

```bash
# Build the Docker Image:
$ docker build -t app-name-backend

# Run the Docker Container:
$ docker run -d -p 3333:3333 --env-file .env app-name-backend

# Verify the Deployment:
$ docker logs <container_id>
```