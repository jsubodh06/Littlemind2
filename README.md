# Little Sprout - Montessori Toys & Play Furniture

A full-stack Montessori e-commerce platform for ages 0-15 with a customer storefront and a secure administrator control center.

Built with **React**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Firebase** (Authentication, Cloud Firestore, and Security Rules).

---

## 🌿 Brand & Design Philosophy
- **Colors**: Cream (#FFF8EF), Sage Green (#7BA88B), Terracotta (#E2725B), Sunshine Yellow (#F6C453), Deep Bark Brown (#3B2F2F).
- **Typography**: *Fraunces* for editorial headings, *Nunito* for body.
- **Craftsmanship**: Rounded 24px cards, soft organic shadows, hand-drawn SVG doodle accents, and blob shapes.

---

## 🚀 Key Features

### 🛍️ Customer Storefront
1. **Dynamic Homepage**:
   - Admin-managed top announcement bar with link.
   - Sticky blurred header with mega-menus (*Shop by Category*, *Shop by Age*) and live autocomplete search.
   - Hero banner carousel with CTA buttons.
   - Infinite trust marquee ("Trusted by 1,00,000+ parents", Non-toxic, Made in India).
   - "Shop by Age" colorful organic blob tiles (0-1, 1-2, 2-3, 3-4, 4-15 yrs).
   - "Shop by Category" large cards with image hover zoom.
   - Bestsellers section with age filter tabs, product hover image swap, star rating, MRP discount badge.
   - "Why parents trust us" 4-pillar row (solid wood, non-toxic finish, AMI milestones, activity guides).
   - Interactive 2-step "Find the Right Toy" quiz with custom product recommendations.
   - Parent testimonials carousel with verified buyer badges.
   - Press logos strip & collapsible FAQ accordion.
   - Newsletter signup with instant coupon voucher feedback.
2. **Catalog / Collection Page**:
   - Filters: Age range, Category, Max price slider, In-stock toggle, and Sorting (Bestsellers, Price Low-High, Price High-Low, Rating).
   - Responsive product grid with pagination.
3. **Product Detail Page**:
   - Multi-angle image gallery with cursor zoom inspection.
   - Age suitability pill and live stock tracker.
   - "What's inside the box" checklist.
   - Pediatric developmental benefits breakdown.
   - PIN code delivery estimator (e.g., 560001, 110001).
   - Verified parent reviews and instant review submission form.
   - Related products carousel.
   - Sticky bottom Add to Cart bar for mobile devices.
4. **Cart Drawer & Checkout**:
   - Slide-over cart drawer with free express shipping progress bar.
   - Coupon codes (`SPROUT10` for 10% off, `WELCOME500` for ₹500 off, `MONTESSORI20` for 20% off).
   - Comprehensive address form with Indian state selection.
   - Cash on Delivery (COD) and mock online payment with a realistic Razorpay simulation modal.
   - Order confirmation with celebratory confetti and printable receipt.
5. **Customer Account**:
   - Sign up / Sign in with Email/Password or Google Popup.
   - Order history with status updates ("Placed", "Packed", "Shipped", "Delivered") and tracking links.
   - Wishlist management (move to cart, remove).
   - Saved delivery addresses.
6. **Educational & Static Pages**:
   - What is Montessori? (Visual guide to Montessori principles).
   - Our Story & Woodshop (Bengaluru studio, organic finishes).
   - Developmental Blog (Articles, reading time, tags, single post reader).
   - Contact Page with form and direct WhatsApp connect.
   - Store Policies: 15-Day Return Policy, Privacy Policy, Terms of Service.

---

## 🛡️ Admin Authentication & Control Center

### Accessing the Admin Console
- The public storefront completely hides the admin link to prevent unauthorized attempts.
- To access the admin panel, navigate directly to:
  ```
  /admin/login
  ```
- Or access the admin dashboard directly once authenticated at:
  ```
  /admin
  ```

### First-Admin Setup Instructions
There are two ways to grant administrator privileges:

#### Method 1: Instant In-UI Development Bootstrap (Fastest)
1. Navigate to `/admin/login`.
2. Sign in with your Google Account or create an email account.
3. If your account is not yet marked as admin, a friendly **"👑 Grant Master Admin Status"** button will appear.
4. Click this button to instantly set `role: "admin"` on your Firestore user profile and create the document at `/admins/{uid}`.
5. You are immediately redirected to the Admin Panel.

#### Method 2: Bootstrapped Runtime Email
- The runtime administrator email `subodhjain2007777@gmail.com` is hardcoded into `firestore.rules` and the frontend auth system as a master admin.
- Any login from this email address is automatically verified as an admin.

#### Method 3: Firebase Console Firestore Setup
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Go to **Firestore Database** -> `users` collection.
3. Locate the user document matching your `uid`.
4. Set the field:
   ```json
   {
     "role": "admin"
   }
   ```
5. In the `admins` collection, add a document with ID matching your `uid`:
   ```json
   {
     "uid": "<YOUR_USER_UID>",
     "email": "<YOUR_EMAIL>",
     "grantedAt": "2026-10-14T00:00:00.000Z"
   }
   ```

### Security & Session Guards
- **Protected Route**: Unauthenticated users or non-admin accounts accessing `/admin` are immediately redirected.
- **Inactivity Timeout**: Active sessions automatically log out after 30 minutes of inactivity.
- **Brute Force Lockout**: Accounts are locked out for 30 seconds after 5 consecutive failed attempts.

---

## 🗄️ Firestore Security Rules & Deployment

The file `firestore.rules` enforces ABAC (Attribute-Based Access Control):
- **Public Read**: Anyone can read `/products`, `/categories`, `/ageGroups`, `/testimonials`, `/faqs`, `/blogs`, `/settings`, and approved `/reviews`.
- **Orders**: Customers can only read and create their own orders (`customerId == request.auth.uid`). Only administrators can view all orders and update statuses.
- **Catalog & CMS**: Only administrators (`isAdmin()`) can write to `/products`, `/categories`, `/coupons`, `/blogs`, and `/settings`.

### Deploying Firestore Rules
To redeploy Firestore rules at any time, run:
```bash
firebase deploy --only firestore:rules
```

---

## 📦 Sample Dataset & Seeder

Little Sprout comes pre-seeded with 12 handcrafted Montessori products:
1. *Level 1 Montessori Infant Discovery Box (0-6M)*
2. *Level 2 Object Permanence & Sensory Kit (6-12M)*
3. *Solid Birch Wood Foldable Pikler Triangle Gym (6M-4Y)*
4. *Waldorf Wooden Arch & Rocker with Organic Cushion (1-5Y)*
5. *Montessori Toddler Self-Serve Mini Kitchen Set (1-4Y)*
6. *2-in-1 Solid Beechwood Adjustable Learning Tower (1-5Y)*
7. *Wooden Cylinder Socket & Size Differentiation Set (2-4Y)*
8. *Natural Teakwood Double-Sided Art Easel (2-8Y)*
9. *Wooden Curved Balance Board with Felt Base (1-12Y)*
10. *Montessori Math Bead Stair & Number Rods Box (3-7Y)*
11. *Handcrafted Wooden Dollhouse & Furniture Set (3-8Y)*
12. *STEM Wooden Geoboard & Spatial Pattern Cards (4-10Y)*

To re-seed or overwrite the database:
1. Log in to the Admin Panel (`/admin`).
2. Go to the **Store Settings** tab.
3. Click **"Seed Initial Sample Dataset"** or **"Force Re-Seed & Overwrite"**.
