# 🛒 Customer Order Management System

## 📖 Project Overview

The **Customer Order Management System** is a full-stack web application designed to streamline the process of managing customers, their addresses, and the orders linked to them.

This project simulates a **real-world CRM (Customer Relationship Management)** use case. It allows a business to:

- ✅ **Manage Customers** – Store customer details such as name, email, and phone number.
- ✅ **Maintain Multiple Addresses** – Each customer can have multiple addresses (e.g., billing and shipping addresses).
- ✅ **Order Management** – Create, update, and delete orders linked to specific customers.
- ✅ **Reference Before Creation** –
  - Orders can only be created if valid customers exist.
  - Order Items can be linked to referenced products.

The system ensures **data consistency, better traceability, and user-friendly interaction**.

---

## 🎯 Why This Project?

In many businesses, customer data and order tracking are still handled manually in spreadsheets or across different tools.  
This project demonstrates how to bring everything together in **one centralized application**, making it easier to:

- Track **who placed an order**
- Know **what products were ordered**
- Maintain **customer profiles with multiple addresses**
- Provide a **clean, modern UI** for business users

---

## 🚀 Features

- **Customer Management**

  - Add, edit, and delete customer records
  - Store multiple addresses per customer

- **Order Management**

  - Create, update, and delete orders
  - Reference customers before creating orders

- **Error Handling**

  - No orders can be created without customers
  - Alerts and validations for incorrect inputs

- **Frontend (React + Tailwind CSS)**

  - Responsive UI with clean design
  - Easy-to-use forms for CRUD operations

- **Backend (Node.js + Express + SQLite)**
  - RESTful APIs for customers, addresses, and orders
  - Role-based validation and error handling

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios (for API calls)
- React Router

### Backend

- Node.js
- Express.js
- SQLite (Database)

---

## 📂 Project Structure
