# Simple IoT Backend - Auth Service

## Description

A microservice for simple iot backend handling authorization.

## Requirements

1. Node.js (version >= 16)

## Project setup

1. Clone this project and install node.js packages

    ```bash
    $ npm install
    ```

2. Update environment variables in `.env.development.local` (Dev) or `.env` (Prod)

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The application should be serving on port `3000`. (Default)

## Run tests

```bash
# unit tests
$ npm run test
```