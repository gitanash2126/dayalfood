import { useEffect, useState } from "react";

import API from "../../api/axios";

import { Pencil, Trash2, Plus, ImageIcon } from "lucide-react";

export default function AdminProducts() {
  // PRODUCTS
  const [products, setProducts] = useState([]);

  // LOADING
  const [loading, setLoading] = useState(true);

  // EDIT MODE
  const [editId, setEditId] = useState(null);

  // IMAGE PREVIEW
  const [preview, setPreview] = useState("");

  // FORM STATES
  const [formData, setFormData] = useState({
    name: "",

    price: "",

    mrp: "",

    stock: "",

    category: "",

    brand: "",

    unit: "",

    weight: "",

    description: "",

    image: null,
  });

  // FETCH PRODUCTS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products");

      setProducts(data.products || data.data?.products || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,

        image: file,
      });

      setPreview(URL.createObjectURL(file));
    }
  };

  // RESET FORM
  const resetForm = () => {
    setEditId(null);

    setPreview("");

    setFormData({
      name: "",

      price: "",

      mrp: "",

      stock: "",

      category: "",

      brand: "",

      unit: "",

      weight: "",

      description: "",

      image: null,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();

      // APPEND DATA
      productData.append("name", formData.name);

      productData.append("price", formData.price);

      productData.append("mrp", formData.mrp);

      productData.append("stock", formData.stock);

      productData.append("category", formData.category);

      productData.append("brand", formData.brand);

      productData.append("unit", formData.unit);

      productData.append("weight", formData.weight);

      productData.append("description", formData.description);

      // IMAGE
      if (formData.image) {
        productData.append("image", formData.image);
      }

      // UPDATE
      if (editId) {
        await API.put(`/products/${editId}`, productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Product Updated Successfully");
      }

      // CREATE
      else {
        await API.post("/products", productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Product Added Successfully");
      }

      resetForm();

      fetchProducts();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Operation Failed");
    }
  };

  // EDIT
  const handleEdit = (product) => {
    setEditId(product._id);

    setPreview(product.image);

    setFormData({
      name: product.name || "",

      price: product.price || "",

      mrp: product.mrp || "",

      stock: product.stock || "",

      category:
        typeof product.category === "object"
          ? product.category?.name
          : product.category,

      brand: product.brand || "",

      unit: product.unit || "",

      weight: product.weight || "",

      description: product.description || "",

      image: null,
    });

    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/products/${id}`);

      alert("Product Deleted");

      fetchProducts();
    } catch (error) {
      console.log(error);

      alert("Delete Failed");
    }
  };

  // LOADING
  if (loading) {
    return <div className="text-3xl font-bold">Loading...</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading text-5xl">Product Management</h1>

          <p className="text-gray-500 mt-3">Manage your ecommerce products</p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-14">
        <div className="flex items-center gap-3 mb-8">
          <Plus size={28} />

          <h2 className="text-3xl font-bold">
            {editId ? "Edit Product" : "Add Product"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* NAME */}
          <div>
            <label className="block mb-2 font-medium">Product Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="block mb-2 font-medium">Price</label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
              required
            />
          </div>

          {/* MRP */}
          <div>
            <label className="block mb-2 font-medium">MRP</label>

            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
            />
          </div>

          {/* STOCK */}
          <div>
            <label className="block mb-2 font-medium">Stock</label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-2 font-medium">Category</label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
              required
            />
          </div>

          {/* BRAND */}
          <div>
            <label className="block mb-2 font-medium">Brand</label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
            />
          </div>

          {/* UNIT */}
          <div>
            <label className="block mb-2 font-medium">Unit</label>

            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
            />
          </div>

          {/* WEIGHT */}
          <div>
            <label className="block mb-2 font-medium">Weight</label>

            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
            />
          </div>

          {/* IMAGE */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Product Image</label>

            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
              <ImageIcon size={45} className="mx-auto text-gray-400 mb-4" />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />

              <p className="text-gray-500 mt-3">
                Upload product image from gallery
              </p>
            </div>
          </div>

          {/* PREVIEW */}
          {preview && (
            <div className="md:col-span-2">
              <img
                src={preview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-3xl border shadow-md"
              />
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Description</label>

            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-2xl px-5 py-4"
              required
            />
          </div>

          {/* BUTTONS */}
          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-semibold transition"
            >
              {editId ? "Update Product" : "Add Product"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 px-8 py-4 rounded-2xl font-semibold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-3xl shadow-lg p-8 overflow-x-auto">
        <h2 className="text-3xl font-bold mb-8">All Products</h2>

        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-4">Image</th>

              <th className="text-left py-4">Product</th>

              <th className="text-left py-4">Price</th>

              <th className="text-left py-4">Stock</th>

              <th className="text-left py-4">Category</th>

              <th className="text-left py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                {/* IMAGE */}
                <td className="py-5">
                  <img
                    src={
                      product.image
                        ? `http://localhost:5000${product.image}`
                        : "https://via.placeholder.com/80"
                    }
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                </td>

                {/* NAME */}
                <td className="py-5 font-semibold">{product.name}</td>

                {/* PRICE */}
                <td className="py-5 font-bold text-primary">
                  ₹{product.price}
                </td>

                {/* STOCK */}
                <td className="py-5">{product.stock}</td>

                {/* CATEGORY */}
                <td className="py-5">
                  {typeof product.category === "object"
                    ? product.category?.name
                    : product.category}
                </td>

                {/* ACTIONS */}
                <td className="py-5 flex gap-3">
                  {/* EDIT */}
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition"
                  >
                    <Trash2 size={18} />
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
