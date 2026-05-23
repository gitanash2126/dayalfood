import { useEffect, useState } from "react";

import API from "../../api/axios";

import {
  PackageCheck,
  Truck,
  CheckCircle,
  XCircle,
  Clock3,
  User,
  MapPin,
} from "lucide-react";

export default function AdminOrders() {
  // STATES
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // FETCH ORDERS
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");

      console.log(data);

      setOrders(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/status`, {
        orderStatus: status,
      });

      alert("Order Status Updated");

      fetchOrders();
    } catch (error) {
      console.log(error);

      alert("Update Failed");
    }
  };

  // STATUS BADGE
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Processing":
        return "bg-yellow-100 text-yellow-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // STATUS ICON
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={18} />;

      case "Cancelled":
        return <XCircle size={18} />;

      case "Processing":
        return <Clock3 size={18} />;

      case "Shipped":
        return <Truck size={18} />;

      default:
        return <PackageCheck size={18} />;
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading Orders...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading text-5xl">Order Management</h1>

          <p className="text-gray-500 mt-3">
            Manage all customer orders & shipping
          </p>
        </div>
      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
          <PackageCheck size={60} className="mx-auto text-primary" />

          <h2 className="text-3xl font-bold mt-6">No Orders Yet</h2>

          <p className="text-gray-500 mt-3">
            Orders will appear here once customers place purchases.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-3xl shadow-lg p-8">
              {/* TOP */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b pb-6">
                {/* CUSTOMER */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User size={20} className="text-primary" />

                    <h2 className="text-2xl font-bold">{order.user?.name}</h2>
                  </div>

                  <p className="text-gray-500">{order.user?.email}</p>

                  <p className="text-gray-500 mt-1">{order.user?.phone}</p>
                </div>

                {/* ORDER INFO */}
                <div className="grid md:grid-cols-3 gap-5">
                  {/* TOTAL */}
                  <div className="bg-[#f8f4e8] px-6 py-4 rounded-2xl">
                    <p className="text-gray-500 text-sm">Total Amount</p>

                    <h3 className="text-2xl font-bold text-primary mt-2">
                      ₹{order.totalPrice}
                    </h3>
                  </div>

                  {/* PAYMENT */}
                  <div className="bg-[#f8f4e8] px-6 py-4 rounded-2xl">
                    <p className="text-gray-500 text-sm">Payment</p>

                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mt-2 ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* DATE */}
                  <div className="bg-[#f8f4e8] px-6 py-4 rounded-2xl">
                    <p className="text-gray-500 text-sm">Order Date</p>

                    <h3 className="font-bold mt-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </h3>
                  </div>
                </div>
              </div>

              {/* SHIPPING */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={20} className="text-primary" />

                  <h3 className="text-xl font-bold">Shipping Address</h3>
                </div>

                <div className="bg-[#f8f4e8] rounded-2xl p-5 text-gray-700 leading-8">
                  <p>{order.shippingAddress?.fullName}</p>

                  <p>{order.shippingAddress?.phone}</p>

                  <p>{order.shippingAddress?.address}</p>

                  <p>
                    {order.shippingAddress?.city},{" "}
                    {order.shippingAddress?.state}
                  </p>

                  <p>{order.shippingAddress?.postalCode}</p>
                </div>
              </div>

              {/* ORDER ITEMS */}
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-5">Order Items</h3>

                <div className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#f8f4e8] rounded-2xl p-5"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            item.imageUrl || "https://via.placeholder.com/80"
                          }
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />

                        <div>
                          <h4 className="font-bold text-lg">{item.name}</h4>

                          <p className="text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-primary text-xl">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM */}
              <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                {/* STATUS */}
                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold ${getStatusBadge(
                      order.orderStatus,
                    )}`}
                  >
                    {getStatusIcon(order.orderStatus)}

                    {order.orderStatus}
                  </span>
                </div>

                {/* UPDATE */}
                <div className="flex items-center gap-4">
                  <p className="font-semibold">Update Status:</p>

                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded-2xl px-5 py-3"
                  >
                    <option value="Pending">Pending</option>

                    <option value="Confirmed">Confirmed</option>

                    <option value="Processing">Processing</option>

                    <option value="Shipped">Shipped</option>

                    <option value="Delivered">Delivered</option>

                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
