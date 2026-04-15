# Amazon Clone API Documentation

**Base URL:** `http://localhost:3000/api/v1`

---

## Authentication & User Context

Authentication middleware has been removed for development simplicity. Instead of passing tokens in headers, **all user-specific routes require a `user_id`**.

- For `GET` and `DELETE` requests: Pass `user_id` as a **query parameter**.
  - Example: `GET /api/v1/cart?user_id=1`
- For `POST`, `PUT`, and `PATCH` requests: Pass `user_id` inside the **JSON body**.
  - Example: `POST /api/v1/cart` with body `{ "user_id": 1, ... }`

*(Note: The seed script creates 3 users with IDs `1`, `2`, and `3`. Use these for testing).*

---

## 1. Categories

### 1.1 Get All Categories
Retrieve a list of all active categories.

- **Method:** `GET`
- **Endpoint:** `/categories`
- **Response Structure (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Gadgets, devices and tech accessories",
      "image_url": null
    }
  ]
}
```

---

## 2. Products

### 2.1 Get Products (with Search, Filter, Pagination)
Retrieve products. Supports searching by name, filtering by category, and pagination.

- **Method:** `GET`
- **Endpoint:** `/products`
- **Query Parameters:**
  - `search` (Optional): String to search product names/descriptions.
  - `category` (Optional): The slug of the category (e.g., `electronics`).
  - `page` (Optional): Page number (default: `1`).
  - `limit` (Optional): Items per page (default: `10`, max: `50`).
- **Response Structure (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Wireless Noise-Cancelling Headphones",
      "price": "12999.00",
      "effective_price": "11049.15",
      "discount_pct": "15.00",
      "avg_rating": "4.50",
      "review_count": 320,
      "images": ["url1", "url2", "url3"],
      "stock": 80,
      "category_name": "Electronics"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 18,
    "total_pages": 2
  }
}
```

### 2.2 Get Single Product
Retrieve full details of a single product.

- **Method:** `GET`
- **Endpoint:** `/products/:productId`
- **Response Structure (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Wireless Noise-Cancelling Headphones",
    "description": "Premium over-ear headphones...",
    "price": "12999.00",
    "effective_price": "11049.15",
    "discount_pct": "15.00",
    "avg_rating": "4.50",
    "review_count": 320,
    "images": ["url1", "url2", "url3"],
    "stock": 80,
    "category_name": "Electronics"
  }
}
```

---

## 3. Shopping Cart

### 3.1 Get Cart
Retrieve all items in the user's cart along with the calculated subtotal.

- **Method:** `GET`
- **Endpoint:** `/cart`
- **Query Parameter:** `user_id` (Required)
- **Response Structure (200 OK):**
```json
{
  "items": [
    {
      "id": 5,
      "product_id": 1,
      "name": "Wireless Noise-Cancelling Headphones",
      "images": ["url1", "url2", "url3"],
      "effective_price": "11049.15",
      "quantity": 2,
      "line_total": "22098.30"
    }
  ],
  "subtotal": "22098.30"
}
```

### 3.2 Add Item to Cart
Add a new product or increase quantity of an existing one.

- **Method:** `POST`
- **Endpoint:** `/cart`
- **Request Body:**
```json
{
  "user_id": 1,
  "productId": 1,
  "quantity": 2
}
```
- **Response Structure (200/201 Status):**
```json
{
  "message": "Cart updated",
  "data": {
    "id": 5,
    "user_id": 1,
    "product_id": 1,
    "quantity": 2
  }
}
```

### 3.3 Update Cart Item Quantity
Explicitly set the quantity of a specific cart item row.

- **Method:** `PUT`
- **Endpoint:** `/cart/:itemId`  *(Note: itemId is the cart_items.id, NOT product id)*
- **Request Body:**
```json
{
  "user_id": 1,
  "quantity": 4
}
```
- **Response:** `200 OK` `{ "message": "Cart updated", "data": {...} }`

### 3.4 Remove Item from Cart
Remove an entire product line from the cart.

- **Method:** `DELETE`
- **Endpoint:** `/cart/:itemId`  *(Note: itemId is the cart_items.id)*
- **Query Parameter:** `user_id` (Required)
- **Response:** `200 OK` `{ "message": "Item removed" }`

### 3.5 Clear Entire Cart
Empty the user's cart entirely.

- **Method:** `DELETE`
- **Endpoint:** `/cart`
- **Query Parameter:** `user_id` (Required)
- **Response:** `200 OK` `{ "message": "Cart cleared" }`

---

## 4. Addresses

### 4.1 Get User Addresses
List all saved addresses for a user. The default address is always returned first.

- **Method:** `GET`
- **Endpoint:** `/addresses`
- **Query Parameter:** `user_id` (Required)
- **Response Structure (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "full_name": "Arjun Mehta",
      "street": "42, MG Road",
      "city": "Bengaluru",
      "state": "Karnataka",
      "pincode": "560038",
      "country": "India",
      "is_default": true
    }
  ]
}
```

