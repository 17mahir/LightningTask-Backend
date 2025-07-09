# ⚡ LightningTask — Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

> Backend API for **LightningTask**, a modern task management tool — powered by Node.js, Express, Prisma ORM, and MongoDB Atlas.

---

## 🚀 Project Overview

This backend is the core engine of **LightningTask**, handling:

- 🔐 Authentication (users & admins)
- 📋 Task CRUD operations
- 👥 Sub-user & user management
- 🗓️ task assignment logic
- 🌐 REST API endpoints

---

## ⚙️ Tech Stack

| Tech         | Purpose                              |
|--------------|--------------------------------------|
| Node.js      | Runtime for JavaScript server-side   |
| Express.js   | Web server & routing                 |
| Prisma ORM   | Type-safe DB interaction with MongoDB |
| MongoDB Atlas| Cloud-based NoSQL database           |
| JWT / Bcrypt | Authentication & security            |
| CORS         | Middleware for security and headers  |
| dotenv       | Manage environment variables         |


---

## 🔧 Setup & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/17mahir/LightningTask-Backend.git
cd LightningTask-Backend

# 2. Install dependencies
npm install

# 3. Setup .env file (see below)

# 4. Push Prisma schema (optional if already in DB)
npx prisma db push

# 5. Start the server
npm start


