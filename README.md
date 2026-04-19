# 🏠 RentWise – Property Management System

RentWise is a full-stack web application designed to manage rental properties, tenants, and payments efficiently. It provides role-based dashboards for landlords and tenants with real-time data integration.

---

## 🚀 Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Secure password hashing using bcrypt

### 👤 Role-Based Access

* Landlord Dashboard
* Tenant Dashboard

### 🏢 Property Management (Landlord)

* Add new properties
* View all owned properties
* Manage property details

### 👥 Tenant Management

* Link tenants to properties
* View tenant details

### 💳 Payments & Maintenance

* Track rent payments
* Maintenance request handling

### 📊 Dashboard

* Dynamic data display
* Real-time property and tenant information

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Other Tools

* JWT (Authentication)
* bcrypt (Password Hashing)

---

## 📂 Project Structure

RentWise/
│
├── rentwise-backend/
│   ├── controllers/
│   ├── routes/
│   ├── db/
│   ├── server.js
│   └── package.json
│
├── rentwise-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── landlord/
│   │   │   └── tenant/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

git clone https://github.com/Yeso05/RentWise.git
cd RentWise

---

### 2️⃣ Backend Setup

cd rentwise-backend
npm install

Create `.env` file:

DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=rentwise
PORT=5000
JWT_SECRET=your_secret

Run backend:

node server.js

---

### 3️⃣ Frontend Setup

cd rentwise-frontend
npm install
npm run dev

---

## 🔗 API Endpoints

POST   /api/auth/signup        → Register user
POST   /api/auth/login         → Login user
GET    /api/properties/:email  → Get landlord properties
POST   /api/properties         → Add property
GET    /api/tenants/:email     → Get tenant details

---

## 🧪 Test Credentials

### 👨‍💼 Landlord

Email: [aarthi@gmail.com](mailto:aarthi@gmail.com)
Password: 123456

### 👤 Tenant

Email: [rahul@gmail.com](mailto:rahul@gmail.com)
Password: 123456

---

## 📸 Screenshots

(Add your UI screenshots here)

---

## 🔮 Future Enhancements

* Real-time notifications (Socket.io)
* File upload system
* Role-based access control
* Cloud deployment (AWS / Render)

---

## 📌 Author

YESWANTHIRA S

---

## ⭐ Conclusion

RentWise simplifies property management by providing a centralized platform for landlords and tenants with a clean UI and efficient backend. It is designed to be scalable, user-friendly, and suitable for real-world applications.
