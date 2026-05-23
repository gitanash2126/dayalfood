# Grocery Shop Backend API Documentation

## Base URL

```txt
http://localhost:5000
```

## Authentication Header Format

Protected APIs me token bhejna hoga:

```txt
Authorization: Bearer YOUR_TOKEN_HERE
```

Admin APIs me admin user ka token bhejna hoga.

---

# 1. Auth APIs

## 1.1 Register User

```http
POST /api/auth/register
```

### Body

```json
{
  "name": "Admin User",
  "email": "admin@gmail.com",
  "password": "123456",
  "phone": "9876543210"
}
```

### Success Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "USER_ID",
    "name": "Admin User",
    "email": "admin@gmail.com",
    "phone": "9876543210",
    "role": "user",
    "token": "JWT_TOKEN"
  }
}
```

---

## 1.2 Login User

```http
POST /api/auth/login
```

### Body

```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "USER_ID",
    "name": "Admin User",
    "email": "admin@gmail.com",
    "phone": "9876543210",
    "role": "admin",
    "token": "JWT_TOKEN"
  }
}
```

---

## 1.3 Get Profile

```http
GET /api/auth/profile
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "_id": "USER_ID",
    "name": "Admin User",
    "email": "admin@gmail.com",
    "phone": "9876543210",
    "role": "admin",
    "isActive": true,
    "addresses": []
  }
}
```

---

## 1.4 Update Profile

```http
PUT /api/auth/profile
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Body

```json
{
  "name": "Admin User Updated",
  "phone": "9999999999"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "USER_ID",
    "name": "Admin User Updated",
    "email": "admin@gmail.com",
    "phone": "9999999999",
    "role": "admin"
  }
}
```

---

## 1.5 Change Password

```http
PUT /api/auth/change-password
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Body

```json
{
  "currentPassword": "123456",
  "newPassword": "1234567"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 1.6 Make User Admin

Temporary setup API.

```http
PUT /api/auth/make-admin/:email
```

### Example

```http
PUT /api/auth/make-admin/admin@gmail.com
```

### Success Response

```json
{
  "success": true,
  "message": "User role updated to admin",
  "data": {
    "_id": "USER_ID",
    "name": "Admin User",
    "email": "admin@gmail.com",
    "role": "admin"
  }
}
```

---

# 2. Product APIs

## 2.1 Create Product

Admin only.

```http
POST /api/products
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

### Body

```json
{
  "name": "Aashirvaad Atta 5kg",
  "description": "Premium quality whole wheat flour",
  "price": 210,
  "mrp": 260,
  "category": "Grocery",
  "stock": 10,
  "imageUrl": "https://example.com/atta.jpg",
  "brand": "Aashirvaad",
  "unit": "kg",
  "weight": "5kg",
  "isFeatured": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Aashirvaad Atta 5kg",
    "description": "Premium quality whole wheat flour",
    "price": 210,
    "mrp": 260,
    "discount": 19,
    "category": "Grocery",
    "brand": "Aashirvaad",
    "stock": 10,
    "unit": "kg",
    "weight": "5kg",
    "imageUrl": "https://example.com/atta.jpg",
    "rating": 0,
    "numReviews": 0,
    "isFeatured": true,
    "isActive": true,
    "slug": "aashirvaad-atta-5kg"
  }
}
```

---

## 2.2 Get All Products

Public API.

```http
GET /api/products
```

### Query Parameters

```txt
keyword
category
minPrice
maxPrice
sort
page
limit
```

### Examples

```http
GET /api/products
```

```http
GET /api/products?keyword=atta
```

```http
GET /api/products?category=Grocery
```

```http
GET /api/products?minPrice=100&maxPrice=500
```

```http
GET /api/products?sort=price-low
```

```http
GET /api/products?page=1&limit=12
```

### Possible Sort Values

```txt
price-low
price-high
newest
rating
```

### Success Response

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "_id": "PRODUCT_ID",
      "name": "Aashirvaad Atta 5kg",
      "price": 210,
      "mrp": 260,
      "discount": 19,
      "category": "Grocery",
      "stock": 10,
      "imageUrl": "https://example.com/atta.jpg",
      "rating": 5,
      "numReviews": 1,
      "isFeatured": true,
      "isActive": true
    }
  ]
}
```

---

## 2.3 Get Product By ID

Public API.

```http
GET /api/products/:id
```

### Example

```http
GET /api/products/PRODUCT_ID
```

