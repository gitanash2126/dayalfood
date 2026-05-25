import { useEffect, useState } from "react";

import API from "../../api/axios";

import { Pencil, Trash2, Plus, ImageIcon } from "lucide-react";

export default function AdminProducts() {
  // =====================================
  // STATES
  // =====================================
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);

  const [preview, setPreview] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // =====================================
  // FORM DATA
  // =====================================
  const [formData, setFormData] = useState({
    name: "",

    price: "",

    stock: "",

    category: "",

    brand: "",

    weight: "",

    description: "",

    image: null,
  });

  // =====================================
  // FETCH PRODUCTS
  // =====================================
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

  // =====================================
  // HANDLE INPUT
  // =====================================
  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // HANDLE IMAGE
  // =====================================
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

  // =====================================
  // RESET FORM
  // =====================================
  const resetForm = () => {
    setEditId(null);

    setPreview("");

    setFormData({
      name: "",

      price: "",

      stock: "",

      category: "",

      brand: "",

      weight: "",

      description: "",

      image: null,
    });
  };

  // =====================================
  // SUBMIT
  // =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const productData = new FormData();

      productData.append("name", formData.name);

      productData.append("price", formData.price);

      productData.append("stock", formData.stock);

      productData.append("category", formData.category);

      productData.append("brand", formData.brand);

      productData.append("weight", formData.weight);

      productData.append("description", formData.description);

      // =====================================
      // IMAGE
      // =====================================
      if (formData.image) {
        productData.append("image", formData.image);
      }

      // =====================================
      // UPDATE PRODUCT
      // =====================================
      if (editId) {
        await API.put(`/products/${editId}`, productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Product Updated Successfully");
      }

      // =====================================
      // CREATE PRODUCT
      // =====================================
      else {
        await API.post("/products", productData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert("Product Added Successfully");
      }

      // RESET
      resetForm();

      fetchProducts();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Operation Failed");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // EDIT PRODUCT
  // =====================================
  const handleEdit = (product) => {
    setEditId(product._id);

    setPreview(product.image || "");

    setFormData({
      name: product.name || "",

      price: product.price || "",

      stock: product.stock || "",

      category:
        typeof product.category === "object"
          ? product.category?.name
          : product.category || "",

      brand: product.brand || "",

      weight: product.weight || "",

      description: product.description || "",

      image: null,
    });

    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  };

  // =====================================
  // DELETE PRODUCT
  // =====================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/products/${id}`);

      alert("Product Deleted Successfully");

      fetchProducts();
    } catch (error) {
      console.log(error);

      alert("Delete Failed");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#f8f4e8] min-h-screen">
      {/* TITLE */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-dark">Product Management</h1>

        <p className="text-gray-500 mt-2">Manage your ecommerce products</p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-[30px] shadow-lg p-8 border border-orange-100">
        <h2 className="text-3xl font-bold flex items-center gap-3 mb-8">
          <Plus />

          {editId ? "Update Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary"
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary"
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary"
            />

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={formData.brand}
              onChange={handleChange}
              className="border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary"
            />

            <input
              type="text"
              name="weight"
              placeholder="50g / 100g / 1kg"
              value={formData.weight}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary"
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="border-2 border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition bg-[#fffaf5]">
              <ImageIcon size={60} className="text-primary mb-4" />

              <p className="text-gray-500">Upload Product Image</p>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>

            {/* PREVIEW */}
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover rounded-3xl mt-6 border"
              />
            )}
          </div>

          {/* DESCRIPTION */}
          <textarea
            rows="5"
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary"
          />

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-2xl font-semibold transition disabled:opacity-70"
            >
              {submitting
                ? "Please Wait..."
                : editId
                  ? "Update Product"
                  : "Add Product"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 px-8 py-4 rounded-2xl font-semibold transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCTS */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-8">All Products</h2>

        {loading ? (
          <div className="text-xl font-semibold">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-[28px] shadow-lg border border-orange-100 overflow-hidden"
              >
                <img
                  src={product.image || "/images/no-image.png"}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = "/images/no-image.png";
                  }}
                />

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-dark">
                    {product.name}
                  </h3>

                  <p className="text-primary font-semibold mt-2">
                    ₹{product.price}
                  </p>

                  <p className="text-gray-500 mt-2">{product.weight}</p>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
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
