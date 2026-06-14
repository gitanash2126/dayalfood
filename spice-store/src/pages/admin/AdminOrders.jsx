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
  CalendarDays,
  CreditCard
} from "lucide-react";
import toast from "react-hot-toast";
import { getProductImage } from "../../utils/productImages";

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
      setOrders(data.data?.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      const toastId = toast.loading("Updating status...");
      await API.put(`/orders/${id}/status`, {
        status: status,
      });
      toast.success("Order Status Updated", { id: toastId });
      fetchOrders();
    } catch (error) {
      console.log(error);
      toast.error("Update Failed");
    }
  };

  // STATUS BADGE
  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "Processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // STATUS ICON
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <CheckCircle size={18} />;
      case "Cancelled": return <XCircle size={18} />;
      case "Processing": return <Clock3 size={18} />;
      case "Shipped": return <Truck size={18} />;
      default: return <PackageCheck size={18} />;
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4e8]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-[#f8f4e8] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-dark tracking-tight">Order Management</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage all customer orders & fulfillment</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-2xl">
          <PackageCheck className="text-primary w-8 h-8" />
        </div>
      </div>

      {/* EMPTY */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-[32px] shadow-lg p-20 text-center border border-gray-100">
          <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageCheck size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-dark mb-3">No Orders Yet</h2>
          <p className="text-gray-500 text-lg">Orders will appear here once customers place purchases.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
              {/* TOP HEADER */}
              <div className="bg-gray-50/50 p-8 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary">
                      <User size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-dark">{order.user?.name || "Guest Customer"}</h2>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><CalendarDays size={16}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="hidden sm:block text-gray-300">•</span>
                    <span>{order.user?.email || "No Email"}</span>
                    <span className="hidden sm:block text-gray-300">•</span>
                    <span>{order.user?.phone || order.shippingAddress?.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="text-center px-4 border-r border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                    <p className="text-2xl font-black text-primary">₹{order.totalPrice}</p>
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Payment</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                        order.paymentStatus === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                      <CreditCard size={14} />
                      {order.paymentStatus}
                    </span>
                    {order.transactionId && (
                      <p className="text-[10px] text-gray-500 font-bold mt-2 bg-gray-100 px-2 py-1 rounded-md">
                        UTR: {order.transactionId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 grid lg:grid-cols-3 gap-10">
                {/* LEFT COL: ITEMS */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-lg font-bold text-dark flex items-center gap-2 border-b pb-3">
                    Order Items <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-sm">{order.orderItems?.length || 0}</span>
                  </h3>
                  <div className="space-y-4">
                    {order.orderItems?.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <img
                          src={getProductImage(item.name, item.imageUrl || item.image || item.product?.image)}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover bg-white border border-gray-200"
                          onError={(e) => {
                            e.target.src = "/images/no-image.png";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-dark">{item.name}</h4>
                          <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-lg">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT COL: SHIPPING & ACTION */}
                <div className="space-y-8">
                  {/* SHIPPING */}
                  <div>
                    <h3 className="text-lg font-bold text-dark flex items-center gap-2 border-b pb-3 mb-4">
                      <MapPin size={18} className="text-primary" /> Shipping Details
                    </h3>
                    <div className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100/50">
                      <p className="font-bold text-dark mb-1">{order.shippingAddress?.fullName}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {order.shippingAddress?.address}<br/>
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Manage Order</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Current Status:</span>
                        <span className={`border inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-bold ${getStatusBadge(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        </span>
                      </div>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <label className="block text-sm font-bold text-dark mb-2">Update Status</label>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 font-semibold text-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
