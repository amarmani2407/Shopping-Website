# ShopNest — Modern E-Commerce Marketplace

An e-commerce marketplace web application built with **React 19**, **Tailwind CSS**, and **Vite**, inspired by platforms like Amazon.

---

## 🚀 Features

- **Storefront & Discovery**:
  - Sticky top navigation with delivery location selector, autosuggest search bar, category selector, language dropdown, and cart counter.
  - Secondary category bar (*Electronics, Fashion, Home & Kitchen, Books, Beauty, Sports, Toys, Grocery*).
  - Auto-sliding hero promotional carousel with pause-on-hover and direct deal links.
  - Flash Deals section with live countdown timer and discount badges.
  - "Best Sellers" and "Recommended for You" horizontal product scrollers.
  - "Recently Viewed" items tracking.
- **Product Listing & Filtering**:
  - Left sidebar filters: Category, Price Slider (up to ₹1,50,000), Customer Ratings (4★+, 3★+), Brand checkboxes, Fast Delivery ("ShopNest Express"), and Discount percentage.
  - Sort dropdown: Featured, Price (Low → High, High → Low), Avg. Rating, Newest Arrivals.
  - Grid & List view layout toggles.
- **Product Detail Page (PDP)**:
  - Interactive multi-image gallery with hover zoom lens.
  - Variant selectors (Colors, Sizes, Storage), quantity selector, and live Indian PIN code delivery verification.
  - Tabs: Overview, Specifications table, and verified Customer Reviews with star breakdown & review submission form.
  - "Customers Also Bought" carousel.
- **Shopping Cart & Checkout**:
  - Cart item management (+ / - stepper, remove, "Save for later").
  - Free delivery threshold progress bar.
  - Coupon redemption (`SAVE10` for 10% off, `WELCOME20` for 20% off).
  - 4-step secure checkout flow: Account confirmation, Address selection, Payment options (UPI, Card, Net Banking, COD), and Order review.
  - Order confirmation screen with unique Order ID and delivery tracking links.
- **User Account**:
  - Visual 4-stage tracking timeline (*Ordered → Shipped → Out for delivery → Delivered*).
  - Order cancellation and 1-click re-ordering.
  - Wishlist management and saved delivery addresses editor.
  - 1-Click quick test login buttons (Customer demo & Admin demo).
- **Seller / Admin Dashboard**:
  - Revenue, order counts, catalog inventory, and low-stock alerts (< 15 units).
  - In-place price and stock editing, product deletion, and "Add New Product" modal.
  - Customer order status updater (*Ordered → Shipped → Out for delivery → Delivered → Cancelled*).
  - Category product distribution statistics.
- **Dark Mode**: Persisted high-contrast dark theme toggle.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/) (using `HashRouter` for GitHub Pages compatibility)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: Browser `localStorage` (state persists across page reloads)

---

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/shopnest.git
   cd shopnest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be created in the `dist/` directory.

---

## 🌐 Deploy to GitHub Pages (Automated via GitHub Actions)

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

### Step-by-Step Instructions:

1. **Create a new GitHub Repository**:
   - Go to [github.com/new](https://github.com/new).
   - Enter `shopnest` (or any repository name) and click **Create repository**.

2. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of ShopNest marketplace"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - In your GitHub repository, navigate to **Settings** → **Pages** (under "Code and automation" in the left sidebar).
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
   - That's it! GitHub Actions will automatically run the `deploy.yml` workflow, build your project, and publish it.

4. **Access your live site**:
   - Your live site will be accessible at:
     ```
     https://<your-username>.github.io/<your-repo-name>/
     ```

### Why this setup works on GitHub Pages:
- **Relative Asset Paths**: `vite.config.ts` is configured with `base: './'` so images, scripts, and stylesheets load properly even when hosted in a subpath repository.
- **No 404 on Refresh**: `HashRouter` is used so routing (e.g. `/#/products`, `/#/cart`) works without requiring custom server-side URL rewrite rules.
- **Automated Workflow**: Every git push to `main` triggers a build and deploy automatically.

---

## 🔑 Demo Logins

When testing the application, click on **Account & Lists** in the top navigation bar. Two instant 1-click test buttons are provided:

- **Customer Demo**: Amar Gupta (`amar.gupta@shopnest.com`) — pre-populated with addresses, wishlist, and past tracked orders.
- **Admin Demo**: ShopNest Admin (`admin@shopnest.com`) — access the Seller/Admin Console at `/#/admin`.