### 4.2 Add New Address

- **Method:** `POST`
- **Endpoint:** `/addresses`
- **Request Body:**
```json
{
  "user_id": 1,
  "full_name": "Jane Doe",
  "street": "123 New St",
  "city": "Mumbai",
  "state": "MH",
  "pincode": "400001",
  "country": "India",
  "is_default": true
}
```
- **Response:** `201 Created` returns the created address object in `data`.

### 4.3 Delete Address

- **Method:** `DELETE`
- **Endpoint:** `/addresses/:addressId`
- **Query Parameter:** `user_id` (Required)
- **Response:** `200 OK` `{ "message": "Address deleted" }`

---

## 5. Orders

### 5.1 Place Order from Cart
Converts the user's entire cart into an Order, clears the cart, and deducts product stock. Operates within an ACID transaction.

- **Method:** `POST`
- **Endpoint:** `/orders`
- **Request Body:**
```json
{
  "user_id": 1,
  "addressId": 1
}
```
- **Response Structure (201 Created):**
```json
{
  "message": "Order placed successfully",
  "orderId": 42
}
```
*(Throws 400 if cart is empty or requested quantity exceeds available stock).*

### 5.2 Buy Now (Direct order bypasses cart)
Immediately purchases a single product without affecting the user's shopping cart.

- **Method:** `POST`
- **Endpoint:** `/orders/buy-now`
- **Request Body:**
```json
{
  "user_id": 1,
  "productId": 1,
  "quantity": 1,
  "addressId": 1
}
```
- **Response:** `201 Created` `{ "message": "Order placed successfully", "orderId": 43 }`

### 5.3 Get Order History
Get summary view of past orders.

- **Method:** `GET`
- **Endpoint:** `/orders`
- **Query Parameter:** `user_id` (Required)
- **Response Structure (200 OK):**
```json
{
  "orders": [
    {
      "id": 42,
      "subtotal": "11049.15",
      "tax_amount": "1988.85",
      "total_amount": "13038.00",
      "order_status": "PLACED",
      "placed_at": "2024-04-14T10:00:00.000Z",
      "shipping_address_id": 1
    }
  ]
}
```

### 5.4 Get Order Details
Retrieve deep details of a specific order, including line items and shipping details.

- **Method:** `GET`
- **Endpoint:** `/orders/:orderId`
- **Query Parameter:** `user_id` (Required)
- **Response Structure (200 OK):**
```json
{
  "order": {
    "id": 42,
    "subtotal": "11049.15",
    "tax": "1988.85",
    "total": "13038.00",
    "status": "PLACED",
    "placed_at": "...",
    "address_id": 1
  },
  "items": [
    {
      "product_id": 1,
      "name": "Wireless Noise-Cancelling Headphones",
      "quantity": 1,
      "unit_price": "11049.15",
      "line_total": "11049.15"
    }
  ]
}
```

### 5.5 Cancel Order
Cancels an order if it is still in `PLACED` or `CONFIRMED` state. Restores the stock of the cancelled items back to the products table.

- **Method:** `PATCH`
- **Endpoint:** `/orders/:orderId/cancel`
- **Request Body:**
```json
{
  "user_id": 1
}
```
- **Response:** `200 OK` `{ "message": "Order successfully cancelled and stock restored." }`

---

## 6. Standard Error Responses

If a validation, logic, or constraint error occurs, the server responds with a consistent JSON structure and appropriate HTTP status (400, 404, 500 etc).

**Example Validation Error (400 Bad Request):**
```json
{
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "msg": "user_id is required",
        "param": "user_id",
        "location": "body"
      }
    ]
  }
}
```

**Example App Error (400 / 404):**
```json
{
  "error": {
    "message": "Insufficient stock for Wireless Noise-Cancelling Headphones (10 available)"
  }
}
```

**Common HTTP Status Codes:**
- `200 OK`: Request succeeded.
- `201 Created`: Resource (Cart Item, Address, Order) created successfully.
- `400 Bad Request`: Validation failure, insufficient stock, empty cart etc.
- `404 Not Found`: Resource (Product, Address, Order, Cart Item) does not exist.
- `500 Internal Server Error`: Server/Database issue.
