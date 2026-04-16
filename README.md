# 📦 Amazon Clone — Premium Frontend

A high-performance, feature-rich Amazon Clone built with **Next.js** and **Tailwind CSS**. This project delivers a polished, modern e-commerce experience with a focus on reusable architecture and premium UI aesthetics.

---

## 🚀 Key Features

### 🛒 Product Discovery & Search
*   **Live Search Suggestions**: Instant product feedback as you type.
*   **Input Clear Option**: One-click search reset for a smoother user experience.
*   **Dynamic Category Filtering**: Rapidly navigate through collections using an intuitive category slider.
*   **Shop the Collection**: Targeted entry points for featured categories like Electronics, Clothing, and Home.

### 💳 Shopping & Checkout
*   **Advanced Cart Management**: Persistent cart state managed via React Context API with real-time updates.
*   **Streamlined Checkout Flow**: Simplified address management and multi-step order confirmation process.
*   **Premium Badge System**: Visual feedback for discounts, status, and featured items.

### 📁 Order History & Management
*   **Comprehensive Order Tracking**: Detailed status monitoring for all placed orders.
*   **One-Click "Buy It Again"**: Convenient re-ordering direct from your history.
*   **Order Metadata**: View detailed invoices including dates, totals, and unique order IDs.

---

## 📸 App Tour

### 🏠 Home Page
![Home Page](./public/image.png)

### 🔍 Search with Live Suggestions
![Search Suggestions](./public/image%20copy%208.png)

### 🛍️ Product Listings & Filters
![Product Listings](./public/image%20copy%202.png)

### 📄 Product Details
![Product Details](./public/image%20copy.png)

### 🛒 Shopping Cart
![Shopping Cart](./public/image%20copy%203.png)

### 💳 Checkout Process
| Address Selection | Review Order |
|-------------------|--------------|
| ![Address](./public/image%20copy%204.png) | ![Review](./public/image%20copy%205.png) |

### 🚀 Order Confirmation
![Order Confirmation](./public/image%20copy%206.png)

### 📜 Order History
![Order History](./public/image%20copy%207.png)

---

## 🛠 Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Material Symbols](https://fonts.google.com/icons)
*   **State**: React Context API
*   **Interactions**: Framer Motion / CSS Transitions

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have the [Amazon Clone Backend](https://github.com/tejas-pagare/amazon-clone-backend-scalar) running. By default, the frontend expects the API to be at `http://localhost:3000`.

### 2. Installation
```bash
npm install
```

### 3. Run the Development Server
This frontend is configured to run on port **3001** to avoid conflicts with the backend.
```bash
npm run dev
```

### 4. Open the App
Visit [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📁 Project Structure

*   **/src/app**: Next.js App Router pages and layouts.
*   **/src/components/ui**: A library of reusable, premium UI components (Buttons, Cards, Inputs, etc.).
*   **/src/context**: Global state providers for Auth and Cart.
*   **/src/lib**: API wrappers and utility functions.

---

## 📋 Design Philosophy
This project prioritizes a **"Pixel-Decent"** but professional approach. It avoids basic browser defaults in favor of a curated design system with:
*   Smooth transitions and micro-animations.
*   A custom HSL-based color palette for consistent theming.
*   Responsive, mobile-first layouts using Tailwind's grid and flex utilities.

---

## 📄 License
Created by [Tejas Pagare](https://github.com/tejas-pagare). This project is intended for educational purposes as part of the Scaler SDE Intern Assignment.
