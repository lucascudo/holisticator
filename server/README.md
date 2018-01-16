# Holisticator Server
RESTful API with authentication

## Requirements
Node.js, NPM and Neo4j DB Server.

## Setup
create your very own *.env* file (there is an example on root directory) and run-
```
npm install
```

## Run
```
npm start
```

## Test
Import *postman_collection.json* to your local Postman`s instance and _voilà_!

| Verb HTTP |             Route             | Requires Authentication | Params |
|:---------:|:-----------------------------:|:-----------------------:|-------:|
| GET       | /api/subject                  |            No           |
| GET       | /api/subject/:id              |            No           |
| GET       | /api/oauth/google             |            No           |
| GET       | /api/oauth/google/callback    |            No           |
| GET       | /api/oauth/facebook           |            No           |
| GET       | /api/oauth/facebook/callback  |            No           |
| POST      | /api/signup                   |            No           |{ "username": String, "password": String }
| POST      | /api/signin                   |            No           |{ "username": String, "password": String }
| POST      | /api/subject                  |           Yes           |{ "number": Integer, "id": String }
| PUT       | /api/subject/:id              |           Yes           |{ "number": Integer, "id": String }
| DELETE    | /api/subject/:id              |           Yes           |
| POST      | /api/subject/:id/image        |           Yes           |multipart/form-data with an input of type *file* and named as *image*
