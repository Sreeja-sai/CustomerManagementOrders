// src/components/Customer/CustomerForm.jsx
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function CustomerForm() {
  const history = useHistory();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addresses: [
      { street: "", city: "", state: "", postalCode: "", country: "" }
    ]
  });

  // Handle customer fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle address fields
  const handleAddressChange = (index, e) => {
    const updatedAddresses = [...form.addresses];
    updatedAddresses[index][e.target.name] = e.target.value;
    setForm({ ...form, addresses: updatedAddresses });
  };

  // Add another address block
  const handleAddAddressField = () => {
    setForm({
      ...form,
      addresses: [
        ...form.addresses,
        { street: "", city: "", state: "", postalCode: "", country: "" }
      ]
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure at least one address is provided
    if (form.addresses.length === 0) {
      alert("Please add at least one address before saving.");
      return;
    }

    const customerData = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      addresses: form.addresses.map((addr) => ({
        street: addr.street,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      })),
    };

    try {
      const response = await fetch("http://localhost:3000/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        alert("Customer saved successfully!");
        history.push("/"); // redirect to list page
      } else {
        const errorData = await response.json();
        alert(`Failed to save customer: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Failed to save customer due to network/server issue.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">Add New Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <h2 className="font-semibold mt-4">Address</h2>
        {form.addresses.map((addr, index) => (
          <div key={index} className="space-y-2 border p-3 rounded mb-2">
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={addr.street}
              onChange={(e) => handleAddressChange(index, e)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={addr.city}
              onChange={(e) => handleAddressChange(index, e)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={addr.state}
              onChange={(e) => handleAddressChange(index, e)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={addr.postalCode}
              onChange={(e) => handleAddressChange(index, e)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={addr.country}
              onChange={(e) => handleAddressChange(index, e)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddAddressField}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          + Add Another Address
        </button>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded mt-4"
        >
          Save Customer
        </button>
      </form>
    </div>
  );
}
