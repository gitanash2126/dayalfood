import { useEffect, useState } from "react";
import API from "../../api/axios";
import { Pencil, Trash2, Plus, ImageIcon, Gift } from "lucide-react";
import toast from "react-hot-toast";
import { getProductImage } from "../../utils/productImages"; // Using this to resolve image URL if uploaded to backend

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountText: "",
    startDate: "",
    endDate: "",
    isActive: true,
    image: null,
  });

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop";

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const { data } = await API.get("/offers");
      setOffers(data.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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

  const resetForm = () => {
    setEditId(null);
    setPreview("");
    setFormData({
      title: "",
      description: "",
      couponCode: "",
      discountValue: "",
      startDate: "",
      endDate: "",
      isActive: true,
      image: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const offerData = new FormData();
      offerData.append("title", formData.title);
      offerData.append("description", formData.description);
      offerData.append("discountText", `${formData.discountValue}% OFF`);
      offerData.append("couponCode", formData.couponCode);
      offerData.append("discountType", "percentage");
      offerData.append("discountValue", formData.discountValue);
      offerData.append("startDate", formData.startDate);
      offerData.append("endDate", formData.endDate);
      offerData.append("isActive", formData.isActive);

      if (formData.image) {
        offerData.append("image", formData.image);
      }

      if (editId) {
        await API.put(`/offers/${editId}`, offerData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Offer Updated Successfully");
      } else {
        await API.post("/offers", offerData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Offer Added Successfully");
      }

      resetForm();
      fetchOffers();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Operation Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (offer) => {
    setEditId(offer._id);
    
    // Format dates for input type="date"
    const start = new Date(offer.startDate).toISOString().split('T')[0];
    const end = new Date(offer.endDate).toISOString().split('T')[0];

    // Set preview image using getProductImage to resolve the correct URL from backend
    if (offer.image) {
      setPreview(getProductImage("offer", offer.image));
    } else {
      setPreview(FALLBACK_IMAGE);
    }

    setFormData({
      title: offer.title,
      description: offer.description || "",
      couponCode: offer.couponCode || "",
      discountValue: offer.discountValue || "",
      startDate: start,
      endDate: end,
      isActive: offer.isActive,
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this offer?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/offers/${id}`);
      toast.success("Offer Deleted Successfully");
      fetchOffers();
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
          <h1 className="text-4xl font-black text-dark tracking-tight">Offer Management</h1>
          <p className="text-gray-500 mt-2 text-lg">Add or update special offers and banners</p>
        </div>
        <div className="bg-primary/10 p-4 rounded-2xl">
          <Gift className="text-primary w-8 h-8" />
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-[32px] shadow-xl p-8 lg:p-10 border border-orange-100/50">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-dark">
          <div className="bg-orange-50 p-2.5 rounded-xl">
            <Plus className="text-primary w-6 h-6" />
          </div>
          {editId ? "Update Existing Offer" : "Create New Offer"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Offer Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="e.g. Get Fresh Indian Spices" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
              <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required min="0" className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="e.g. 10" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Coupon Code</label>
              <input type="text" name="couponCode" value={formData.couponCode} onChange={handleChange} required className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all uppercase" placeholder="e.g. FIRST10" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
              <textarea rows="6" name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Write offer details..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image (Optional)</label>
              <label className="border-2 border-dashed border-orange-200 rounded-3xl h-[164px] flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-orange-50 transition-all bg-gray-50 overflow-hidden relative group">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <ImageIcon size={24} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-gray-500 text-center px-4">Click to upload (Using default if empty)</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 text-primary rounded focus:ring-primary" />
            <label htmlFor="isActive" className="text-sm font-bold text-gray-700 cursor-pointer">Offer is Active</label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={submitting} className="bg-primary hover:bg-secondary text-white px-10 py-4 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(217,119,6,0.3)] hover:shadow-[0_6px_20px_rgba(217,119,6,0.4)] disabled:opacity-70 disabled:cursor-not-allowed">
              {submitting ? "Processing..." : editId ? "Save Changes" : "Create Offer"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold transition-all">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* OFFERS LIST */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-dark">All Offers</h2>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const offerImg = offer.image ? getProductImage("offer", offer.image) : FALLBACK_IMAGE;
              const isCurrentlyActive = offer.isActive && new Date(offer.endDate) >= new Date();
              
              return (
                <div key={offer._id} className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={offerImg}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${isCurrentlyActive ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCurrentlyActive ? 'Active' : 'Inactive/Expired'}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-bold text-dark leading-tight line-clamp-1 mb-1">
                      {offer.title}
                    </h3>
                    <p className="text-primary font-black text-lg mb-2">{offer.discountText}</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{offer.description}</p>
                    
                    <div className="flex items-center justify-between text-xs font-medium text-gray-400 mb-4 bg-gray-50 p-2 rounded-lg">
                      <span>From: {new Date(offer.startDate).toLocaleDateString()}</span>
                      <span>To: {new Date(offer.endDate).toLocaleDateString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => handleEdit(offer)} className="bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm">
                        <Pencil size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(offer._id)} className="bg-red-50 hover:bg-red-500 text-red-600 hover:text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors font-semibold text-sm">
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
