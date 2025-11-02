# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd ecommerce-store
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `<password>` with your database password

### 3. Set Up Stripe

1. Go to https://dashboard.stripe.com/register
2. Create an account
3. Navigate to Developers → API keys
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

### 4. Configure Environment Variables

Create `.env.local` file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce-store

# Stripe (from step 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_... # Optional for now

# JWT Secret (generate random string)
JWT_SECRET=my_super_secret_jwt_key_change_this

# Admin Account
ADMIN_EMAIL=admin@ecommerce.com
ADMIN_PASSWORD=admin123

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Initialize Admin Account

Start the dev server:
```bash
npm run dev
```

In another terminal, initialize the admin:
```bash
curl -X POST http://localhost:3000/api/auth/init
```

### 6. Add Sample Products

1. Go to http://localhost:3000/admin/login
2. Login with: `admin@ecommerce.com` / `admin123`
3. Navigate to Products
4. Click "Add Product"
5. Fill in product details:
   - Title: "Wireless Headphones"
   - Description: "High-quality wireless headphones with noise cancellation"
   - Price: 99.99
   - Stock: 50
   - Category: electronics
   - Images: https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500

### 7. Test the Store

1. Visit http://localhost:3000
2. Browse products
3. Add items to cart
4. Go to checkout
5. Use test card: `4242 4242 4242 4242`
6. Complete purchase

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
brew services start mongodb-community
# or
mongod
```

### Stripe API Key Error
```
Error: No API key provided
```
**Solution**: Check that your `.env.local` has the correct Stripe keys

### Admin Login Not Working
**Solution**: Initialize the admin account
```bash
curl -X POST http://localhost:3000/api/auth/init
```

### Build Errors
**Solution**: Clear cache and rebuild
```bash
rm -rf .next
npm run build
```

## Sample Product Data

Here are some sample products you can add:

**Product 1: Wireless Headphones**
- Title: Premium Wireless Headphones
- Description: High-quality wireless headphones with active noise cancellation and 30-hour battery life
- Price: 199.99
- Stock: 50
- Category: electronics
- Images: https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500

**Product 2: Running Shoes**
- Title: Professional Running Shoes
- Description: Lightweight running shoes with advanced cushioning technology
- Price: 89.99
- Stock: 100
- Category: sports
- Images: https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500

**Product 3: Coffee Maker**
- Title: Smart Coffee Maker
- Description: Programmable coffee maker with built-in grinder and thermal carafe
- Price: 149.99
- Stock: 30
- Category: home
- Images: https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500

**Product 4: Laptop Backpack**
- Title: Travel Laptop Backpack
- Description: Water-resistant backpack with USB charging port and multiple compartments
- Price: 59.99
- Stock: 75
- Category: electronics
- Images: https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500

## Testing Stripe Payments

### Test Card Numbers

**Successful Payment:**
- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Payment Declined:**
- Card: 4000 0000 0000 0002

**Requires Authentication:**
- Card: 4000 0025 0000 3155

### Test Payment Flow

1. Add products to cart
2. Go to checkout
3. Enter customer information
4. Click "Continue to Payment"
5. Enter test card details
6. Complete payment
7. Check admin dashboard for new order

## Next Steps

1. **Customize Design**: Edit Tailwind classes in components
2. **Add More Features**: Implement user accounts, reviews, wishlist
3. **Deploy**: Deploy to Vercel or your preferred platform
4. **Go Live**: Switch to Stripe live keys and production MongoDB

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments for implementation details
- Open an issue on GitHub for bugs or questions

Happy coding! 🚀
