import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Pencil, Trash2, Plus, ImageIcon, PackageSearch } from "lucide-react";
import toast from "react-hot-toast";
import { productImages, getProductImage } from "../../utils/productImages";

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
    hindiName: "",
    category: "",
    brand: "",
    description: "",
    image: null,
    variants: [{ weight: "", price: "", stock: "" }],
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
      toast.error("Failed to fetch products");
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

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { weight: "", price: "", stock: "" }],
    });
  };

  const removeVariant = (index) => {
    if (formData.variants.length > 1) {
      const newVariants = formData.variants.filter((_, i) => i !== index);
      setFormData({ ...formData, variants: newVariants });
    } else {
      toast.error("At least one variant is required");
    }
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
      hindiName: "",
      category: "",
      brand: "",
      description: "",
      image: null,
      variants: [{ weight: "", price: "", stock: "" }],
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
      productData.append("hindiName", formData.hindiName);
      productData.append("category", formData.category);
      productData.append("brand", formData.brand);
      productData.append("description", formData.description);
      
      // Append variants as JSON string
      productData.append("variants", JSON.stringify(formData.variants));

      if (formData.image) {
        productData.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/products/${editId}`, productData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product Updated Successfully");
      } else {
        await API.post("/products", productData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product Added Successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Operation Failed");
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // EDIT PRODUCT
  // =====================================
  const handleEdit = (product) => {
    setEditId(product._id);
    setPreview(getProductImage(product.name, product.image));
    
    // Set variants if they exist, otherwise fallback to root fields
    let initialVariants = product.variants && product.variants.length > 0 
      ? product.variants 
      : [{ weight: product.weight || "", price: product.price || "", stock: product.stock || "" }];

    setFormData({
      name: product.name || "",
      hindiName: product.hindiName || "",
      category: typeof product.category === "object" ? product.category?.name : product.category || "",
      brand: product.brand || "",
      description: product.description || "",
      image: null,
      variants: initialVariants,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =====================================
  // DELETE PRODUCT
  // =====================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);
      toast.success("Product Deleted Successfully");
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#f8f4e8] min-h-screen">
      {/* TITLE */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-dark tracking-tight">Product Management</h1>
          <p className="text-gray-500 mt-2 text-lg">Add, update, or remove your products</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-2xl">
          <PackageSearch className="text-primary w-8 h-8" />
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-[32px] shadow-xl p-8 lg:p-10 border border-orange-100/50">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-dark">
          <div className="bg-orange-50 p-2.5 rounded-xl">
            <Plus className="text-primary w-6 h-6" />
          </div>
          {editId ? "Update Existing Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="e.g. Shah Jeera" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hindi Name</label>
              <input type="text" name="hindiName" value={formData.hindiName} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="e.g. शाह जीरा" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="e.g. Whole Spices" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Brand (Optional)</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="e.g. Amrit Dayal" />
            </div>
          </div>

          {/* VARIANTS (PACK SIZES) */}
          <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100/50">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-base font-bold text-dark">Product Variants (Pack Sizes)</label>
              <button type="button" onClick={addVariant} className="flex items-center gap-1.5 text-sm font-bold bg-white text-primary px-4 py-2 rounded-xl border border-orange-200 hover:border-primary hover:shadow-md transition-all">
                <Plus size={16} /> Add Size
              </button>
            </div>
            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm relative group">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Pack Weight (e.g. 50g, 100g)</label>
                    <input type="text" value={variant.weight} onChange={(e) => handleVariantChange(index, 'weight', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-all" placeholder="e.g. 50g" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                    <input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-all" placeholder="e.g. 150" />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Stock</label>
                    <input type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary transition-all" placeholder="e.g. 50" />
                  </div>
                  {formData.variants.length > 1 && (
                    <button type="button" onClick={() => removeVariant(index)} className="mt-5 sm:mt-0 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea rows="6" name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Write a brief description of the product..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
              <label className="border-2 border-dashed border-orange-200 rounded-3xl h-[164px] flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-orange-50 transition-all bg-gray-50 overflow-hidden relative group">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon size={24} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-gray-500">Click to upload</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={submitting} className="bg-primary hover:bg-secondary text-white px-10 py-4 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(217,119,6,0.3)] hover:shadow-[0_6px_20px_rgba(217,119,6,0.4)] disabled:opacity-70 disabled:cursor-not-allowed">
              {submitting ? "Processing..." : editId ? "Save Changes" : "Create Product"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold transition-all">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PRODUCTS LIST */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-dark">Current Inventory</h2>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const finalImage = getProductImage(product.name, product.image);
              return (
                <div key={product._id} className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 overflow-hidden bg-[#fff8f1]">
                    <img
                      src={finalImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = "/images/no-image.png"; }}
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-dark shadow-sm">
                      {product.stock} in stock
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      {product.category || "Spice"}
                    </p>
                    <h3 className="text-lg font-bold text-dark leading-tight line-clamp-1 mb-2">
                      {product.name} {product.hindiName && <span className="text-sm font-medium text-gray-500">({product.hindiName})</span>}
                    </h3>
                    <div className="flex items-end justify-between">
                      <p className="text-xl font-black text-dark">₹{product.price}</p>
                      <p className="text-sm text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-md">
                        {product.weight}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button onClick={() => handleEdit(product)} className="bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm">
                        <Pencil size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
