import {
  Users,
  ShoppingBag,
  PackageCheck,
  IndianRupee,
  AlertTriangle,
  Clock3,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import API from "../../api/axios";
import { productImages, getProductImage } from "../../utils/productImages";

export default function AdminDashboard() {
  // STATES
  const [stats, setStats] = useState(null);

  const [analytics, setAnalytics] = useState(null);

  const [recentOrders, setRecentOrders] = useState([]);

  const [lowStock, setLowStock] = useState([]);

  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    fetchDashboard();
  }, []);


  const fetchDashboard = async () => {
    try {
      const [statsRes, ordersRes, lowStockRes, analyticsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/recent-orders"),
        API.get("/admin/low-stock-products"),
        API.get("/admin/analytics")
      ]);

      setStats(statsRes.data.data);
      setRecentOrders(ordersRes.data.data || []);
      setLowStock(lowStockRes.data.data || []);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-14">
        <div>
          <h1 className="font-heading text-5xl">Admin Dashboard</h1>

          <p className="text-gray-500 mt-3 text-lg">
            Manage your ecommerce business professionally 🚀
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/products"
            className="bg-primary hover:bg-secondary text-white px-6 py-4 rounded-2xl font-semibold transition shadow-lg"
          >
            Manage Products
          </Link>

          <Link
            to="/admin/orders"
            className="bg-dark hover:bg-black text-white px-6 py-4 rounded-2xl font-semibold transition shadow-lg"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* MAIN STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* USERS */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-lg">Total Users</p>

              <h2 className="text-5xl font-bold mt-4">{stats?.totalUsers}</h2>
            </div>

            <div className="bg-blue-100 p-4 rounded-2xl">
              <Users size={35} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-lg">Products</p>

              <h2 className="text-5xl font-bold mt-4">
                {stats?.totalProducts}
              </h2>
            </div>

            <div className="bg-yellow-100 p-4 rounded-2xl">
              <ShoppingBag size={35} className="text-yellow-600" />
            </div>
          </div>
        </div>

        {/* ORDERS */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-lg">Orders</p>

              <h2 className="text-5xl font-bold mt-4">{stats?.totalOrders}</h2>
            </div>

            <div className="bg-green-100 p-4 rounded-2xl">
              <PackageCheck size={35} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* REVENUE */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-lg">Revenue</p>

              <h2 className="text-5xl font-bold mt-4 text-primary">
                ₹{stats?.totalRevenue}
              </h2>
            </div>

            <div className="bg-red-100 p-4 rounded-2xl">
              <IndianRupee size={35} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* EXTRA STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* PENDING */}
        <div className="bg-yellow-100 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Pending Orders</h2>

              <p className="text-5xl font-bold mt-4">{stats?.pendingOrders}</p>
            </div>

            <Clock3 size={40} className="text-yellow-700" />
          </div>
        </div>

        {/* DELIVERED */}
        <div className="bg-green-100 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Delivered</h2>

              <p className="text-5xl font-bold mt-4">
                {stats?.deliveredOrders}
              </p>
            </div>

            <CheckCircle size={40} className="text-green-700" />
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="bg-red-100 rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Low Stock</h2>

              <p className="text-5xl font-bold mt-4">
                {stats?.lowStockProducts}
              </p>
            </div>

            <AlertTriangle size={40} className="text-red-700" />
          </div>
        </div>
      </div>

      {/* SALES CHART */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">
        <h2 className="text-3xl font-bold mb-10">Monthly Sales</h2>

        <div className="h-[400px] w-full min-h-[400px]">
          {analytics?.monthlySales && analytics.monthlySales.length > 0 ? (
            <ResponsiveContainer width="99%" height="100%" minHeight={400}>
              <BarChart
                data={analytics.monthlySales.map((item) => ({
                  month: `Month ${item._id.month}`,
                  sales: item.totalSales,
                }))}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-500 font-medium">
               No sales data available for the chart.
             </div>
          )}
        </div>
      </div>

      {/* RECENT ORDERS + LOW STOCK */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-12">
        {/* RECENT ORDERS */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recent Orders</h2>

            <Link
              to="/admin/orders"
              className="text-primary font-semibold flex items-center gap-2"
            >
              View All
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="space-y-5">
            {recentOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between bg-[#f8f4e8] rounded-2xl p-5"
              >
                <div>
                  <h3 className="font-bold text-lg">{order.user?.name}</h3>

                  <p className="text-gray-500 mt-1">{order.user?.email}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-primary text-xl">
                    ₹{order.totalPrice}
                  </p>

                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold mt-2 bg-yellow-100 text-yellow-700">
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LOW STOCK */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Low Stock Alerts</h2>
          </div>

          <div className="space-y-5">
            {lowStock.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                All products are fully stocked!
              </div>
            ) : (
              lowStock.slice(0, 5).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between bg-[#f8f4e8] rounded-2xl p-5"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getProductImage(product.name, product.image)}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-white"
                      onError={(e) => { e.target.src = "/images/no-image.png"; }}
                    />

                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>

                      <p className="text-gray-500 mt-1">₹{product.price}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-red-500 font-bold text-2xl">
                      {product.stock}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">Remaining</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mt-12">
        <h2 className="text-3xl font-bold mb-10">Top Products</h2>

        <div className="space-y-5">
          {analytics?.topProducts?.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between bg-[#f8f4e8] rounded-2xl p-5"
            >
              <div className="flex items-center gap-5">
                <img
                  src={getProductImage(product.name, product.image)}
                  alt={product.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-white"
                  onError={(e) => { e.target.src = "/images/no-image.png"; }}
                />

                <div>
                  <h3 className="font-bold text-xl">{product.name}</h3>

                  <p className="text-gray-500 mt-2">₹{product.price}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {product.sold || 0}
                </p>

                <p className="text-gray-500">Sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
