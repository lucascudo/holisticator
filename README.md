# node-rest-authentication
A simple PokeStore RESTful API with authentication

## Setup
```
npm install
```

## Run
```
npm start
```

## Test
Import *postman_collection.json* to Postman and _voilà_!

## Routes

| Verb HTTP |                Route                    | Required Authentication | Params |
|:---------:|:---------------------------------------:|:-----------------------:|-------:|
| POST      | http://localhost/api/signup             |            No           |{ "username": String, "password": String }
| POST      | http://localhost/api/signin             |            No           |{ "username": String, "password": String }
| GET       | http://localhost/pokemon                |            No           |
| GET       | http://localhost/pokemon/:number        |            No           |
| POST      | http://localhost/pokemon                |           Yes           |{ "number": Integer, "name": String }
| PUT       | http://localhost/pokemon/:number        |           Yes           |{ "number": Integer, "name": String }
| DELETE    | http://localhost/pokemon/:number        |           Yes           |
| POST      | http://localhost/pokemon/:number/image  |           Yes           |multipart/form-data with an input of type *file* and named as *image*
