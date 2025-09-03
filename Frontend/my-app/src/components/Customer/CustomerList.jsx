import React, { useState } from "react";

export default function CustomerList({
  customers,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onEditCustomer,
  onDeleteCustomer
}) {
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editedAddress, setEditedAddress] = useState({});
  const [addingAddressCustomerId, setAddingAddressCustomerId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});

  // --- Address Handlers ---
  const handleEditAddressClick = (address) => {
    setEditingAddressId(address.addressId);
    setEditedAddress({ ...address });
  };

  const handleSaveAddressClick = async (customerId, addressId) => {
    await onEditAddress(customerId, addressId, editedAddress);
    setEditingAddressId(null);
  };

  const handleCancelClick = () => {
    setEditingAddressId(null);
    setEditedAddress({});
    setAddingAddressCustomerId(null);
    setNewAddress({ street: "", city: "", state: "", postalCode: "", country: "" });
    setEditingCustomerId(null);
    setEditedCustomer({});
  };

  const handleDeleteAddressClick = (customerId, addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      onDeleteAddress(customerId, addressId);
    }
  };

  const handleAddAddressClick = (customerId) => {
    setAddingAddressCustomerId(customerId);
  };

  const handleSaveNewAddress = async (customerId) => {
    await onAddAddress(customerId, newAddress);
    setAddingAddressCustomerId(null);
    setNewAddress({ street: "", city: "", state: "", postalCode: "", country: "" });
  };

  // --- Customer Handlers ---
  const handleEditCustomerClick = (customer) => {
    setEditingCustomerId(customer.customerId);
    setEditedCustomer({ ...customer });
  };

  const handleSaveCustomerClick = async (customerId) => {
    await onEditCustomer(customerId, editedCustomer);
    setEditingCustomerId(null);
  };

  const handleDeleteCustomerClick = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer and all their addresses?")) {
      onDeleteCustomer(customerId);
    }
  };

  return (
    <div>
      {customers.map((customer) => (
        <div key={customer.customerId} className="mb-6 border p-4 rounded shadow">
          {/* --- Customer Info --- */}
          {editingCustomerId === customer.customerId ? (
            <div className="flex flex-col md:flex-row md:gap-2 items-start mb-2">
              <input
                type="text"
                placeholder="First Name"
                value={editedCustomer.firstName}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, firstName: e.target.value })}
                className="border p-1 rounded"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={editedCustomer.lastName}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, lastName: e.target.value })}
                className="border p-1 rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={editedCustomer.email}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                className="border p-1 rounded"
              />
              <input
                type="text"
                placeholder="Phone"
                value={editedCustomer.phone}
                onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                className="border p-1 rounded"
              />
              <div className="flex gap-2 mt-1 md:mt-0">
                <button
                  onClick={() => handleSaveCustomerClick(customer.customerId)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-bold text-lg">{customer.firstName} {customer.lastName}</h2>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCustomerClick(customer)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit Customer
                </button>
                <button
                  onClick={() => handleDeleteCustomerClick(customer.customerId)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete Customer
                </button>
              </div>
            </div>
          )}

          {/* --- Addresses --- */}
          <h3 className="mt-4 font-semibold">Addresses:</h3>
          <ul>
            {customer.addresses.map((address) => (
              <li key={address.addressId} className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between border-b pb-2">
                {editingAddressId === address.addressId ? (
                  <div className="flex flex-col md:flex-row md:gap-2 w-full">
                    <input
                      type="text"
                      placeholder="Street"
                      value={editedAddress.street}
                      onChange={(e) => setEditedAddress({ ...editedAddress, street: e.target.value })}
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={editedAddress.city}
                      onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={editedAddress.state}
                      onChange={(e) => setEditedAddress({ ...editedAddress, state: e.target.value })}
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={editedAddress.postalCode}
                      onChange={(e) => setEditedAddress({ ...editedAddress, postalCode: e.target.value })}
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={editedAddress.country}
                      onChange={(e) => setEditedAddress({ ...editedAddress, country: e.target.value })}
                      className="border p-1 rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <p>{address.street}, {address.city}, {address.state}, {address.postalCode}, {address.country}</p>
                  </div>
                )}

                <div className="mt-2 md:mt-0 flex gap-2">
                  {editingAddressId === address.addressId ? (
                    <>
                      <button
                        onClick={() => handleSaveAddressClick(customer.customerId, address.addressId)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelClick}
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditAddressClick(address)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddressClick(customer.customerId, address.addressId)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* --- Add Address --- */}
          {addingAddressCustomerId === customer.customerId ? (
            <div className="mt-2 flex flex-col md:flex-row md:gap-2">
              <input
                type="text"
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="border p-1 rounded"
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="border p-1 rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="border p-1 rounded"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                className="border p-1 rounded"
              />
              <input
                type="text"
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                className="border p-1 rounded"
              />
              <button
                onClick={() => handleSaveNewAddress(customer.customerId)}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancelClick}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAddAddressClick(customer.customerId)}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
            >
              + Add Address
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
