import { useEffect, useState } from "react";

import API from "../../api/axios";

export default function AdminUsers() {
  // STATES
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  // FETCH USERS
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");

      console.log(data);

      setUsers(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE ROLE
  const updateRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, {
        role,
      });

      alert("Role Updated");

      fetchUsers();
    } catch (error) {
      console.log(error);

      alert("Role Update Failed");
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, isActive) => {
    try {
      await API.put(`/admin/users/${id}/status`, {
        isActive,
      });

      alert("Status Updated");

      fetchUsers();
    } catch (error) {
      console.log(error);

      alert("Status Update Failed");
    }
  };

  // LOADING
  if (loading) {
    return <div className="text-3xl font-bold">Loading Users...</div>;
  }

  return (
    <div>
      {/* TITLE */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-heading text-5xl">Users</h1>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-lg p-8 overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4">Name</th>

              <th className="text-left py-4">Phone</th>

              <th className="text-left py-4">Address</th>

              <th className="text-left py-4">Role</th>

              <th className="text-left py-4">Status</th>

              <th className="text-left py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b">
                {/* NAME */}
                <td className="py-5 font-semibold">{user.name}</td>

                {/* PHONE */}
                <td className="py-5">{user.phone || "N/A"}</td>

                {/* ADDRESS */}
                <td className="py-5">
                  {user.addresses && user.addresses.length > 0 ? (
                    <div className="text-sm">
                      <p>{user.addresses[0].address}</p>
                      <p className="text-gray-500 text-xs">{user.addresses[0].city}, {user.addresses[0].postalCode}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No Orders Yet</span>
                  )}
                </td>

                {/* ROLE */}
                <td className="py-5">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700"
                        : user.role === "shopkeeper"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* STATUS */}
                <td className="py-5">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Blocked"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="py-5 flex flex-wrap gap-3">
                  {/* ROLE */}
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user._id, e.target.value)}
                    className="border rounded-xl px-4 py-2"
                  >
                    <option value="user">User</option>

                    <option value="admin">Admin</option>

                    <option value="shopkeeper">Shopkeeper</option>
                  </select>

                  {/* STATUS */}
                  <button
                    onClick={() => updateStatus(user._id, !user.isActive)}
                    className={`px-5 py-2 rounded-xl text-white transition ${
                      user.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {user.isActive ? "Block" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
