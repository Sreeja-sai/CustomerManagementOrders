import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Welcome to Qwipo CRM</h2>
        <p className="text-lg mb-6">
          Manage Customers, Orders, and Products in one place.
        </p>
        <Link
          to="/customers"
          className="px-6 py-3 bg-white text-blue-600 rounded-lg shadow-md hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-gray-500">Total Customers</h3>
          <p className="text-2xl font-bold text-blue-600">120</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-gray-500">Active Orders</h3>
          <p className="text-2xl font-bold text-green-600">35</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-gray-500">Products</h3>
          <p className="text-2xl font-bold text-purple-600">58</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold text-indigo-600">₹2.3L</p>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-4">John Doe</td>
                <td className="p-4 text-green-600">Completed</td>
                <td className="p-4">2025-08-30</td>
                <td className="p-4">₹5,200</td>
              </tr>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-4">Alice Smith</td>
                <td className="p-4 text-yellow-600">Pending</td>
                <td className="p-4">2025-08-29</td>
                <td className="p-4">₹2,800</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 text-gray-600 text-sm">
        © 2025 Qwipo CRM. Built with React & Node.js
      </footer>
    </div>
  );
}