### Success Response

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Aashirvaad Atta 5kg",
    "description": "Premium quality whole wheat flour",
    "price": 210,
    "mrp": 260,
    "discount": 19,
    "category": "Grocery",
    "brand": "Aashirvaad",
    "stock": 10,
    "unit": "kg",
    "weight": "5kg",
    "imageUrl": "https://example.com/atta.jpg",
    "rating": 5,
    "numReviews": 1,
    "isFeatured": true,
    "isActive": true,
    "reviews": []
  }
}
```

---

## 2.4 Update Product

Admin only.

```http
PUT /api/products/:id
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

### Body

```json
{
  "name": "Aashirvaad Atta 5kg Updated",
  "description": "Updated product description",
  "price": 220,
  "mrp": 270,
  "category": "Grocery",
  "stock": 20,
  "imageUrl": "https://example.com/atta.jpg",
  "brand": "Aashirvaad",
  "unit": "kg",
  "weight": "5kg",
  "isFeatured": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Aashirvaad Atta 5kg Updated"
  }
}
```

---

## 2.5 Delete Product

Admin only.

```http
DELETE /api/products/:id
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "PRODUCT_ID"
  }
}
```

---

## 2.6 Toggle Product Status

Admin only.

```http
PUT /api/products/:id/toggle-status
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Product status updated successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "isActive": false
  }
}
```

---

## 2.7 Update Product Stock

Admin only.

```http
PUT /api/products/:id/stock
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

### Body

```json
{
  "stock": 10
}
```

### Success Response

```json
{
  "success": true,
  "message": "Product stock updated successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "stock": 10
  }
}
```

---

## 2.8 Get Featured Products

Public API.

```http
GET /api/products/featured/list
```

### Success Response

```json
{
  "success": true,
  "message": "Featured products fetched successfully",
  "data": []
}
```

---

## 2.9 Get Products By Category

Public API.

```http
GET /api/products/category/:category
```

### Example

```http
GET /api/products/category/Grocery
```

### Success Response

```json
{
  "success": true,
  "message": "Products by category fetched successfully",
  "data": []
}
```

---

# 3. Product Review APIs

## 3.1 Add Product Review

Protected API.

```http
POST /api/products/:id/reviews
```

### Headers

```txt
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Body

```json
{
  "rating": 5,
  "comment": "Very good quality product"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Review added successfully",
  "data": {
    "_id": "PRODUCT_ID",
    "rating": 5,
    "numReviews": 1,
    "reviews": [
      {
        "user": "USER_ID",
        "name": "Admin User",
        "rating": 5,
        "comment": "Very good quality product"
      }
    ]
  }
}
```

---

## 3.2 Get Product Reviews

Public API.

```http
GET /api/products/:id/reviews
```

### Success Response

```json
{
  "success": true,
  "message": "Reviews fetched successfully",
  "data": [
    {
      "user": "USER_ID",
      "name": "Admin User",
      "rating": 5,
      "comment": "Very good quality product"
    }
  ]
}
```

---

## 3.3 Delete Product Review

Protected API.

```http
DELETE /api/products/:id/reviews/:reviewId
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

# 4. Cart APIs

## 4.1 Get Cart

Protected API.

```http
GET /api/cart
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "_id": "CART_ID",
  "user": "USER_ID",
  "items": [
    {
      "product": {
        "_id": "PRODUCT_ID",
        "name": "Aashirvaad Atta 5kg",
        "price": 210,
        "stock": 10,
        "imageUrl": "https://example.com/atta.jpg"
      },
      "quantity": 2
    }
  ]
}
```

---

## 4.2 Add To Cart

Protected API.

```http
POST /api/cart
```

### Headers

```txt
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Body

```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

### Success Response

```json
{
  "_id": "CART_ID",
  "user": "USER_ID",
  "items": [
    {
      "product": {
        "_id": "PRODUCT_ID",
        "name": "Aashirvaad Atta 5kg",
        "price": 210
      },
      "quantity": 2
    }
  ]
}
```

---

## 4.3 Update Cart Item Quantity

Protected API.

```http
PUT /api/cart/:productId
```

### Headers

```txt
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Body

```json
{
  "quantity": 3
}
```

### Note

```txt
quantity 0 karne par item cart se remove ho jayega.
```

### Success Response

```json
{
  "_id": "CART_ID",
  "user": "USER_ID",
  "items": [
    {
      "product": {
        "_id": "PRODUCT_ID",
        "name": "Aashirvaad Atta 5kg"
      },
      "quantity": 3
    }
  ]
}
```

---

## 4.4 Remove Item From Cart

Protected API.

```http
DELETE /api/cart/:productId
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "_id": "CART_ID",
  "user": "USER_ID",
  "items": []
}
```

