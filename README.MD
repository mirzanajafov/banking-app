# Banking Microservices Project

A microservices-based banking system that handles customer management and transactions.

## Services

### API Gateway (Port 8080)
- Main entry point for all services
- Routes requests to appropriate microservices
- Implements security middleware and rate limiting

### Customer Service (Port 8081)
- Manages customer data
- Handles customer creation and updates
- Maintains customer balances

### Transaction Service (Port 8082)
- Handles financial transactions
- Supports operations:
  - Money transfers between customers
  - Top-up operations
  - Purchases
  - Refunds

## Getting Started

### Prerequisites
- Node.js 20.18.1
- MongoDB
- npm

### Environment Setup

1. Create `.env` files for each service using the provided examples:
```env
# API Gateway (services/api-gateway/.env)
PORT=8080
CUSTOMER_SERVICE_URL=http://localhost:8081
TRANSACTION_SERVICE_URL=http://localhost:8082
```

```env
# Customer Service (services/customer/.env)
PORT=8081
MONGO_URI=<mongodb-uri>
```

```env
# Transaction Service (services/transaction/.env)
PORT=8082
MONGO_URI=<your-mongodb-uri>
API_GATEWAY_SERVICE=http://localhost:8080
```
### Installation

***Install dependencies for all services***
```bash
        # API Gateway
        cd services/api-gateway
        npm install

        # Customer Service
        cd ../customer
        npm install

        # Transaction Service
        cd ../transaction
        npm install
```

### Running Services
***Start each service (in separate terminals):***
```bash
        # API Gateway
        cd services/api-gateway
        npm run dev

        # Customer Service
        cd services/customer
        npm run dev

        # Transaction Service
        cd services/transaction
        npm run dev
```

## API Documentation

### Customer Service Endpoints

#### Create Customer
```http
POST http://localhost:8080/customer
Content-Type: application/json

{
    "name": "Mirza",
    "surname": "Nacafov",
    "birthDate": "1997-08-08",
    "gsmNumber": "+994773221221"
}
```

#### Get Customer
```http
    GET http://localhost:8080/customer/:gsmNumber
```

#### Update Customer Balance
```http
    PATCH http://localhost:8080/customer/:gsmNumber/balance

    {
        "balance": 100
    }
```

### Transaction Service Endpoints

#### Create Transfer
```http
    POST http://localhost:8080/transaction/transfer
    Content-Type: application/json

    {
        "from":"+994773221221",
        "to":"+994773221222",
        "amount": 20
    }
```

#### Top-up Balance
```http
    POST http://localhost:8080/api/transactions/topup
    Content-Type: application/json

    {
        "gsmNumber":"+994773221221",
        "amount": 100
    }
```

#### Purchase
```http
    POST http://localhost:8080/transaction/purchase
    Content-Type: application/json

    {
        "gsmNumber":"+994773221221",
        "amount": 100
    }
```

#### Refund From Last Purchase
```http
    POST http://localhost:8080/transaction/refund
    Content-Type: application/json

    {
        "gsmNumber":"+994773221221",
        "amount": 5 
    }
```

## Development

### Running Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

## Project Structure
```
banking-app/
├── services/
│   ├── api-gateway/
│   │   ├── src/
│   │   └── package.json
│   ├── customer/
│   │   ├── src/
│   │   └── package.json
│   └── transaction/
│       ├── src/
│       └── package.json
└── README.md
```