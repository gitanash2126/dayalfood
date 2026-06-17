const mongoose = require("mongoose");
const slugify = require("slugify");

// ==========================================
// REVIEW SCHEMA
// ==========================================
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// VARIANT SCHEMA
// ==========================================
const variantSchema = new mongoose.Schema(
  {
    weight: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

// ==========================================
// PRODUCT SCHEMA
// ==========================================
const productSchema = new mongoose.Schema(
  {
    // PRODUCT NAME
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    // HINDI NAME
    hindiName: {
      type: String,
      trim: true,
      default: "",
    },

    // SLUG
    slug: {
      type: String,
      lowercase: true,
    },

    // DESCRIPTION
    description: {
      type: String,
      required: [true, "Product description is required"],
    },

    // DEFAULT PRICE (BACKWARD COMPATIBLE)
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    // CATEGORY
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },

    // BRAND
    brand: {
      type: String,
      default: "Amrit Dayal Food",
    },

    // DEFAULT STOCK (BACKWARD COMPATIBLE)
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    // DEFAULT WEIGHT (BACKWARD COMPATIBLE)
    weight: {
      type: String,
      default: "",
    },

    // ==========================================
    // PRODUCT VARIANTS
    // ==========================================
    variants: [variantSchema],

    // MAIN IMAGE
    image: {
      type: String,
      default: "",
    },

    // MULTIPLE IMAGES
    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    // RATING
    rating: {
      type: Number,
      default: 0,
    },

    // NUMBER OF REVIEWS
    numReviews: {
      type: Number,
      default: 0,
    },

    // REVIEWS
    reviews: [reviewSchema],

    // FEATURED
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ACTIVE
    isActive: {
      type: Boolean,
      default: true,
    },

    // CREATED BY
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// CREATE SLUG
// ==========================================
productSchema.pre("save", function () {
  if (this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  // If variants exist, use first variant as default
  if (this.variants && this.variants.length > 0) {
    this.price = this.variants[0].price;

    this.weight = this.variants[0].weight;

    this.stock = this.variants.reduce(
      (total, variant) => total + variant.stock,
      0,
    );
  }
});

module.exports = mongoose.model("Product", productSchema);