---

## 4.5 Clear Cart

Protected API.

```http
DELETE /api/cart
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "_id": "CART_ID",
  "user": "USER_ID",
  "items": []
}
```

---

# 5. Wishlist APIs

## 5.1 Get Wishlist

Protected API.

```http
GET /api/wishlist
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Wishlist fetched successfully",
  "data": {
    "_id": "WISHLIST_ID",
    "user": "USER_ID",
    "products": []
  }
}
```

---

## 5.2 Add To Wishlist

Protected API.

```http
POST /api/wishlist/:productId
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Product added to wishlist successfully",
  "data": {
    "_id": "WISHLIST_ID",
    "products": []
  }
}
```

---

## 5.3 Remove From Wishlist

Protected API.

```http
DELETE /api/wishlist/:productId
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Product removed from wishlist successfully",
  "data": {
    "_id": "WISHLIST_ID",
    "products": []
  }
}
```

---

# 6. Address APIs

## 6.1 Get Addresses

Protected API.

```http
GET /api/users/addresses
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Addresses fetched successfully",
  "data": [
    {
      "_id": "ADDRESS_ID",
      "fullName": "Admin User",
      "phone": "9876543210",
      "address": "Gomti Nagar",
      "city": "Lucknow",
      "state": "Uttar Pradesh",
      "postalCode": "226010",
      "country": "India",
      "isDefault": true
    }
  ]
}
```

---

## 6.2 Add Address

Protected API.

```http
POST /api/users/addresses
```

### Headers

```txt
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Body

```json
{
  "fullName": "Admin User",
  "phone": "9876543210",
  "address": "Gomti Nagar",
  "city": "Lucknow",
  "state": "Uttar Pradesh",
  "postalCode": "226010",
  "country": "India",
  "isDefault": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Address added successfully",
  "data": [
    {
      "_id": "ADDRESS_ID",
      "fullName": "Admin User",
      "phone": "9876543210",
      "address": "Gomti Nagar",
      "city": "Lucknow",
      "state": "Uttar Pradesh",
      "postalCode": "226010",
      "country": "India",
      "isDefault": true
    }
  ]
}
```

---

## 6.3 Update Address

Protected API.

```http
PUT /api/users/addresses/:addressId
```

### Headers

```txt
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Body

```json
{
  "fullName": "Admin User Updated",
  "phone": "9999999999",
  "address": "Hazratganj",
  "city": "Lucknow",
  "state": "Uttar Pradesh",
  "postalCode": "226001",
  "country": "India",
  "isDefault": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": []
}
```

---

## 6.4 Delete Address

Protected API.

```http
DELETE /api/users/addresses/:addressId
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": []
}
```

---

## 6.5 Set Default Address

Protected API.

```http
PUT /api/users/addresses/:addressId/default
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Default address updated successfully",
  "data": []
}
```

---

# 7. Order APIs

## 7.1 Create Order

Protected API.

```http
POST /api/orders
```

### Headers

```txt
Authorization: Bearer TOKEN
Content-Type: application/json
```

### Body With Saved Address

```json
{
  "orderItems": [
    {
      "product": "PRODUCT_ID",
      "quantity": 1
    }
  ],
  "addressId": "ADDRESS_ID",
  "paymentMethod": "COD"
}
```

### Body With Direct Shipping Address

```json
{
  "orderItems": [
    {
      "product": "PRODUCT_ID",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "fullName": "Admin User",
    "phone": "9876543210",
    "address": "Gomti Nagar",
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "postalCode": "226010",
    "country": "India"
  },
  "paymentMethod": "COD"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "ORDER_ID",
    "user": "USER_ID",
    "orderItems": [
      {
        "product": "PRODUCT_ID",
        "name": "Aashirvaad Atta 5kg",
        "imageUrl": "https://example.com/atta.jpg",
        "price": 210,
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "fullName": "Admin User",
      "phone": "9876543210",
      "address": "Gomti Nagar",
      "city": "Lucknow",
      "state": "Uttar Pradesh",
      "postalCode": "226010",
      "country": "India"
    },
    "paymentMethod": "COD",
    "paymentStatus": "Pending",
    "orderStatus": "Pending",
    "itemsPrice": 210,
    "shippingPrice": 40,
    "taxPrice": 0,
    "totalPrice": 250
  }
}
```

---

## 7.2 Get My Orders

Protected API.

```http
GET /api/orders/myorders
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "My orders fetched successfully",
  "data": []
}
```

---

## 7.3 Get Order By ID

Protected API.

