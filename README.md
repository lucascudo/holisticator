# Holisticator Server
RESTful API with authentication

## Requirements
Node.js, NPM and Neo4j DB Server.

## Setup
create your very own *.env* file (there is an example on root directory) and run:
```
npm install
```

## Run
```
npm start
```

## Test
Import *postman_collection.json* to your local Postman`s instance and _voilà_!

## Routes

| Verb HTTP |                Route                        | Required Authentication | Params |
|:---------:|:-------------------------------------------:|:-----------------------:|-------:|
| GET       | /api/subject                |            No           |
| GET       | /api/subject/:number        |            No           |
| GET       | /api/oauth/google           |            No           |
| POST      | /api/signup                 |            No           |{ "username": String, "password": String }
| POST      | /api/signin                 |            No           |{ "username": String, "password": String }
| POST      | /api/subject                |           Yes           |{ "number": Integer, "name": String }
| PUT       | /api/subject/:number        |           Yes           |{ "number": Integer, "name": String }
| DELETE    | /api/subject/:number        |           Yes           |
| POST      | /api/subject/:number/image  |           Yes           |multipart/form-data with an input of type *file* and named as *image*
