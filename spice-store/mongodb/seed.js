db.categories.insertMany([
  {
    name: "Whole Spices",
    slug: "whole-spices",
    image_url:
      "https://images.pexels.com/photos/4198019/pexels-photo-4198019.jpeg",
  },
]);

db.products.insertMany([
  {
    name: "Cloves",
    slug: "cloves",
    description: "Premium cloves",
    price: 199,
    sale_price: 149,
    stock: 50,
    weight: "250g",
    image_url:
      "https://images.pexels.com/photos/4197445/pexels-photo-4197445.jpeg",
    is_featured: true,
    is_active: true,
  },
]);
