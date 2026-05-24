import { useEffect, useState } from "react";

import {
  PackageCheck,
  Truck,
  MapPin,
  CreditCard,
  CalendarDays,
  XCircle,
} from "lucide-react";

import API from "../api/axios";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ORDERS
  // ==========================================
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/myorders");

      console.log("MY ORDERS:", data);

      setOrders(data.data || []);
    } catch (error) {
      console.log("ORDER ERROR:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CANCEL ORDER
  // ==========================================
  const cancelOrder = async (id) => {
    const confirmCancel = window.confirm("Cancel this order?");

    if (!confirmCancel) {
      return;
    }

    try {
      await API.put(`/orders/${id}/cancel`, {});

      alert("Order Cancelled");

      fetchOrders();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Cancel Failed");
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold bg-[#fffdf8]">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="bg-[#fffdf8] min-h-screen py-16">
      <div className="container-custom">
        {/* HEADER */}
        <div className="mb-14">
          <p className="text-primary font-semibold">Your Purchase History</p>

          <h1 className="font-heading text-5xl mt-3">My Orders</h1>
        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-[40px] shadow-xl p-16 text-center border border-orange-100">
            <PackageCheck size={70} className="mx-auto text-primary" />

            <h2 className="text-4xl font-bold mt-8">No Orders Found</h2>

            <p className="text-gray-500 mt-5 text-lg">
              Start shopping to place your first order.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[40px] shadow-xl border border-orange-100 overflow-hidden"
              >
                {/* TOP */}
                <div className="p-8 border-b border-orange-100">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                    {/* LEFT */}
                    <div>
                      <div className="flex items-center gap-3">
                        <PackageCheck size={28} className="text-primary" />

                        <h2 className="text-3xl font-bold">
                          Order #{order._id.slice(-6)}
                        </h2>
                      </div>

                      <div className="flex items-center gap-3 text-gray-500 mt-4">
                        <CalendarDays size={18} />

                        <span>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-wrap gap-4">
                      {/* PAYMENT */}
                      <span
                        className={`px-6 py-3 rounded-full text-sm font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>

                      {/* STATUS */}
                      <span
                        className={`px-6 py-3 rounded-full text-sm font-semibold ${
                          order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.orderStatus === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.orderStatus === "Shipped"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BODY */}
                <div className="p-8">
                  <div className="grid lg:grid-cols-3 gap-10">
                    {/* ITEMS */}
                    <div className="lg:col-span-2">
                      <h3 className="text-2xl font-bold mb-6">Order Items</h3>

                      <div className="space-y-5">
                        {order.orderItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-orange-100 rounded-3xl p-5"
                          >
                            {/* LEFT */}
                            <div className="flex items-center gap-5">
                              <img
                                src={
                                  item.imageUrl || item.product?.image
                                    ? (
                                        item.imageUrl || item.product?.image
                                      ).startsWith("/uploads")
                                      ? `http://localhost:5000${
                                          item.imageUrl || item.product?.image
                                        }`
                                      : item.imageUrl || item.product?.image
                                    : "https://via.placeholder.com/120"
                                }
                                alt={item.name}
                                className="w-24 h-24 rounded-3xl object-cover bg-[#fff8f1]"
                              />

                              <div>
                                <h4 className="text-xl font-semibold">
                                  {item.name}
                                </h4>

                                <p className="text-gray-500 mt-2">
                                  Quantity :
                                  <span className="font-semibold ml-2">
                                    {item.quantity}
                                  </span>
                                </p>

                                <p className="text-primary font-bold mt-2">
                                  ₹{item.price} each
                                </p>
                              </div>
                            </div>

                            {/* TOTAL */}
                            <div className="text-2xl font-bold text-primary">
                              ₹{item.price * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SUMMARY */}
                    <div>
                      <div className="bg-[#fff8f1] rounded-[32px] p-8 border border-orange-100 sticky top-28">
                        <h3 className="text-2xl font-bold mb-8">
                          Order Summary
                        </h3>

                        {/* TOTALS */}
                        <div className="space-y-5 border-b border-orange-200 pb-6">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Items</span>

                            <span className="font-semibold">
                              ₹{order.itemsPrice}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">Shipping</span>

                            <span className="font-semibold">
                              ₹{order.shippingPrice}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-gray-500">Tax</span>

                            <span className="font-semibold">
                              ₹{order.taxPrice}
                            </span>
                          </div>
                        </div>

                        {/* TOTAL */}
                        <div className="flex justify-between items-center mt-6">
                          <span className="text-2xl font-bold">Total</span>

                          <span className="text-3xl font-bold text-primary">
                            ₹{order.totalPrice}
                          </span>
                        </div>

                        {/* PAYMENT */}
                        <div className="mt-10">
                          <div className="flex items-center gap-3 mb-4">
                            <CreditCard size={22} className="text-primary" />

                            <h4 className="font-bold text-lg">Payment</h4>
                          </div>

                          <p className="text-gray-600">{order.paymentMethod}</p>
                        </div>

                        {/* ADDRESS */}
                        <div className="mt-10">
                          <div className="flex items-center gap-3 mb-4">
                            <MapPin size={22} className="text-primary" />

                            <h4 className="font-bold text-lg">
                              Shipping Address
                            </h4>
                          </div>

                          <div className="text-gray-600 leading-7">
                            <p>{order.shippingAddress?.fullName}</p>

                            <p>{order.shippingAddress?.address}</p>

                            <p>
                              {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.state}
                            </p>

                            <p>{order.shippingAddress?.postalCode}</p>

                            <p>{order.shippingAddress?.phone}</p>
                          </div>
                        </div>

                        {/* CANCEL */}
                        {order.orderStatus !== "Delivered" &&
                          order.orderStatus !== "Cancelled" && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="w-full mt-10 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-semibold transition flex items-center justify-center gap-3"
                            >
                              <XCircle size={22} />
                              Cancel Order
                            </button>
                          )}

                        {/* DELIVERY */}
                        {order.orderStatus === "Shipped" && (
                          <div className="mt-8 bg-blue-100 text-blue-700 p-4 rounded-2xl flex items-center gap-3">
                            <Truck size={22} />
                            Your order is on the way.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
