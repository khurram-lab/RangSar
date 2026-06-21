# 🌸 RangSar Studio — Website Guide
**Your complete guide to managing your website**

---

## 📁 YOUR 4 FILES (what each one does)

```
rangsar-website/
├── index.html       ← Main website page (don't touch unless advised)
├── styles.css       ← All colours & design (don't touch unless advised)
├── products.js      ← ⭐ YOUR FILE — Edit this to manage all products
├── cart.js          ← Order logic & Google Sheets (edit SETTINGS at top)
└── HOW-TO-GUIDE.md  ← This guide
```

---

## ⭐ HOW TO ADD A NEW PRODUCT

Open `products.js` and copy this template at the end of the PRODUCTS list (before the closing `]`):

```javascript
{
  id: 9,                              // Give it the next number (9, 10, 11...)
  name: "Your Product Name",          // Product title shown on website
  category: "solids",                 // solids | printed | exclusive | accessories
  price: 4500,                        // Price in PKR (no commas)
  desc: "Short description here.",    // 1-2 sentences shown on card
  badge: "New",                       // New | Sale | Exclusive | Bestseller | null
  sizes: ["S", "M", "L", "XL", "XXL"], // Remove sizes you don't have
  stock: 10,                          // How many in stock
  active: true,                       // true = visible | false = hidden
  useImage: false,                    // true = use photo | false = use colour background
  image: "",                          // Paste photo URL here (if useImage is true)
  bg: "linear-gradient(145deg, #9b2355 0%, #3d1a47 100%)" // Background colour
}
```

---

## 📸 HOW TO ADD A PRODUCT PHOTO

**Option 1 — Free & Easy (imgbb.com)**
1. Go to https://imgbb.com
2. Upload your product photo
3. Click the photo → copy the "Direct link"
4. In `products.js`, set `useImage: true`
5. Paste the link in `image: "PASTE HERE"`

**Option 2 — Google Drive**
1. Upload photo to Google Drive
2. Right-click → Share → "Anyone with the link"
3. Copy the file ID from URL:
   `drive.google.com/file/d/` **→ THIS PART ←** `/view`
4. Your image URL = `https://drive.google.com/uc?export=view&id=PASTE_ID_HERE`
5. Set `useImage: true` and paste URL in `image:`

---

## 🔴 HOW TO MARK A PRODUCT AS SOLD OUT

In `products.js`, find your product and set:
```javascript
stock: 0
```
The website will automatically show **"Item Not Available"** and disable the Add to Cart button.

---

## ⚠️ HOW TO SHOW "ONLY X LEFT!" WARNING

Set stock to any number between 1 and 9:
```javascript
stock: 3      // Shows: "Only 3 Left!"
stock: 7      // Shows: "Only 7 Left!"
```
Stock 10 or above = no warning shown.

---

## 🙈 HOW TO HIDE A PRODUCT (without deleting it)

```javascript
active: false   // Product disappears from website
active: true    // Product is visible again
```

---

## 💰 HOW TO CHANGE DELIVERY CHARGE

Open `cart.js` and find SETTINGS at the very top:
```javascript
const SETTINGS = {
  deliveryCharge: 250,        // Change this number
  freeDeliveryAbove: 5000,    // Free delivery above this amount (set 0 to always charge)
```

---

## 💳 HOW TO UPDATE YOUR PAYMENT DETAILS

Open `cart.js` → find SETTINGS at the top:
```javascript
jazzCashNumber: "0321-7024241",       // Your JazzCash number
bankName: "Meezan Bank",               // Your bank name
bankAccountTitle: "RangSar Studio",    // Account name
bankAccountNumber: "XXXX-XXXX-XXXX",  // ← Replace with real account number
```

---

## 📊 HOW TO CONNECT GOOGLE SHEETS (Auto-save orders)

**Step 1:** Go to https://sheets.google.com → New spreadsheet
- Name it: **RangSar Orders**
- Add these headers in Row 1:
  `Order # | Name | Phone | Email | Address | Payment | Items | Subtotal | Delivery | Total | Date`

**Step 2:** Open Apps Script
- In Google Sheets: Extensions → Apps Script
- Delete existing code and paste code from bottom of `cart.js`

**Step 3:** Deploy
- Click Deploy → New Deployment
- Type: **Web App**
- Execute as: **Me**
- Who has access: **Anyone**
- Click Deploy → Copy the URL

**Step 4:** Paste in cart.js
```javascript
googleScriptURL: "PASTE YOUR URL HERE"
```

✅ Done! Every order now auto-saves to your sheet AND customer gets a confirmation email.

---

## 🏃 HOW TO RUN YOUR WEBSITE

**Locally on your computer:**
- Just double-click `index.html` to open in browser
- All 4 files must be in the SAME folder

**Online (free hosting):**

**Option A — Netlify (Recommended, 100% Free)**
1. Go to https://netlify.com → Sign up free
2. Drag your entire `rangsar-website` folder onto the Netlify dashboard
3. Your site goes live instantly with a URL like `rangsar-studio.netlify.app`
4. You can connect a custom domain (rangsar.pk) from their settings

**Option B — GitHub Pages (Free)**
1. Create a GitHub account
2. New repository → upload all 4 files
3. Settings → Pages → Enable

---

## ❓ QUICK TROUBLESHOOTING

| Problem | Solution |
|---|---|
| Product not showing | Check `active: true` in products.js |
| Photo not loading | Make sure `useImage: true` and URL is correct |
| Cart not working | Make sure all 4 files are in the same folder |
| Dark mode not saving | Clear browser cache |
| Google Sheets not receiving | Check your deployed URL is pasted correctly |

---

*RangSar Studio Website — Elegance in Every Thread ✦*
