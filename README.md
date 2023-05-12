
## Description

MedOn - Distributed system for patients treatment

## Installation
- Install mySQL server locally

- Create file .env (use template .env.defaults)

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
#### New API version deploy to Docker Hub
Go to the branch that was chosen as branch for new version build: <br/>
```git checkout branch-for-build```<br/>

Tag this branch with new server version: <br/>
```git tag sv0.0.5```<br/>

Push branch and tag to the origin: <br/>
```git push origin branch-for-build``` <br/>
```git push --tags```<br/>

#### Deploy latest version of build to AWS
Remove local branch "deploy-server" if it exists <br/>
```git branch -D deploy-server``` <br/>

Create and push special branch "deploy-server" to the server: <br/>
```git checkout -b deploy-server```<br/>
```git push origin deploy-server --force```<br/>
