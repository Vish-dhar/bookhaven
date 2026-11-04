# Bookhaven: online book store (own API + React frontend)

```
bookhaven/
  backend/    Node + Express + MongoDB (Mongoose) REST API
  frontend/   React (Vite) + React Router + Redux Toolkit + redux-persist
```

No outside API is used. Books, covers, users and orders all come from our own backend.

## 1. Install these once

| Tool | Check in terminal | Download |
|---|---|---|
| Node.js 20 or newer (includes npm) | `node -v` and `npm -v` | nodejs.org |
| MongoDB Community Server (local) **or** a free MongoDB Atlas cluster | `mongosh --version` | mongodb.com |
| Postman | open the app | postman.com |

If MongoDB is installed on your PC, make sure the MongoDB service is running.
If you use Atlas, copy its connection string and paste it as `MONGODB_URL` in `backend/.env`.

## 2. Run the backend (terminal 1)

```bash
cd backend
npm install
```

Open `backend/.env` and check the values (a working local one is already there):

```env
PORT=4000
MONGODB_URL=mongodb://127.0.0.1:27017/bookhaven
JWT_SECRET=any_long_random_text
ADMIN_EMAIL=admin@bookhaven.com
ADMIN_PASSWORD=Admin@123
```

Fill the database with 26 sample books and the admin account (run once):

```bash
npm run seed
```

Start the server:

```bash
npm run dev
```

You should see `MongoDB connected successfully` and `Server running on port 4000`.
Open http://localhost:4000 in the browser: `{"message":"Bookhaven Book Store API is running"}`.

## 3. Check the API in Postman

1. Postman > Import > choose `backend/postman/Bookhaven.postman_collection.json`.
2. The collection variable `baseUrl` is `http://localhost:4000`.
3. Run the requests in this order. Tokens and ids are saved automatically by small test scripts.

| Step | Request | Expected |
|---|---|---|
| 1 | `0. Health > API running?` | 200 |
| 2 | `2. Books > Get all books` | 200, 8 books, `total` 26, `pages` 4 (also saves `bookId`) |
| 3 | `1. Auth > Signup (customer)` | 201 |
| 4 | `1. Auth > Login customer` | 200 + `token` (saved) |
| 5 | `4. Orders > Place order` | 201, totals calculated by the server |
| 6 | `4. Orders > My orders` | 200, your order is listed |
| 7 | `1. Auth > Login ADMIN` | 200 (saves `adminToken`) |
| 8 | `5. Orders (ADMIN) > Set status CONFIRMED / SHIPPED / DELIVERED` | 200 each |
| 9 | `3. Books (ADMIN) > Create book` | 201 |
| 10 | `3. Books (ADMIN) > Customer tries to create` | 403 |
| 11 | `6. Favourites > Add book to favourites`, then `My favourites` | 200, count 1 (login as another user: empty list) |

Protected requests need the header `Authorization: Bearer <token>` (already set in the collection).

Things to try on purpose: wrong password (401), no token (401), invalid coupon `FREE50` (400), ordering more than the stock (409), customer opening an admin route (403).

## 4. Run the frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The frontend talks to `http://localhost:4000/api`
(change it in `frontend/.env` with `VITE_API_URL=...`, see `.env.example`).

## 5. API list (base URL `http://localhost:4000/api`)

| Method | URL | Who | What |
|---|---|---|---|
| POST | `/auth/signup` | public | create CUSTOMER account |
| POST | `/auth/login` | public | login, returns token |
| GET / PATCH / DELETE | `/auth/profile` | login | view / update / deactivate own account |
| GET | `/auth/users` | ADMIN | all users |
| DELETE | `/auth/users/:userId` | ADMIN | deactivate a customer |
| GET | `/books` | public | list. Query: `category, minPrice, maxPrice, minRating, search, sort (featured, priceAsc, priceDesc, rating, newest), page, limit` |
| GET | `/books/categories` | public | categories with counts |
| GET | `/books/:bookId` | public | one book with reviews |
| POST / PATCH / DELETE | `/books`, `/books/:bookId` | ADMIN | add / edit / soft delete a book |
| POST | `/orders` | login | place order (body: `items[{bookId, quantity}]`, `shippingAddress`, `couponCode`) |
| GET | `/orders/my` | login | my orders |
| GET | `/orders/:orderId` | owner or ADMIN | one order |
| PATCH | `/orders/:orderId/cancel` | owner | cancel a PLACED order (stock is given back) |
| GET | `/favourites` | login | my favourite books |
| POST / DELETE | `/favourites/:bookId` | login | add / remove a favourite (returns the new list) |
| GET | `/orders?status=PLACED` | ADMIN | all orders |
| PATCH | `/orders/:orderId/status` | ADMIN | `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED` |

## 6. Store rules (same in backend and frontend)

- Discount price = price x (1 - discountPercentage / 100)
- Coupon `SAVE10` = 10% off the subtotal, any other code = "Invalid coupon code"
- Shipping is FREE when the subtotal is $50 or more, otherwise $4.99
- "Only N left" is shown when stock is under 10
- Backend values: `backend/config/storeRules.js`. Frontend values: `frontend/src/config/constants.js`.

## 7. Colour system (frontend/src/styles/tokens.css)

| Role | Colour | Used for |
|---|---|---|
| 1. Priority (primary) | Peacock teal `--color-primary-*` | buttons, links, selected state |
| 2. Secondary | Marigold `--color-secondary-*` | highlights, cart count, hero button |
| 3. Tertiary | Plum `--color-tertiary-*` | sale and discount |

To change the whole website colour, edit only those variables.

## 8. Sample data note

Book titles and authors are real, but prices, stock, ratings and the review texts are sample data made for this project.
