/* ============================================================
   RANGSAR STUDIO — PRODUCTS.JS
   ============================================================
   👋 THIS IS THE ONLY FILE YOU NEED TO EDIT TO:
      ✅ Add new products
      ✅ Change prices
      ✅ Upload product photos
      ✅ Mark items as sold out
      ✅ Set low stock warnings
   ============================================================

   HOW TO ADD A PRODUCT PHOTO:
   ─────────────────────────────
   1. Upload your photo to Google Drive
   2. Right-click the photo → "Get link" → Set to "Anyone with link"
   3. Copy the file ID from the URL:
      https://drive.google.com/file/d/  >>>>FILE_ID<<<<  /view
   4. Your image URL becomes:
      https://drive.google.com/uc?export=view&id=FILE_ID
   5. Paste that URL into the "image" field below
   6. Set useImage: true

   OR upload to any free host like:
   - https://imgbb.com (free, easy)
   - https://postimages.org (free)
   Then paste the direct image link in "image" field.

   HOW TO MARK ITEM AS SOLD OUT:
   ─────────────────────────────
   Set  stock: 0   → shows "Out of Stock" badge, disables Add to Cart

   HOW TO SHOW LOW STOCK WARNING:
   ─────────────────────────────
   Set  stock: 3   → shows "Only 3 Left!" warning badge
   (Any number from 1–9 shows the warning)

   HOW TO HIDE A PRODUCT TEMPORARILY:
   ─────────────────────────────────
   Set  active: false   → product won't appear on the website

   AVAILABLE CATEGORIES (for filter tabs):
   ─────────────────────────────────────
   "solids" | "printed" | "exclusive" | "accessories"

   AVAILABLE SIZES:
   ─────────────────────────────────────
   Add/remove sizes from the sizes array per product.
   Example:  sizes: ["S","M","L","XL","XXL"]
   ============================================================ */

const PRODUCTS = [

  {
    id: 1,
    name: "Premium Rose Solid Lawn",
    category: "solids",
    price: 4200,
    desc: "3-piece unstitched premium lawn. Soft blush rose solid with silk-like finish.",
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 15,        // Change to 0 for Sold Out, 1–9 for low stock warning
    active: true,
    useImage: false,  // Change to true and fill "image" when you have a photo
    image: "",        // Paste your photo URL here
    bg: "linear-gradient(145deg, #c9748a 0%, #9b2355 60%, #6b1a3a 100%)"
  },

  {
    id: 2,
    name: "Floral Printed Chiffon",
    category: "printed",
    price: 3850,
    desc: "Digital floral print on premium chiffon. Vibrant summer colours, full 3-piece.",
    badge: "New",
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    active: true,
    useImage: false,
    image: "",
    bg: "linear-gradient(145deg, #e8a4b8 0%, #b8326b 50%, #9b2355 100%)"
  },

  {
    id: 3,
    name: "Royal Cambric Embroidered Suite",
    category: "exclusive",
    price: 8900,
    desc: "Hand-embroidered royal cambric. Gold thread detailing, luxury 3-piece unstitched.",
    badge: "Exclusive",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 4,         // Shows "Only 4 Left!" warning
    active: true,
    useImage: false,
    image: "",
    bg: "linear-gradient(145deg, #3d1a47 0%, #2b0e33 60%, #1a0820 100%)"
  },

  {
    id: 4,
    name: "Crimson Khaddar Winter Edit",
    category: "solids",
    price: 3600,
    desc: "Rich deep crimson khaddar for winter. Warm, premium fabric. 3-piece suit.",
    badge: "Sale",
    sizes: ["M", "L", "XL", "XXL"],
    stock: 12,
    active: true,
    useImage: false,
    image: "",
    bg: "linear-gradient(145deg, #9b2355 0%, #701035 60%, #42021a 100%)"
  },

  {
    id: 5,
    name: "Plum Festive Embroidery",
    category: "exclusive",
    price: 11500,
    desc: "Deep plum party-wear with intricate gold embroidery. Perfect for weddings & events.",
    badge: "Premium",
    sizes: ["S", "M", "L", "XL"],
    stock: 3,         // Shows "Only 3 Left!" warning
    active: true,
    useImage: false,
    image: "",
    bg: "linear-gradient(145deg, #5c2d6e 0%, #3d1a47 60%, #250d2d 100%)"
  },

  {
    id: 6,
    name: "Boho Block Printed Lawn",
    category: "printed",
    price: 3200,
    desc: "Hand block-printed lawn. Earthy bohemian patterns on soft summer fabric.",
    badge: null,
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 20,
    active: true,
    useImage: false,
    image: "",
    bg: "linear-gradient(145deg, #c9a065 0%, #a07840 60%, #6b4e20 100%)"
  },

  {
    id: 7,
    name: "Dusty Rose Formal Suit",
    category: "exclusive",
    price: 6800,
    desc: "Elegant dusty rose formal suit with delicate lace trim. Occasion & party wear.",
    badge: "New",
    sizes: ["S", "M", "L", "XL"],
    stock: 6,
    active: true,
    useImage: false,
    image: "",
    bg: "linear-gradient(145deg, #e8a4b8 0%, #d4849e 60%, #b86480 100%)"
  },

  {
    id: 8,
    name: "Pearl Beaded Clutch Bag",
    category: "accessories",
    price: 2100,
    desc: "Handcrafted pearl-embellished evening clutch. Pairs perfectly with formal suits.",
    badge: "New",
    sizes: [],         // Empty = no size selector shown (accessories)
    stock: 1,          // SOLD OUT example
    active: true,
    useImage: true,
    image: "https://ibb.co/0R1DVc4B",
    bg: "linear-gradient(145deg, #c9a065 0%, #9b7a45 60%, #6b5025 100%)"
  }

];
/* ─── END OF PRODUCTS — Add more objects above this line ─── */
