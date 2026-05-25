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

    // PRICE
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

    // STOCK
    stock: {
      type: Number,

      required: [true, "Product stock is required"],

      min: [0, "Stock cannot be negative"],

      default: 0,
    },

    // WEIGHT
    weight: {
      type: String,

      default: "",
    },

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
productSchema.pre(
  "save",

  function () {
    if (this.name) {
      this.slug = slugify(
        this.name,

        {
          lower: true,

          strict: true,
        },
      );
    }
  },
);

module.exports = mongoose.model("Product", productSchema);
