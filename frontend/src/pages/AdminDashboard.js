import React, { useState } from "react";

const AdminDashboard = () => {
  // Dummy user data
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", role: "User", status: "Active" },
    { id: 2, name: "Bob", role: "Member", status: "Active" },
    { id: 3, name: "Charlie", role: "User", status: "Suspended" },
    { id: 4, name: "David", role: "Member", status: "Active" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Search Functionality
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Promote User to Member
  const promoteUser = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id && user.role === "User" ? { ...user, role: "Member" } : user
      )
    );
  };

  // Demote Member to User
  const demoteMember = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id && user.role === "Member" ? { ...user, role: "User" } : user
      )
    );
  };

  // Suspend User/Member
  const suspendUser = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "Suspended" } : user
      )
    );
  };

  // Delete User
  const deleteUser = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="text-lg text-gray-400 mt-2">Manage Users & Members</p>

      {/* Search Users */}
      <input
        type="text"
        placeholder="🔍 Search user..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-lg px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 mt-6"
      />

      {/* User Table */}
      <div className="w-full max-w-4xl mt-6">
        <table className="w-full bg-gray-800 text-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className={`py-3 px-4 ${user.status === "Suspended" ? "text-red-500" : "text-green-500"}`}>
                  {user.status}
                </td>
                <td className="py-3 px-4 flex gap-2">
                  {user.role === "User" && (
                    <button onClick={() => promoteUser(user.id)} className="bg-green-500 px-3 py-2 rounded">
                      Promote
                    </button>
                  )}
                  {user.role === "Member" && (
                    <button onClick={() => demoteMember(user.id)} className="bg-yellow-500 px-3 py-2 rounded">
                      Demote
                    </button>
                  )}
                  <button onClick={() => suspendUser(user.id)} className="bg-gray-500 px-3 py-2 rounded">
                    Suspend
                  </button>
                  <button onClick={() => deleteUser(user.id)} className="bg-red-500 px-3 py-2 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-3 text-gray-400">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
