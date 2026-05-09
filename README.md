# Malinka 🍓 — Online Store

**Malinka** is a modern e-commerce web application built with Angular 19. It provides a complete user interface for browsing products, managing a shopping cart, maintaining a wishlist, and accessing a personal user account.

## 🚀 Tech Stack

- **Framework:** [Angular 19](https://angular.io/)
- **Rendering:** SSR (Server-Side Rendering) via `@angular/ssr` and Express.
- **State Management:** Services & RxJS.
- **Styling:** CSS3 (Vanilla).
- **Notifications:** `ngx-toastr` for interactive user feedback.
- **Routing:** Angular Router with Route Guards for security.

## ✨ Key Features

- **Product Catalog:** Detailed product listing and individual item views.
- **Shopping Cart:** Full CRUD operations for managing items before purchase.
- **Wishlist (Liked):** Save favorite products for later.
- **Authentication:** Secure Login and Registration system.
- **User Profile:**
  - Personal profile management.
  - Account settings.
  - Order history tracking.
- **Security:** Implementation of `authGuard` and `guestGuard` to protect private routes.
- **SEO & Performance:** Optimized for search engines and fast initial load times through SSR.

## 🛠 Installation and Setup

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) and the [Angular CLI](https://angular.io/cli) installed.

### Setup Steps
1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd malinka
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the following command to start a local development server:
```bash
npm run start
# or
ng serve
```
Navigate to `http://localhost:4200/` in your browser.

### Build
To create a production-ready build:
```bash
npm run build
```
Build artifacts will be stored in the `dist/` directory.

### Run SSR (Server Rendering)
```bash
npm run serve:ssr:Malinka
```

## 📂 Project Structure

- `src/app/pages` — Core views (Home, Store, Auth, Profile, Cart).
- `src/app/components` — Reusable UI elements (Header, Footer).
- `src/app/services` — Business logic and state management (Auth, Products, Cart).
- `src/app/guards` — Route protection logic.
- `public/` — Static assets (logos, icons, images).

---
Built with ❤️ for the Malinka project.
