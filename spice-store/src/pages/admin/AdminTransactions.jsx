import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  CreditCard,
  User,
  CalendarDays,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminTransactions() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Fetch orders (limit high enough to get recent transactions)
      const { data } = await API.get("/orders?limit=100");
      
      // Filter for online transactions
      const onlineOrders = (data.data?.orders || []).filter(
        (o) => o.paymentMethod === "Online"
      );
      
      setOrders(onlineOrders);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (id) => {
    try {
      const toastId = toast.loading("Verifying payment...");
      await API.put(`/orders/${id}/status`, {
        status: "Processing", // Or Paid if you added a payment status endpoint
      });
      // Optionally update payment status to paid if the endpoint existed
      toast.success("Payment Verified & Order Processing", { id: toastId });
      fetchTransactions();
    } catch (error) {
      console.log(error);
      toast.error("Verification Failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4e8]">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-[#f8f4e8] min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black text-dark tracking-tight">Online Transactions</h1>
          <p className="text-gray-500 mt-2 text-lg">Review and verify payment screenshots</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-2xl">
          <CreditCard className="text-primary w-8 h-8" />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[32px] shadow-lg p-20 text-center border border-gray-100">
          <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard size={40} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-dark mb-3">No Online Transactions</h2>
          <p className="text-gray-500 text-lg">Online payment records will appear here.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-dark flex items-center gap-2">
                      <User size={18} className="text-primary" /> 
                      {order.user?.name || order.shippingAddress?.fullName || "Guest"}
                    </h2>
                    <p className="text-gray-500 mt-1 flex items-center gap-1.5 text-sm">
                      <CalendarDays size={14}/> {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-400 uppercase">Amount</p>
                    <p className="text-2xl font-black text-primary">₹{order.totalPrice}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 font-medium"><span className="text-gray-400">Phone:</span> {order.shippingAddress?.phone}</p>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    <span className="text-gray-400">Address:</span> {order.shippingAddress?.address}, {order.shippingAddress?.city}
                  </p>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col items-center justify-center bg-gray-100/50">
                {order.paymentScreenshot ? (
                  <div className="text-center w-full">
                    <p className="text-sm font-bold text-gray-500 mb-3 flex items-center justify-center gap-2">
                      <ImageIcon size={16} /> Payment Screenshot
                    </p>
                    <a href={order.paymentScreenshot} target="_blank" rel="noreferrer">
                      <img 
                        src={order.paymentScreenshot} 
                        alt="Payment Proof" 
                        className="w-full max-h-[300px] object-contain rounded-xl border border-gray-200 shadow-sm hover:opacity-90 transition"
                      />
                    </a>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl w-full">
                    <p className="text-gray-500 font-medium">No screenshot uploaded</p>
                    {order.transactionId && (
                       <p className="text-sm mt-2 text-gray-600">UTR: {order.transactionId}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                {order.orderStatus === "Pending" ? (
                  <button 
                    onClick={() => verifyPayment(order._id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <CheckCircle size={20} /> Verify Payment
                  </button>
                ) : (
                  <div className="w-full bg-gray-100 text-gray-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle size={20} /> Verified ({order.orderStatus})
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
