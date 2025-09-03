import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // adjust if your backend runs on another port
  headers: { "Content-Type": "application/json" }
});


// Customers
export const getCustomers = () => api.get("/customer");
export const getCustomerById = (id) => api.get(`/customer/${id}`);
export const createCustomer = (data) => api.post("/customer", data);
export const updateCustomer = (id, data) => api.put(`/customer/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customer/${id}`);

// Addresses
export const addAddress = (customerId, data) => api.post(`/customer/${customerId}`, data);
export const updateAddress = (id, data) => api.put(`/address/${id}`, data);
export const deleteAddress = (id) => api.delete(`/address/${id}`);


// Get all products for dropdown
export const getProducts = () => api.get("/products"); // Make sure your backend has GET /product endpoint


// ----------------- Orders -----------------
export const createOrder = (customerId) => api.post(`/customerorder/${customerId}`);
export const addOrderItem = (orderId, productId, data) => api.post(`/order/${orderId}/product/${productId}`, data);
export const deleteOrder = (orderId) => api.delete(`/orders/${orderId}`);
export const deleteOrderItem = (orderId, itemId) => api.delete(`/orders/${orderId}/items/${itemId}`);

// ----------------- Get Orders -----------------
export const getAllOrders = () => api.get("/orders"); // all orders without items
export const getAllOrdersWithItems = () => api.get("/orders/all"); // all orders with their orderItems
export const getOrderItem = (orderId, orderItemId) => api.get(`/orders/${orderId}/items/${orderItemId}`); // specific order item

// ----------------- Delete All Order Items -----------------
export const deleteAllOrderItems = (orderId) => api.delete(`/orders/${orderId}/items`);
