/* ============================================================
   RANGSAR STUDIO — PRODUCTS.JS
   ⭐ THIS IS YOUR MAIN FILE — Edit here to manage everything
   ============================================================

   ┌─────────────────────────────────────────────────────────┐
   │  HOW TO ADD A PRODUCT PHOTO FROM YOUR "images" FOLDER   │
   ├─────────────────────────────────────────────────────────┤
   │  1. Put your photo inside the "images" folder           │
   │     Example:  images/Earring.png                        │
   │               images/RoseLawn.jpg                       │
   │  2. In the product entry below, set:                    │
   │       useImage: true,                                   │
   │       image: "images/YourFileName.png"                  │
   │  That's it! Photo shows automatically.                  │
   └─────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────┐
   │  HOW TO MARK AS SOLD OUT                                │
   ├─────────────────────────────────────────────────────────┤
   │  stock: 0   → Shows "Item Not Available" + grey button  │
   └─────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────┐
   │  HOW TO SHOW "ONLY X LEFT!" WARNING                     │
   ├─────────────────────────────────────────────────────────┤
   │  stock: 3   → Shows red "Only 3 Left!" badge           │
   │  (Any number 1–9 triggers the warning)                  │
   └─────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────┐
   │  HOW TO TEMPORARILY HIDE A PRODUCT                      │
   ├─────────────────────────────────────────────────────────┤
   │  active: false  → Hidden from site (not deleted)        │
   │  active: true   → Visible again                         │
   └─────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────┐
   │  CATEGORIES (use exactly as shown below)                │
   ├─────────────────────────────────────────────────────────┤
   │  "solids"  |  "printed"  |  "exclusive"  |  "accessories"│
   └─────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────┐
   │  SIZES                                                  │
   ├─────────────────────────────────────────────────────────┤
   │  sizes: ["S","M","L","XL","XXL"]                        │
   │  For accessories (no sizes): sizes: []                   │
   └─────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────┐
   │  ACCESSORIES — SPECIAL IMAGE DISPLAY                    │
   ├─────────────────────────────────────────────────────────┤
   │  Accessories automatically display as a SQUARE (1:1)    │
   │  with "contain" fit so earrings/bags aren't stretched.  │
   │  Clicking opens the full image in a lightbox popup.     │
   └─────────────────────────────────────────────────────────┘
   ============================================================ */

const PRODUCTS = [

  {
    id: 1,
    name: "Premium Rose Solid Lawn",
    category: "solids",
    price: 4200,
    desc: "3-piece unstitched premium lawn. Soft blush rose solid with a silk-like finish. Fabric is light, breathable, and perfect for summer. Includes shirt, dupatta, and trouser fabric.",
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 15,
    active: true,
    useImage: false,
    image: "",
    bg: "linear-gradient(145deg, #c9748a 0%, #9b2355 60%, #6b1a3a 100%)"
  },

  {
    id: 2,
    name: "Floral Printed Chiffon",
    category: "printed",
    price: 3850,
    desc: "Digital floral print on premium chiffon fabric. Vibrant summer colours with fine detailing. Full 3-piece unstitched suit — shirt, trouser, and printed dupatta included.",
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
    desc: "Hand-embroidered royal cambric with intricate gold thread detailing. Luxury 3-piece unstitched suit ideal for formal occasions and festive gatherings. Limited edition design.",
    badge: "Exclusive",
    sizes: ["S", "M", "L", "XL", "XXL"],
    stock: 4,
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
    desc: "Rich deep crimson khaddar for the winter season. Warm, thick-weave premium fabric with a beautiful matte finish. 3-piece unstitched suit — perfect for casual and semi-formal wear.",
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
    desc: "Deep plum party-wear with intricate gold and silver embroidery. Premium fabric, heavily embellished neckline and borders. Perfect for weddings, mehndi, and formal events.",
    badge: "Premium",
    sizes: ["S", "M", "L", "XL"],
    stock: 3,
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
    desc: "Hand block-printed lawn with earthy bohemian geometric patterns. Soft, breathable summer fabric with a relaxed, artistic feel. 3-piece unstitched suit.",
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
    desc: "Elegant dusty rose formal suit with delicate lace trim on neckline and sleeves. Semi-formal occasion wear. Premium fabric, beautifully draped silhouette. 3-piece unstitched.",
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
    name: "Gold Drop Earrings",
    category: "accessories",  // ← Accessories = square display, no size selector
    price: 1800,
    desc: "Handcrafted gold-tone drop earrings with delicate floral detailing. Lightweight and elegant — perfect to pair with any formal or semi-formal outfit from our collection. Nickel-free metal.",
    badge: "New",
    sizes: [],              // Empty = no size selector shown for accessories
    stock: 9,               // 9 = shows "Only 9 Left!" warning badge
    active: true,
    useImage: true,         // ← true because you have the real photo
    image: "images/Earring.png",  // ← Your earring photo in the images folder
    bg: "linear-gradient(145deg, #c9a065 0%, #9b7a45 60%, #6b5025 100%)"
  }

];
/* ─── END OF PRODUCTS ───────────────────────────────────────
   To add a new product: copy one block above and paste it
   here before this comment. Give it the next id number.
   ─────────────────────────────────────────────────────── */


