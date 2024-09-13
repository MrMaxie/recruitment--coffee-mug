# recruitment--coffee-mug

# API Project

## Technologies Used
- **Node.js**: JavaScript runtime for building the server-side logic.
- **Express.js**: Web framework for routing and handling HTTP requests.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM (Object Data Modeling) for interacting with MongoDB.
- **Zod**: Schema validation library used to validate incoming request data.
- **Vitest**: Test framework for unit and e2e testing.
- **Winston**: Logger for capturing logs.
- **mongodb-memory-server**: In-memory MongoDB server for testing purposes.
- **Docker**: Containerization platform for running the application in isolated environments.

## Project Structure

```
.
├── app/ # Main application folder
│ ├── controllers/ # Controllers handling requests
│ ├── services/ # TODO: Business logic, e.g handling product stock changes
│ ├── models/ # Mongoose models for MongoDB
│ ├── utils/ # Utility functions and helpers
│ ├── spec/ # Test folder
├── Dockerfile # Dockerfile for containerization
├── docker-compose.yml # Docker Compose configuration
└── README.md # Project documentation
```

## How to Run

### Running Locally

1. Install dependencies: `npm i`
2. Run the application:
   1. `npm start` run the application on port `3000`
   2. `npm run dev` run the application on port `3000` with watch mode
   3. `npm run test` run the tests
   4. `npm run test -- --ui` run the tests with ui (webpage)

### Running with Docker

1. Start compose: `docker-compose up -d`

## Environment Variables

- **PORT**: Port on which the application will run. Default: `3000`
- **MONGO_URI**: MongoDB connection URI. Undefined by default. If not provided, the application will use an in-memory database. In production, it should be set to a valid MongoDB URI or application will throw an error.
- **NODE_ENV**: Environment in which the application is running. Default: `development`

## API Endpoints

### GET /products

Get all products.

Response:
```json
[
  {
    "id": "60f3b3b3b3b3b3b3b3b3b3b3",
    "name": "Coffee Mug",
    "description": "A mug for coffee",
    "price": 10,
    "stock": 100
  }
]
```

### POST /products

Create a new product.

Request:
```json
{
  "name": "Coffee Mug",
  "description": "A mug for coffee",
  "price": 10,
  "stock": 100
}

Response:
```json
{
  "id": "60f3b3b3b3b3b3b3b3b3b3",
  "name": "Coffee Mug",
  "description": "A mug for coffee",
  "price": 10,
  "stock": 100
}
```

### POST /products/:productId/restock

Restock a product. Adds 1 to the product's stock.

Response:
```json
{
  "id": "60f3b3b3b3b3b3b3b3b3b3",
  "name": "Coffee Mug",
  "description": "A mug for coffee",
  "price": 10,
  "stock": 200
}
```

### POST /products/:productId/sell

Sell a product. Subtracts 1 from the product's stock.

Response:
```json
{
  "id": "60f3b3b3b3b3b3b3b3b3b3",
  "name": "Coffee Mug",
  "description": "A mug for coffee",
  "price": 10,
  "stock": 99
}
```

### POST /orders

Create a new order. The request should contain an array of product IDs. The endpoint will create an order with the products and return the total price. It will also update the stock of the products. If any product is out of stock, the endpoint will return an error.

Request:
```json
{
  "products": [
    { "productId": "60f3b3b3b3b3b3b3b3b3b3", "quantity": 1 }
    { "productId": "60f3b3b3b3b3b3b3b3b3b4", "quantity": 3 }
  ]
}
```

Response:
```json
{
  "id": "60f3b3b3b3b3b3b3b3b3b3",
  "products": [
    { "productId": "60f3b3b3b3b3b3b3b3b3b3", "quantity": 1 }
    { "productId": "60f3b3b3b3b3b3b3b3b3b4", "quantity": 3 }
  ],
  "totalAmount": 40
}
```

## Todo

- [ ] Move business logic for handling product stock changes etc to `services/` folder. Currently, the controllers are handling everything because there are no complex business logic requirements.
- [ ] Add authentication and authorization middleware. Also that means adding field customerId to the order model. Right now, anyone can create an order and customer information is just fake.
- [ ] More tests. Never enough tests 🤣


