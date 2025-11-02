# ShopHub - Modern E-Commerce Store

A fully functional, modern e-commerce web store built with Next.js 14, TypeScript, MongoDB, and Stripe. Features include product management, express checkout with multiple payment methods, admin dashboard with analytics, and responsive design.

## Features

### Customer Features
- 🛍️ **Product Browsing**: Browse products with category filtering and search
- 🛒 **Shopping Cart**: Add products to cart with quantity management
- 💳 **Express Checkout**: Fast checkout with Stripe (supports Apple Pay, Google Pay, credit cards)
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🖼️ **Product Details**: Detailed product pages with image galleries

### Admin Features
- 📊 **Analytics Dashboard**: View revenue, sales trends, and performance metrics
- 📈 **Interactive Charts**: Visualize monthly revenue and order trends
- 🏆 **Best Sellers**: Track top-performing products
- ⚠️ **Low Stock Alerts**: Monitor inventory levels
- ➕ **Product Management**: Add, edit, and delete products
- 🔐 **Secure Authentication**: JWT-based admin authentication

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Payment**: Stripe with Stripe Elements
- **Charts**: Recharts
- **Authentication**: JWT with bcryptjs

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Stripe account (for payment processing)

## Installation

1. **Clone the repository**
   ```bash
   cd ecommerce-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   Update the following variables in `.env.local`:

   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/ecommerce-store
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-store

   # Stripe Keys (Get from https://dashboard.stripe.com/test/apikeys)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

   # JWT Secret (Generate a random string)
   JWT_SECRET=your_jwt_secret_key_here_change_in_production

   # Admin Credentials (Default admin account)
   ADMIN_EMAIL=admin@ecommerce.com
   ADMIN_PASSWORD=admin123

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```

5. **Initialize the admin account**
   
   After starting the development server, make a POST request to initialize the admin:
   ```bash
   curl -X POST http://localhost:3000/api/auth/init
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Usage

### Customer Flow

1. **Browse Products**: Visit the homepage to see all products
2. **Filter & Search**: Use category filters or search to find products
3. **View Details**: Click on a product to see detailed information
4. **Add to Cart**: Add products to your shopping cart
5. **Checkout**: Proceed to checkout and enter your information
6. **Payment**: Complete payment using Stripe (test cards available)

### Admin Flow

1. **Login**: Navigate to `/admin/login`
   - Default credentials: `admin@ecommerce.com` / `admin123`

2. **Dashboard**: View analytics and performance metrics
   - Total and monthly revenue
   - Order statistics
   - Revenue and sales trend charts
   - Best-selling products
   - Low stock alerts

3. **Manage Products**: Navigate to `/admin/products`
   - Add new products with images, pricing, and stock
   - Edit existing products
   - Delete products
   - Monitor stock levels

## Stripe Test Cards

Use these test card numbers for testing payments:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

## API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/[id]` - Get single product
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/orders` - Create new order

### Protected Endpoints (Require Authentication)
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/orders` - Get all orders
- `GET /api/analytics` - Get analytics data

### Auth Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/init` - Initialize admin account

## Project Structure

```
ecommerce-store/
├── app/
│   ├── admin/              # Admin pages
│   │   ├── dashboard/      # Analytics dashboard
│   │   ├── products/       # Product management
│   │   └── login/          # Admin login
│   ├── api/                # API routes
│   │   ├── analytics/      # Analytics endpoints
│   │   ├── auth/           # Authentication
│   │   ├── orders/         # Order management
│   │   ├── payment/        # Stripe integration
│   │   └── products/       # Product CRUD
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout flow
│   ├── product/[id]/       # Product detail page
│   └── page.tsx            # Homepage
├── components/             # React components
│   ├── AdminLayout.tsx     # Admin panel layout
│   ├── Navbar.tsx          # Navigation bar
│   └── ProductCard.tsx     # Product card component
├── contexts/               # React contexts
│   ├── AuthContext.tsx     # Admin authentication
│   └── CartContext.tsx     # Shopping cart state
├── lib/                    # Utilities
│   ├── auth.ts             # JWT utilities
│   ├── mongodb.ts          # Database connection
│   └── stripe.ts           # Stripe configuration
├── models/                 # MongoDB models
│   ├── Admin.ts            # Admin model
│   ├── Order.ts            # Order model
│   └── Product.ts          # Product model
└── .env.local              # Environment variables
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- Environment variables
- MongoDB connection

## Security Considerations

- Change default admin credentials in production
- Use strong JWT secret
- Enable Stripe webhook signature verification
- Use MongoDB Atlas with IP whitelisting
- Enable HTTPS in production
- Implement rate limiting for API routes

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env.local`
- For Atlas, whitelist your IP address

### Stripe Payment Issues
- Verify API keys are correct
- Use test mode keys for development
- Check Stripe dashboard for errors

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, TypeScript, and Stripe
