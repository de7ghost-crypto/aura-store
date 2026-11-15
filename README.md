# Aura: Clothing Store

A full stack e-commerce site built from scratch.

**Live site:** https://aura-store-drab.vercel.app
**Backend API:** https://aura-backend-fgoz.onrender.com/api/products

## Features

- Product catalogue with search, category filter and sorting
- Product pages with size, colour and quantity selection
- Shopping cart saved in the browser
- Checkout for guests and logged in customers
- Customer registration and login with hashed passwords and JWT sessions
- Admin panel to add, edit and delete products (admin accounts only)
- Responsive design with loading skeletons

## Tech stack

- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon) with Prisma ORM
- **Auth:** bcryptjs, JSON Web Tokens
- **Hosting:** Vercel (frontend), Render (backend), Neon (database)

## Project structure

```
Backend/    Express server, Prisma schema and migrations
Frontend/   HTML pages, css/ and js/ folders
```

## Run it locally

1. `cd Backend` and run `npm install`
2. Copy `.env.example` to `.env` and fill in your own `DATABASE_URL` and `JWT_SECRET`
3. Run `npx prisma migrate deploy` to create the tables
4. Run `npm run dev` to start the API on port 3000
5. Open the `Frontend` folder with the VS Code Live Server extension

## Note

The backend runs on a free plan, so the first request after a quiet period can take up to a minute while it wakes up.