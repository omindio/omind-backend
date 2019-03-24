# Node, Express & MongoDB - Docker

*TODO*

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

- App: [http://0.0.0.0:5000](http://0.0.0.0:5000)
- Mongo Admin: [http://0.0.0.0:8081](http://0.0.0.0:8081)
- MongoDB: [http://0.0.0.0:27017](http://0.0.0.0:27017)

## Running the tests

*TODO*

### Packages

- **express:** Express is a fast and lightweight web framework for Node.js. Express is an essential part of the MERN stack.
- **cors**: CORS is a node.js package for providing an Express middleware that can be used to enable CORS with various options. Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.
- **mongoose**: A Node.js framework which lets us access MongoDB in an object-oriented way.
- **bcryptjs**: used to hash passwords before we store them in our database
- **body-parser**: used to parse incoming request bodies in a middleware
- **express**: sits on top of Node to make the routing, request handling, and responding easier to write
- **is-empty:** global function that will come in handy when we use validator
- **jsonwebtoken**: used for authorization
- **validator**: used to validate inputs (e.g. check for valid email format, confirming passwords match)
- **swagger**: swagger-ui-express
- **babel**: babel-core babel-node babel-preset
- **morgan**: will log requests to the console so we can see what is happening
- **helmet**: Helmet helps you secure your Express apps by setting various HTTP headers.

### Proyect Organization

*TODO*

## API

*TODO*

## Production Build

*TODO*