```http
GET /api/orders/:id
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Order fetched successfully",
  "data": {
    "_id": "ORDER_ID"
  }
}
```

---

## 7.4 Get All Orders

Admin only.

```http
GET /api/orders
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": []
}
```

---

## 7.5 Update Order Status

Admin only.

```http
PUT /api/orders/:id/status
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

### Body

```json
{
  "orderStatus": "Delivered"
}
```

### Allowed Status

```txt
Pending
Confirmed
Processing
Shipped
Delivered
Cancelled
```

### Success Response

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "ORDER_ID",
    "orderStatus": "Delivered",
    "paymentStatus": "Paid"
  }
}
```

---

## 7.6 Update Payment Status

Admin only.

```http
PUT /api/orders/:id/payment
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

### Body

```json
{
  "paymentStatus": "Paid"
}
```

### Allowed Payment Status

```txt
Pending
Paid
Failed
Refunded
```

### Success Response

```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "_id": "ORDER_ID",
    "paymentStatus": "Paid"
  }
}
```

---

## 7.7 Cancel Order

Protected API.

```http
PUT /api/orders/:id/cancel
```

### Headers

```txt
Authorization: Bearer TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "ORDER_ID",
    "orderStatus": "Cancelled"
  }
}
```

---

# 8. Admin APIs

## 8.1 Dashboard Stats

Admin only.

```http
GET /api/admin/stats
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "totalUsers": 1,
    "totalProducts": 1,
    "totalOrders": 1,
    "totalRevenue": 250,
    "pendingOrders": 1,
    "deliveredOrders": 0,
    "cancelledOrders": 0,
    "lowStockProducts": 0
  }
}
```

---

## 8.2 Get All Users

Admin only.

```http
GET /api/admin/users
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": []
}
```

---

## 8.3 Update User Role

Admin only.

```http
PUT /api/admin/users/:id/role
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json
```

### Body

```json
{
  "role": "shopkeeper"
}
```

### Allowed Roles

```txt
user
admin
shopkeeper
```

### Success Response

```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "_id": "USER_ID",
    "role": "shopkeeper"
  }
}
```

---

## 8.4 Toggle User Status

Admin only.

```http
PUT /api/admin/users/:id/status
```

### Headers

```txt
Authorization: Bearer ADMIN_TOKEN
```

### Success Response

```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "_id": "USER_ID",
    "isActive": false
  }
}
```

---

# 9. Common Error Responses

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Unauthorized Error

```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

## Invalid Token Error

```json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

## Not Found Error

```json
{
  "success": false,
  "message": "Route not found - /wrong-route"
}
```

## Server Error

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

# 10. Current Working Test IDs

Ye IDs tumhare current local database ke hisaab se hain. Agar database clear karoge to ye change ho jayenge.

## Current Admin User

```txt
User ID:
6a09956edae352f8931594e1

Email:
admin2@gmail.com

Password:
123456

Role:
admin
```

## Current Product

```txt
Product ID:
6a09963cfca8e9f1b1048670

Product:
Aashirvaad Atta 5kg
```

## Current Address

```txt
Address ID:
6a09d0123a57e61e9134a39e

Address:
Gomti Nagar, Lucknow, Uttar Pradesh, 226010
```

## Current Order

```txt
Order ID:
6a09d08b3a57e61e9134a3a9
```

---

# 11. Frontend Integration Notes

## Login ke baad

Frontend ko token localStorage me save karna hai:

```js
localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data));
```

## Protected API call

```js
const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Add to cart example

```js
const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/cart", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    productId: "PRODUCT_ID",
    quantity: 1,
  }),
});
```

## Create order example with saved address

```js
const token = localStorage.getItem("token");

fetch("http://localhost:5000/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    orderItems: [
      {
        product: "PRODUCT_ID",
        quantity: 1,
      },
    ],
    addressId: "ADDRESS_ID",
    paymentMethod: "COD",
  }),
});
```

---

# 12. Payment Note

Is project me online payment use nahi karna hai.

Allowed payment method:

```txt
COD
```

Payment status manually admin update karega:

```http
PUT /api/orders/:id/payment
```

```json
{
  "paymentStatus": "Paid"
}
```

---

# 13. Backend Completed Modules

```txt
Auth register/login/profile/update/change-password
Admin role setup
Product CRUD
Product search/filter/sort
Product stock/status management
Product reviews/ratings
Cart add/get/update/remove/clear
Wishlist
User address management
Order create with saved address
COD payment flow
Order status management
Payment status management
Order cancel with stock restore
Admin dashboard stats
Admin user management
```