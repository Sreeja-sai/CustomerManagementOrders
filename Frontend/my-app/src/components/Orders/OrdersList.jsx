import React, { useState, useEffect } from "react";
import { addOrderItem, getProducts } from "../../Services/api";

export default function OrdersList({ orders, onDeleteOrder, onDeleteOrderItem, refreshOrders }) {
  const [addingItemOrderId, setAddingItemOrderId] = useState(null);
  const [newItem, setNewItem] = useState({ productId: "", quantity: 1 });
  const [products, setProducts] = useState([]);

  // Fetch all products for the dropdown
  const fetchProducts = async () => {
    try {
      const response = await getProducts(); // new api call
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddItemClick = (orderId) => {
    setAddingItemOrderId(orderId);
    setNewItem({ productId: "", quantity: 1 });
  };

  const handleSaveNewItem = async (orderId) => {
    if (!newItem.productId || newItem.quantity <= 0) {
      alert("Select a valid product and quantity");
      return;
    }
    try {
      await addOrderItem(orderId, newItem.productId, { quantity: newItem.quantity });
      setAddingItemOrderId(null);
      refreshOrders();
    } catch (err) {
      alert("Failed to add order item");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setAddingItemOrderId(null);
    setNewItem({ productId: "", quantity: 1 });
  };

  return (
    <div>
      {orders.map((order) => (
        <div key={order.orderId} className="mb-6 border p-4 rounded shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-lg">Order #{order.orderId}</h2>
              <p>Customer: {order.CustomerName}</p>
              <p>Total Amount: {order.totalAmount} Rs/-</p>
            </div>
            <button
              onClick={() => onDeleteOrder(order.orderId)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete Order
            </button>
          </div>

          {/* --- Order Items --- */}
          <h3 className="mt-4 font-semibold">Order Items:</h3>
          <ul>
            {order.orderItems.map((item) => (
              <li key={item.orderItemId} className="mb-2 flex justify-between border-b pb-2">
                <div>
                  <p>
                    {item.productName} | Qty: {item.quantity} | Price: {item.price} Rs/-
                  </p>
                </div>
                <button
                  onClick={() => onDeleteOrderItem(order.orderId, item.orderItemId)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete Item
                </button>
              </li>
            ))}
          </ul>

          {/* --- Add Order Item --- */}
          {addingItemOrderId === order.orderId ? (
            <div className="mt-2 flex gap-2 items-center">
              <select
                value={newItem.productId}
                onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                className="border p-1 rounded"
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.productName} ({product.price}Rs/-)
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                className="border p-1 rounded w-24"
              />

              <button
                onClick={() => handleSaveNewItem(order.orderId)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAddItemClick(order.orderId)}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
            >
              + Add Order Item
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
