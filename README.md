## DB setup

```bash
# Open your terminal (or command prompt) and access MySQL with the following command
$ mysql -u root -p

# Once inside the MySQL console, create a new database with the following command:
$ CREATE DATABASE your_database_name;

# Switch to the new database context:
$ USE your_database_name;

# You must insert a record with the admin role to be able to access the administrator panel.
$ INSERT INTO users (name, document, email, password, phone, role)
VALUES ('John Doe', '12345678', 'john.doe@example.com', 'securepassword', '123-456-7890', 'admin');
```


## Project setup wallet-api

```bash
$ npm install

# .develop.env
$ copy file .example.env for create .develop.env

PORT=8080
APP_NAME='epayco-wallet'
PREFIX=api/v1

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
MAIL_DEFAULT_FROM=

# development
$ npm run start:dev
```

## Project setup wallet-rest

```bash
$ npm install

# .develop.env
$ copy file .example.env for create .develop.env

PORT=8081

# development
$ npm run start:dev
```

## Project setup wallet-app

```bash
$ npm install

# development
$ npm run dev
```

## Run tests

```bash
# unit tests
$ npm run test
```
