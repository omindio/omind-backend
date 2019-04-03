# Node, Express & MongoDB - Docker (API)

*TODO:*

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Docker dependency. Install it from:

[https://docs.docker.com/install/](https://docs.docker.com/install/)

### Installing

1. Copy *.env.dist* and paste as *.env*
2. Build Docker containers:
```
docker-compose build
```
3. Run containers:
```
docker-compose up -d
```

List all containers:
```
docker ps
```

- App: [http://localhost:5000](http://localhost:5000)
- Mongo Admin: [http://localhost:8081](http://localhost:8081)
- MongoDB: [http://localhost:27017](http://localhost:27017)
- Swagger: [http://localhost:5000/docs](http://localhost:5000/docs)

## Running the tests

*TODO:*

### Packages

- **express:** Express is a fast and lightweight web framework for Node.js. Express is an essential part of the MERN stack.
- **cors**: CORS is a node.js package for providing an Express middleware that can be used to enable CORS with various options. Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
- **mongoose**: A Node.js framework which lets us access MongoDB in an object-oriented way.
- **bcryptjs**: used to hash passwords before we store them in our database
- **body-parser**: used to parse incoming request bodies in a middleware
- **express**: sits on top of Node to make the routing, request handling, and responding easier to write
- **jsonwebtoken**: used for authorization
- **swagger-ui-express**: Adds middleware to your express app to serve the Swagger UI bound to your Swagger document. This acts as living documentation for your API hosted from within your app.
- **swagger-jsdoc**: Generates swagger doc based on JSDoc comments in your code to keep a live and reusable OpenAPI (Swagger) specification.
- **babel**: babel-core babel-node babel-preset
- **morgan**: will log requests to the console so we can see what is happening
- **helmet**: Helmet helps you secure your Express apps by setting various HTTP headers.
- **module-alias**: Create aliases of directories and register custom module paths.
- **joi**: Joi allows you to create blueprints or schemas for JavaScript objects (an object that stores information) to ensure validation of key information.
- **lodash.pickby**: to clean null and undefined values of object.
- **redis**:
- **winsont**: Logger library
- **winston-daily-rotate-file**: Generate a log file every day
- **app-root-path**: app root path (not src)
- **express-correlation-id**: Express middleware to set a correlation id per route in express. The correlation id will be consistent across async calls within the handling of a request.
- **compression**: gzip and more

### Proyect Organization

*TODO:*

## API

*TODO:*

## Production Build

*TODO:*