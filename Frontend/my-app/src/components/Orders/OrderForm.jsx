import React, { useState, useEffect } from "react";
import { createOrder, getCustomers } from "../../Services/api";

export default function OrderForm({ refreshOrders }) {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      // Ensure res.data is an array
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateOrder = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    setLoading(true);
    try {
      const res = await createOrder(selectedCustomer);
      console.log("Order created:", res.data);
      alert("Order created successfully!");
      setSelectedCustomer("");
      refreshOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // If no customers, disable order creation
  if (customers.length === 0) {
    return (
      <div className="border p-4 rounded shadow mb-6">
        <h2 className="text-lg font-bold mb-2">Create New Order</h2>
        <p className="text-red-500">No customers available. Please add customers first.</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-2">Create New Order</h2>

      {/* Customer Select */}
      <div className="mb-4">
        <label className="font-semibold mr-2">Select Customer:</label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="border p-1 rounded w-full"
        >
          <option value="">-- Select Customer --</option>
          {customers.map((customer) => (
            <option key={customer.customerId} value={customer.customerId}>
              {customer.firstName} {customer.lastName} | {customer.email} | {customer.phone}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleCreateOrder}
        disabled={loading}
        className={`px-3 py-1 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600"}`}
      >
        {loading ? "Creating..." : "Create Order"}
      </button>
    </div>
  );
}
