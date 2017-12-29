# node-rest-authentication
A simple RESTful API with authentication

## Setup
Run:

```
npm install
```
and create your very own *.env* file (there is an example on root directory).

## Run
```
npm start
```

## Test
Import *postman_collection.json* to Postman and _voilà_!

## Routes

| Verb HTTP |                Route                        | Required Authentication | Params |
|:---------:|:-------------------------------------------:|:-------:|-------:|
| GET       | /api/subject                |            No           |
| GET       | /api/subject/:id            |            No           |
| GET       | /api/oauth/google           |            No           |
| POST      | /api/signup                 |            No           |{ "username": String, "password": String }
| POST      | /api/signin                 |            No           |{ "username": String, "password": String }
| POST      | /api/subject                |           Yes           |{ "id": Integer, "name": String }
| PUT       | /api/subject/:id            |           Yes           |{ "id": Integer, "name": String }
| DELETE    | /api/subject/:id            |           Yes           |
| POST      | /api/subject/:id/image      |           Yes           |multipart/form-data with an input of type *file* and named as *image*
