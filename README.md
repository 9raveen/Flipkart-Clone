# Flipkart Clone — Full Stack E-Commerce App

A functional Flipkart-inspired e-commerce web application built as part of an SDE Intern assignment.

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js (Vite), CSS Modules      |
| Backend   | Node.js + Express.js              |
| Database  | PostgreSQL + Sequelize ORM        |
| Auth      | JWT (bonus), default user assumed |

## Features

- Product listing with grid layout (Flipkart-style cards)
- Search by name, filter by category, sort by price/rating
- Product detail page with image carousel, specs, ratings
- Add to Cart / Buy Now
- Cart management (update qty, remove, price summary)
- Checkout with shipping address form + payment method selection
- Order placement + Order confirmation page with Order ID
- Order history
- Wishlist (add/remove)
- Responsive design (mobile, tablet, desktop)
- Email notification on order placement (optional, configure SMTP)

## Database Schema

```
users          — id, name, email, password, phone, isDefault
categories     — id, name, slug, image
products       — id, name, description, price, originalPrice, discount, stock, brand, rating, reviewCount, images[], specifications{}, categoryId, isFeatured
cart_items     — id, userId, productId, quantity
orders         — id, userId, status, totalAmount, shippingAddress{}, paymentMethod, orderNumber
order_items    — id, orderId, productId, quantity, price, productName, productImage
wishlists      — id, userId, productId
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL 14+

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials

# Frontend
cd ../frontend
npm install --ignore-scripts
node node_modules/esbuild/install.js   # manual esbuild setup if needed
```

### 2. Database Setup

Create a PostgreSQL database:
```sql
CREATE DATABASE flipkart_clone;
```

Update `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=flipkart_clone
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=any_random_secret
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 1 default user (email: user@flipkart.com, password: password123)
- 8 categories
- 15+ products across all categories

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev        # runs on http://localhost:3000
```

Open http://localhost:3000

## API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/products             | List products (search, filter, sort, paginate) |
| GET    | /api/products/featured    | Featured products        |
| GET    | /api/products/:id         | Product detail           |
| GET    | /api/categories           | All categories           |
| GET    | /api/cart                 | Get cart                 |
| POST   | /api/cart                 | Add to cart              |
| PUT    | /api/cart/:id             | Update cart item qty     |
| DELETE | /api/cart/:id             | Remove cart item         |
| POST   | /api/orders               | Place order              |
| GET    | /api/orders               | Order history            |
| GET    | /api/orders/:id           | Order detail             |
| GET    | /api/wishlist             | Get wishlist             |
| POST   | /api/wishlist             | Add to wishlist          |
| DELETE | /api/wishlist/:productId  | Remove from wishlist     |

## Assumptions

- A default user is pre-seeded and assumed to be logged in (no login required per spec)
- All cart/order/wishlist operations use this default user
- Email notifications require valid Gmail SMTP credentials in `.env` (optional)
- Product images use placeholder URLs; replace with real CDN URLs in production

## Deployment

- Frontend: Deploy to Vercel (`vercel --prod` from `/frontend`)
- Backend: Deploy to Render/Railway (set env vars in dashboard)
- Database: Use Render PostgreSQL or Supabase free tier
