# CookSphere

CookSphere is a premium recipe-sharing platform for home cooks, food bloggers, and chefs to share their culinary creations.

## Features

- **Recipe Discovery**: Browse and search a wide collection of recipes with filters.
- **Recipe Management**: User dashboard to add, view, and favorite recipes.
- **Premium Upgrades**: Free accounts are limited to 2 recipe posts. Users can upgrade to Premium via card payment for unlimited uploads.
- **Admin Dashboard**: Manage user roles, approve/suspend recipes, and manage recipe reports.
- **JWT & Proxy Security**: Server-side route protection and JWT cookie security.

## Technologies Used

- **Frontend**: Next.js 16, Tailwind CSS, HeroUI, motion
- **Backend**: Express.js, MongoDB, JWT
- **Authentication**: Better Auth

## Local Setup

### Backend

1. Navigate to server folder:
   ```bash
   cd cooksphere-server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables in a `.env` file:
   - `MONGO_DB_URL`
   - `PORT`
   - `ACCESS_TOKEN_SECRET`
4. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to client folder:
   ```bash
   cd cooksphere
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables in a `.env` file:
   - `NEXT_PUBLIC_API_URL`
   - `BETTER_AUTH_URL`
   - `BETTER_AUTH_SECRET`
   - `MONGO_DB_URL`
4. Run the development server:
   ```bash
   npm run dev
   ```
