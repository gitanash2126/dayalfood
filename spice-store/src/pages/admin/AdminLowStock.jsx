import { useEffect, useState } from "react";

import API from "../../api/axios";

import { AlertTriangle, Package } from "lucide-react";

export default function AdminLowStock() {
  // STATES
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // FETCH LOW STOCK
  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const { data } = await API.get("/admin/low-stock-products");

      console.log(data);

      setProducts(data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE STOCK
  const updateStock = async (id, stock) => {
    try {
      await API.put(`/products/${id}/stock`, {
        stock: Number(stock),
      });

      alert("Stock Updated");

      fetchLowStock();
    } catch (error) {
      console.log(error);

      alert("Stock Update Failed");
    }
  };

  // LOADING
  if (loading) {
    return <div className="text-3xl font-bold">Loading...</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <AlertTriangle size={40} className="text-red-500" />

        <div>
          <h1 className="font-heading text-5xl">Low Stock Products</h1>

          <p className="text-gray-500 mt-2">
            Manage inventory before products go out of stock
          </p>
        </div>
      </div>

      {/* EMPTY */}
      {products.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
          <Package size={60} className="mx-auto text-green-500" />

          <h2 className="text-3xl font-bold mt-6">No Low Stock Products</h2>

          <p className="text-gray-500 mt-3">Inventory looks healthy 🚀</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg p-8 overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">Product</th>

                <th className="text-left py-4">Category</th>

                <th className="text-left py-4">Current Stock</th>

                <th className="text-left py-4">Status</th>

                <th className="text-left py-4">Update Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b">
                  {/* PRODUCT */}
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.image || "https://via.placeholder.com/80"}
                        alt={product.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />

                      <div>
                        <h3 className="font-semibold text-lg">
                          {product.name}
                        </h3>

                        <p className="text-primary font-bold mt-1">
                          ₹{product.price}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="py-5">{product.category}</td>

                  {/* STOCK */}
                  <td className="py-5">
                    <span className="text-red-500 font-bold text-xl">
                      {product.stock}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="py-5">
                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Low Stock
                    </span>
                  </td>

                  {/* UPDATE */}
                  <td className="py-5">
                    <div className="flex gap-3">
                      <input
                        type="number"
                        min="0"
                        placeholder="New Stock"
                        className="border rounded-xl px-4 py-2 w-[120px]"
                        id={`stock-${product._id}`}
                      />

                      <button
                        onClick={() => {
                          const value = document.getElementById(
                            `stock-${product._id}`,
                          ).value;

                          updateStock(product._id, value);
                        }}
                        className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-xl transition"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
