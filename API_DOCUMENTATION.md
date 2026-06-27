# NextCart AI Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. Register User
- **POST** `/auth/register`
- **Description**: Create a new user account
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }
  ```
- **Response**: 201 Created
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": { "id", "firstName", "lastName", "email", "role" }
  }
  ```

### 2. Login User
- **POST** `/auth/login`
- **Description**: Login existing user
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "success": true,
    "message": "Login successful",
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "user": { "id", "firstName", "lastName", "email", "role" }
  }
  ```

### 3. Refresh Token
- **POST** `/auth/refresh-token`
- **Body**:
  ```json
  {
    "refreshToken": "refresh_token"
  }
  ```
- **Response**: 200 OK
  ```json
  {
    "success": true,
    "accessToken": "new_jwt_token"
  }
  ```

### 4. Get Current User
- **GET** `/auth/me`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK
  ```json
  {
    "success": true,
    "user": { user_object }
  }
  ```

---

## Products Endpoints

### 1. Get All Products
- **GET** `/products?page=1&limit=10&category=categoryId&search=keyword&sort=-createdAt`
- **Description**: Get all products with pagination and filtering
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `category` (optional)
  - `search` (optional)
  - `sort` (optional, e.g., `-createdAt`, `price`)
- **Response**: 200 OK

### 2. Get Product by ID
- **GET** `/products/:id`
- **Response**: 200 OK

### 3. Get Featured Products
- **GET** `/products/featured`
- **Response**: 200 OK

### 4. Get Products by Category
- **GET** `/products/category/:categoryId?page=1&limit=10`
- **Response**: 200 OK

### 5. Create Product (Admin Only)
- **POST** `/products`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "discountPrice": 79.99,
    "category": "categoryId",
    "stock": 100,
    "sku": "SKU-12345",
    "image": "image_url",
    "tags": ["tag1", "tag2"]
  }
  ```
- **Response**: 201 Created

### 6. Update Product (Admin Only)
- **PUT** `/products/:id`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**: (same as create, partial)
- **Response**: 200 OK

### 7. Delete Product (Admin Only)
- **DELETE** `/products/:id`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK

---

## Categories Endpoints

### 1. Get All Categories
- **GET** `/categories`
- **Response**: 200 OK

### 2. Get Category by ID
- **GET** `/categories/:id`
- **Response**: 200 OK

### 3. Create Category (Admin Only)
- **POST** `/categories`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "name": "Electronics",
    "description": "Electronics category",
    "image": "image_url"
  }
  ```
- **Response**: 201 Created

### 4. Update Category (Admin Only)
- **PUT** `/categories/:id`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**: (partial)
- **Response**: 200 OK

### 5. Delete Category (Admin Only)
- **DELETE** `/categories/:id`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK

---

## Cart Endpoints (All Require Authentication)

### 1. Get Cart
- **GET** `/cart`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK

### 2. Add to Cart
- **POST** `/cart/add`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "productId": "productId",
    "quantity": 2
  }
  ```
- **Response**: 200 OK

### 3. Update Cart Item
- **PUT** `/cart/update`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "productId": "productId",
    "quantity": 5
  }
  ```
- **Response**: 200 OK

### 4. Remove from Cart
- **DELETE** `/cart/remove/:productId`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK

### 5. Clear Cart
- **DELETE** `/cart/clear`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK

### 6. Apply Coupon
- **POST** `/cart/apply-coupon`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "couponCode": "SAVE20",
    "discount": 50
  }
  ```
- **Response**: 200 OK

---

## Orders Endpoints (All Require Authentication)

### 1. Create Order
- **POST** `/orders`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA",
      "phoneNumber": "123-456-7890"
    },
    "billingAddress": { ... },
    "paymentMethod": "credit_card"
  }
  ```
- **Payment Methods**: `credit_card`, `debit_card`, `upi`, `net_banking`, `wallet`, `cod`
- **Response**: 201 Created

### 2. Get User Orders
- **GET** `/orders?page=1&limit=10`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK

### 3. Get Order by ID
- **GET** `/orders/:id`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK

### 4. Cancel Order
- **PUT** `/orders/:id/cancel`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Response**: 200 OK
- **Note**: Can only cancel pending or confirmed orders

### 5. Get All Orders (Admin Only)
- **GET** `/orders/admin/all?status=pending&page=1&limit=10`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Query**: `status` (optional): `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`, `returned`
- **Response**: 200 OK

### 6. Update Order Status (Admin Only)
- **PUT** `/orders/:id/status`
- **Headers**: `Authorization: Bearer {accessToken}`
- **Body**:
  ```json
  {
    "orderStatus": "shipped",
    "paymentStatus": "completed",
    "trackingNumber": "TRACK123456"
  }
  ```
- **Response**: 200 OK

---

## Health Check

### Health Status
- **GET** `/health`
- **Response**: 200 OK
  ```json
  {
    "status": "OK",
    "timestamp": "2026-06-19T...",
    "uptime": 560,
    "environment": "development",
    "message": "NextCart AI Backend is running"
  }
  ```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details (development only)"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **500**: Server Error

---

## Authentication

Use JWT token in Authorization header:
```
Authorization: Bearer {accessToken}
```

Token expires in 7 days. Use refresh token to get a new access token.

---

## Testing with Postman/Insomnia

1. **Register a user**
   ```
   POST http://localhost:5000/api/auth/register
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   ```

3. **Use the accessToken** in all protected endpoints:
   ```
   Authorization: Bearer {accessToken}
   ```

---

## Next Steps
- Implement frontend components
- Add product reviews and ratings
- Implement payment integration
- Add notifications system
- Implement search and filters UI