/* ============================================================
   💸  DISCOUNT CODES
   ============================================================

   ┌──────────────────────────────────────────────────────────┐
   │  HOW TO ADD A NEW DISCOUNT CODE                          │
   ├──────────────────────────────────────────────────────────┤
   │                                                          │
   │  Step 1: Open this file (products.js)                   │
   │  Step 2: Find the DISCOUNT_CODES section below          │
   │  Step 3: Add a new line inside the { } block            │
   │                                                          │
   │  FORMAT FOR PERCENTAGE DISCOUNT:                         │
   │    "MYCODE": { type: "percent", value: 10, label: "10% Off" },
   │                                                          │
   │  FORMAT FOR FIXED PKR DISCOUNT:                         │
   │    "MYCODE": { type: "fixed", value: 300, label: "PKR 300 Off" },
   │                                                          │
   │  REAL EXAMPLES:                                          │
   │    Eid 20% off →  "EID2025": { type:"percent", value:20, label:"20% Eid" },
   │    PKR 500 off →  "FLAT500": { type:"fixed", value:500, label:"PKR 500 Off" },
   │    VIP 25% off →  "VIP":     { type:"percent", value:25, label:"25% VIP" },
   │                                                          │
   │  HOW TO DISABLE A CODE:                                 │
   │    Put // at the start of that line                     │
   │    Example: // "EID2025": { type:"percent", value:20 }, │
   │                                                          │
   │  CODES ARE NOT CASE SENSITIVE:                          │
   │    Customer can type "rangsar10" or "RANGSAR10"         │
   │    — both will work!                                    │
   │                                                          │
   │  WHERE CUSTOMER ENTERS THE CODE:                        │
   │    In the shopping bag/cart — there is a               │
   │    "Have a Discount Code?" box at the bottom.           │
   └──────────────────────────────────────────────────────────┘

   YOUR ACTIVE CODES (share these with customers):
   ─────────────────────────────────────────────── */

const DISCOUNT_CODES = {

  "RANGSAR10": { type: "percent", value: 10,  label: "10% Off"      },
  "WELCOME":   { type: "percent", value: 15,  label: "15% Welcome"  },
  "EID2025":   { type: "percent", value: 20,  label: "20% Eid Sale" },
  "FLAT500":   { type: "fixed",   value: 500, label: "PKR 500 Off"  },
  "VIP":       { type: "percent", value: 25,  label: "25% VIP"      },

  // ← ADD NEW CODES ABOVE THIS LINE
  // Example (remove the // to activate):
  // "SUMMER30": { type: "percent", value: 30, label: "30% Summer Sale" },
};

/* ─── END OF DISCOUNT CODES ──────────────────────────────── */
