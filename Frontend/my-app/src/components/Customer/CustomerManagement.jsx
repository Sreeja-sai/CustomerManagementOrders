import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  getCustomers,
  addAddress,
  updateAddress,
  deleteAddress,
  updateCustomer,
  deleteCustomer
} from "../../Services/api";
import CustomerList from "./CustomerList";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]); // make sure initial state is an array
  const history = useHistory();

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      // ensure we always set an array
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomers([]); // fallback to empty array
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddAddress = async (customerId, newAddress) => {
    try {
      await addAddress(customerId, newAddress);
      fetchCustomers();
    } catch {
      alert("Failed to add address");
    }
  };

  const handleEditAddress = async (customerId, addressId, updatedAddress) => {
    try {
      await updateAddress(addressId, updatedAddress);
      fetchCustomers();
    } catch {
      alert("Failed to edit address");
    }
  };

  const handleDeleteAddress = async (customerId, addressId) => {
    try {
      await deleteAddress(addressId);
      fetchCustomers();
    } catch {
      alert("Failed to delete address");
    }
  };

  const handleEditCustomer = async (customerId, updatedCustomer) => {
    try {
      await updateCustomer(customerId, updatedCustomer);
      fetchCustomers();
    } catch {
      alert("Failed to edit customer");
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomer(customerId);
      fetchCustomers();
    } catch {
      alert("Failed to delete customer");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow"
        onClick={() => history.push("/newCustomer")}
      >
        + Add Customer
      </button>

      {customers.length === 0 ? (
        <p className="text-gray-500 italic">No customers found.</p>
      ) : (
        <CustomerList
          customers={customers}
          onAddAddress={handleAddAddress}
          onEditAddress={handleEditAddress}
          onDeleteAddress={handleDeleteAddress}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}
    </div>
  );
}
