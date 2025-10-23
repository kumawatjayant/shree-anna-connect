# Shree Anna Connect - Digital Millet & Pulses Marketplace

## Vision
India's first integrated digital platform enabling millet (Shree Anna) farmers, SHGs, FPOs, startups, processors, and consumers to interact, trade, and grow together.

## Features
- **Farmer/SHG Portal**: List crops, manage orders, track payments
- **Processor Portal**: Bulk ordering, supplier search, quality verification
- **Consumer Marketplace**: Browse and buy millet products with traceability
- **Admin Dashboard**: Monitor ecosystem, manage schemes, export reports
- **Multilingual Support**: Hindi, English, and regional languages
- **Traceability**: Farm-to-fork tracking with QR codes
- **Payment Integration**: Secure UPI/payment gateway

## Tech Stack
- **Frontend**: React.js, Material-UI, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT + OTP
- **Payment**: UPI Integration (sandbox for demo)

## Project Structure
```
shree-anna-connect/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth, validation
│   ├── utils/        # Helpers, notifications
│   └── server.js     # Entry point
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Role-based dashboards
│   │   ├── services/    # API calls
│   │   └── App.js
│   └── public/
└── README.md
```

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
# Create .env file with MongoDB URI and JWT secret
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## User Roles
1. **Farmer/FPO/SHG**: List crops/products, manage orders
2. **Processor/Startup**: Bulk procurement, supplier management
3. **Consumer**: Browse marketplace, purchase products
4. **Admin/Government**: Dashboard, verification, reports

## API Endpoints
- `/api/auth` - Authentication
- `/api/crops` - Crop management
- `/api/products` - Product marketplace
- `/api/orders` - Order processing
- `/api/bulk-requests` - Bulk procurement
- `/api/admin` - Admin operations
- `/api/traceability` - Product tracking

## Impact
- Fair pricing for farmers (20-30% income uplift)
- Women SHG empowerment
- Consumer access to healthy, traceable food
- Government policy data and scheme tracking
