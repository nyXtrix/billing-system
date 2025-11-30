# API Setup Guide

## Overview
This project now includes Next.js API routes with MySQL database integration.

## Folder Structure
```
src/
├── app/
│   └── api/
│       ├── orders/
│       │   └── route.ts       # Order CRUD operations
│       ├── products/
│       │   └── route.ts       # Product operations
│       └── customers/
│           └── route.ts       # Customer operations
└── lib/
    └── db.ts                  # MySQL configuration
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install mysql2
npm install -D tsx
```

### 2. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=billing_system
DB_PORT=3306
```

### 3. Create Database Tables

**Option A: Automatic Setup (Recommended)**
```bash
npm run db:setup
```

This will automatically create all required tables in your MySQL database.

**Option B: Manual Setup**
Run the following SQL commands in your MySQL database:

```sql
-- Order Head table
CREATE TABLE order_head (
  OrderNo INT AUTO_INCREMENT PRIMARY KEY,
  OrderDate VARCHAR(20),
  CustomerName VARCHAR(255),
  CustomerMobileNo VARCHAR(20),
  PartyOrderNo VARCHAR(100),
  PartyOrderDate VARCHAR(20),
  Measurement VARCHAR(10),
  Remarks TEXT,
  TotalOrderPiece INT,
  TotalOrderWeight DECIMAL(10,3),
  ModuleEntryCode VARCHAR(50),
  CompanyId INT,
  FinancialPeriod VARCHAR(10),
  UserId_UserHead INT
);

-- Order Detail table
CREATE TABLE order_detail (
  AutoIncrement INT AUTO_INCREMENT PRIMARY KEY,
  OrderNo INT,
  Sno INT,
  ProductName VARCHAR(255),
  Width VARCHAR(20),
  Length VARCHAR(20),
  Flop VARCHAR(20),
  Gauge VARCHAR(20),
  NoOfBackColors VARCHAR(50),
  NoOfFrontColors VARCHAR(50),
  Remarks TEXT,
  OrderPiece VARCHAR(20),
  OrderWeight VARCHAR(20),
  RequiredWeight DECIMAL(10,3),
  RateFor VARCHAR(20),
  Rate VARCHAR(20),
  FOREIGN KEY (OrderNo) REFERENCES order_head(OrderNo)
);

-- Products table
CREATE TABLE products (
  ProductId INT AUTO_INCREMENT PRIMARY KEY,
  ProductName VARCHAR(255) UNIQUE,
  Description TEXT
);

-- Customers table
CREATE TABLE customers (
  CustomerId INT AUTO_INCREMENT PRIMARY KEY,
  CustomerName VARCHAR(255),
  MobileNo VARCHAR(20),
  Address TEXT
);
```

## API Endpoints

### Orders API (`/api/orders`)

**GET** - Fetch orders
- Get all orders: `GET /api/orders`
- Get specific order: `GET /api/orders?orderNo=123`

**POST** - Create/Update order
```json
{
  "OrderHead": {
    "OrderNo": "NEW",
    "OrderDate": "11/23/2025",
    "CustomerName": "Customer Name",
    ...
  },
  "OrderDetail": [
    {
      "Sno": 1,
      "ProductName": "Product",
      ...
    }
  ]
}
```

### Products API (`/api/products`)

**GET** - Fetch products
- Get all: `GET /api/products`
- Search: `GET /api/products?search=box`

**POST** - Create product
```json
{
  "ProductName": "New Product",
  "Description": "Description"
}
```

### Customers API (`/api/customers`)

**GET** - Fetch customers
- Get all: `GET /api/customers`
- Search: `GET /api/customers?search=name`

**POST** - Create customer
```json
{
  "CustomerName": "Customer Name",
  "MobileNo": "1234567890",
  "Address": "Address"
}
```

## Usage Example

```typescript
// Fetch an order
const response = await fetch('/api/orders?orderNo=123');
const data = await response.json();

// Save an order
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ OrderHead, OrderDetail })
});
```

## Next Steps
1. Configure your database credentials in `.env.local`
2. Run the SQL schema to create tables
3. Update the frontend to use the new API endpoints
4. Test the endpoints using Postman or the frontend
