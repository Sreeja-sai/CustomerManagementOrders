// src/components/Orders/OrdersManagement.jsx
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  getAllOrdersWithItems,
  deleteOrder,
  deleteOrderItem,
} from "../../Services/api";
import OrdersList from "./OrdersList";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const history = useHistory();

  // Fetch all orders with items
  const fetchOrders = async () => {
    try {
      const response = await getAllOrdersWithItems();
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handlers
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order and all its items?")) {
      await deleteOrder(orderId);
      fetchOrders();
    }
  };

  const handleDeleteOrderItem = async (orderId, orderItemId) => {
    if (window.confirm("Are you sure you want to delete this order item?")) {
      await deleteOrderItem(orderId, orderItemId);
      fetchOrders();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow"
        onClick={() => history.push("/newOrder")}
      >
        + Create New Order
      </button>

      <OrdersList
        orders={orders}
        onDeleteOrder={handleDeleteOrder}
        onDeleteOrderItem={handleDeleteOrderItem}
        refreshOrders={fetchOrders}
      />
    </div>
  );
}
