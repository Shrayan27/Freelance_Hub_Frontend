# 🚀 Freelance Marketplace - Complete Fiverr Clone

A full-featured online marketplace for freelancers, built with React, Node.js, MongoDB, and real-time features.

## ✨ Features

### 🔐 Authentication & User Management
- **Multi-role Registration**: Register as client or freelancer
- **JWT Authentication**: Secure login with refresh tokens
- **Profile Management**: Update user information and preferences
- **Role-based Access**: Different dashboards for buyers and sellers

### 🛍️ Gig Management
- **Create Gigs**: Freelancers can create detailed service listings
- **Image Upload**: Cloudinary integration for gig images
- **Search & Filter**: Advanced search with categories and price ranges
- **Gig Details**: Comprehensive gig pages with reviews and seller info

### 💳 Payment Processing
- **Stripe Integration**: Secure payment processing
- **Order Management**: Complete order lifecycle
- **Payment Status Tracking**: Real-time payment status updates
- **Order Confirmation**: Sellers can mark orders as complete

### 💬 Real-time Messaging
- **Socket.io Chat**: Real-time messaging between buyers and sellers
- **Conversation Management**: Organized chat threads
- **Message Notifications**: Real-time message updates
- **Chat History**: Persistent message storage

### ⭐ Reviews & Ratings
- **Review System**: Post-purchase reviews and ratings
- **Rating Display**: Average ratings and review counts
- **Review Management**: View and manage reviews

### 📊 Dashboard & Analytics
- **Seller Dashboard**: Gig statistics and earnings
- **Order Tracking**: Complete order management
- **Sales Analytics**: Performance metrics for sellers
- **Purchase History**: Order history for buyers

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Socket.io Client** for real-time features
- **Stripe Elements** for payment processing

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time messaging
- **Stripe** for payment processing
- **Cloudinary** for image uploads
- **Multer** for file handling
- **bcryptjs** for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Stripe account
- Cloudinary account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd freelance-marketplace
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Start the Application

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users` - Update user profile
- `DELETE /api/users/:id` - Delete user

### Gigs
- `GET /api/gigs` - Get all gigs with filters
- `GET /api/gigs/single/:id` - Get single gig
- `POST /api/gigs` - Create new gig
- `DELETE /api/gigs/:id` - Delete gig
- `GET /api/gigs/user` - Get user's gigs

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create order
- `PUT /api/orders/confirm/:id` - Confirm order
- `POST /api/orders/create-payment-intent` - Create payment intent
- `PUT /api/orders/update-payment` - Update payment status

### Messages
- `GET /api/messages/:id` - Get conversation messages
- `POST /api/messages` - Send message
- `PUT /api/messages/read/:conversationId` - Mark as read

### Conversations
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:id` - Get single conversation

### Reviews
- `GET /api/reviews/:gigId` - Get gig reviews
- `POST /api/reviews` - Create review

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## 🔧 Key Features Implementation

### Real-time Chat
The application uses Socket.io for real-time messaging:
- Users join conversation rooms
- Messages are sent and received in real-time
- Chat history is persisted in MongoDB

### Payment Processing
Stripe integration for secure payments:
- Payment intents are created on the backend
- Frontend uses Stripe Elements for card input
- Payment status is tracked and updated

### Image Upload
Cloudinary integration for image management:
- Images are uploaded to Cloudinary
- URLs are stored in the database
- Optimized image delivery

## 📁 Project Structure

```
freelance-marketplace/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
└── README.md
```

## 🎯 Usage Guide

### For Freelancers (Sellers)
1. **Register** as a seller
2. **Create Gigs** with detailed descriptions and images
3. **Manage Orders** and mark them as complete
4. **Chat with Buyers** using the messaging system
5. **Track Earnings** and performance metrics

### For Clients (Buyers)
1. **Register** as a client
2. **Browse Gigs** using search and filters
3. **Purchase Services** with secure payments
4. **Chat with Sellers** for project details
5. **Leave Reviews** after service completion

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Comprehensive form validation
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API rate limiting (can be added)
- **Secure Headers**: Security headers implementation

## 🚀 Deployment

### Backend Deployment (Render)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy the server directory

### Frontend Deployment (Vercel)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Stripe for payment processing
- Cloudinary for image management
- Socket.io for real-time features
- Tailwind CSS for styling
- React community for excellent documentation

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Happy Coding! 🎉**
