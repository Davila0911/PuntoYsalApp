Project Overview

This project is a web-based inventory and user management system designed for a restaurant environment. It allows staff to manage initial and final inventories, record daily product movements, track low-stock items, and maintain user records with role-based access. It provides an intuitive interface for both bar and kitchen staff, as well as admin users, ensuring accurate tracking of products and user actions.

- Tecnologies Used:
Frontend: React, JavaScript, CSS

Backend API Integration: Fetch API, JWT Authentication

Database: Postgres17 (relational database)

Version Control: Git, GitHub

Deployment: Vercel (frontend)

- Features

User Management
Create, edit, and update users with role-based access (Admin, Bar, Kitchen,)

Inventory Management

Record initial and final inventory for Bar and Kitchen

Track product movements: Entries, Damaged, Courtesy, Waste

Low Stock Tracking

Display products with stock below minimum threshold

User Records

View paginated user activity and inventory changes by date

Efficient display of large datasets for inventory and records

- Building Process
Designed database tables for users, products, inventory, and records

Created API endpoints for user management and inventory operations in C# 

Created frontend components in React based on user roles(Kitchen,bar,Admin)

Implemented authentication using JWT

- What I learned
How to integrate frontend React components with a backend API

Implementing role-based access in a multi-user system

Handling paginated API requests and displaying data efficiently

Managing timezone-related issues in user activity and inventory records

Improving project structure for maintainability and scalability

- How could it be improved
Implement search and filter for products in inventory and records

Add export functionality (CSV/Excel) for records

Improve UI/UX with a modern design framework (e.g., Tailwind or Material UI)

Add unit and integration tests to ensure reliability

Improve API response times

- How to run the project

Clone repository with:
git clone https://github.com/Davila0911/inventario-app.git
cd inventario-app

Install dependencies with:
npm install

In the .env.example file in the root folder with the following variables:
REACT_APP_API_BASE_URL=<your_backend_api_url>

Run server with: NPM start

Open your browser at http://localhost:3000 to use the application.
