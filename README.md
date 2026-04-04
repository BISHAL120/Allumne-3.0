# Smart Inventory & Order Management System

A full-stack admin system to manage products, inventory, customers, and orders with transactional stock updates, analytics dashboards, and activity logging.

## Key Features

### 1. Authentication & Access Control
- Email/password authentication.
- Role-based access for admin workflows.
- Protected admin data-layer functions (admin checks before analytics/data reads).

### 2. Product & Category Management
- Category CRUD support for organizing products.
- Product management with:
  - `productName`, category, slug, price
  - variant-based inventory (`size`, `stock`)
  - `totalStock` and `totalSold` tracking
  - `restockAlertThreshold` for low stock monitoring

### 3. Order Management
- Create order with existing/new customer linking.
- Multi-item cart in an order (via `cartItem` rows).
- Update:
  - order status (`PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
  - customer info from order edit page
  - cart item quantity and price inside an existing order

### 4. Order Quantity Update Synchronization
- Order item edits run in a **single transaction** to keep data consistent.
- When order product quantity changes:
  - `cartItem.quantity` and `cartItem.subTotal` are updated.
  - Product variant stock is adjusted by the quantity delta.
  - Product `totalStock` is recalculated from all variants.
  - Product `totalSold` is updated with guard (`>= 0`).
  - Order `totalPrice` is updated from recalculated cart total.
- Validation rules:
  - Blocks quantity increase when variant stock is insufficient.
  - Supports quantity decrease (stock is restored back correctly).
- Result: all order, inventory, and analytics views stay synchronized across the app.

### 5. Dashboard & Analytics
- Dynamic admin dashboard with live DB-driven metrics:
  - Today vs yesterday orders
  - Pending/delivered counts and completion rate
  - Revenue today vs yesterday
  - Low stock product count
- Additional analytics sections:
  - monthly sales chart with historical target baseline
  - revenue breakdown by category
  - top low-stock products
  - customer growth/repeat/active trends
  - recent activity log feed

### 6. Customer Module (Split Pages)
- Sidebar has a dedicated `Customer` dropdown with:
  - `Statistics` page
  - `Customer List` page
- `Statistics` page includes:
  - total customers
  - new customers this month
  - active customers in last 30 days
  - repeat customers
  - average order value
  - top customers by total spent
- `Customer List` page includes:
  - search (name/phone/email)
  - filter (`all`, `with_orders`, `without_orders`, `repeat`)
  - sort (`newest`, `oldest`, `name_asc`, `name_desc`)
  - server-side pagination

### 7. Restock Queue & Low Stock Management
- Low-stock queue generated from product/variant inventory.
- Priority tagging (`High`, `Medium`, `Low`) based on stock.
- Restock action updates inventory and writes activity logs.

### 8. Activity Monitoring & Audit Trail
- Logs key operations (order create/update/status changes, customer updates, stock restocks).
- Activity writes are coupled to data changes for reliable auditability.
- Dashboard shows recent transactions for operational transparency.

### 9. Seeder Utilities
- Seed scripts for dashboard/customer/order/product test data.
- Product generation in dashboard seed reuses shared product seed logic.
- Admin seed dashboard route/UI available for quick data population in development.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, shadcn/ui
- **State Management & Forms**: React Hook Form, Zod (Validation)
- **Backend/Database**: Next.js API Routes, Prisma ORM
- **Authentication**: Custom Auth Implementation / NextAuth (Depending on setup)
- **Deployment**: Vercel (Frontend & Serverless Functions)

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm, npm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd smart-inventory-and-order-management-system
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your database and authentication secrets.

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for easy deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically handle the build and deployment process.

- **Live URL**: [Add your live URL here]
- **GitHub Repository**: [Add your repo link here]

## License

This project is open-source and available under the MIT License.
