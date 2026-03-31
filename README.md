# Smart Inventory & Order Management System

A comprehensive web application designed to seamlessly manage products, stock levels, customer orders, and fulfillment workflows with intelligent validation and conflict handling.

## 🌟 Key Features

### 1. Authentication & Security
- Secure Email & Password authentication
- Role-based access control (Admin / Manager)
- Automatic redirect to the Dashboard upon successful login
- Quick Demo Login functionality for reviewers

### 2. Product & Category Management
- **Categories**: Create and manage product categories (e.g., Electronics, Grocery, Clothing).
- **Products**: Manually add products with detailed attributes:
  - Product Name & Category
  - Price & Stock Quantity
  - Minimum Stock Threshold (for automated restock queueing)
  - Status management (Active / Out of Stock / Inactive)

### 3. Order Management System
- Create new orders with multiple products
- Update order statuses (Pending, Confirmed, Shipped, Delivered, Cancelled)
- View order history and details
- Auto-calculated total pricing

### 4. Intelligent Stock Handling & Conflict Detection
- **Auto-Deduction**: Stock is automatically deducted when orders are placed
- **Conflict Prevention**: 
  - Prevents adding duplicate products to a single order
  - Blocks ordering of inactive or unavailable products
- **Stock Validation**:
  - Warns if requested quantity exceeds available stock ("Only X items available")
  - Prevents order confirmation if stock is insufficient
  - Auto-updates product status to "Out of Stock" when inventory reaches 0

### 5. Restock Queue (Low Stock Management)
- Automatically queues products falling below their minimum stock threshold
- Organized by lowest stock first
- Visual priority indicators (High / Medium / Low)
- Manual restock capabilities with auto-removal from the queue

### 6. Interactive Dashboard & Activity Log
- **Insights Overview**: Track Total Orders, Pending vs. Completed Orders, Revenue, and Low Stock Items
- **Product Summary**: Quick view of top inventory items and their stock status
- **Activity Log**: Real-time tracking of system actions (e.g., order creation, stock updates, queue additions)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, shadcn/ui
- **State Management & Forms**: React Hook Form, Zod (Validation)
- **Backend/Database**: Next.js API Routes, Prisma ORM
- **Authentication**: Custom Auth Implementation / NextAuth (Depending on setup)
- **Deployment**: Vercel (Frontend & Serverless Functions)

## 🚀 Getting Started

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

## 📦 Deployment

This project is configured for easy deployment on Vercel. Connect your GitHub repository to Vercel and it will automatically handle the build and deployment process.

- **Live URL**: [Add your live URL here]
- **GitHub Repository**: [Add your repo link here]

## 📝 License

This project is open-source and available under the MIT License.
