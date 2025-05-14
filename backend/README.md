# HCO Backend

This is the backend server for the Humanity Club Organization (HCO) website.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hco

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Set up MongoDB:
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in `.env` file

4. Set up Cloudinary:
   - Create a Cloudinary account at https://cloudinary.com
   - Get your cloud name, API key, and API secret
   - Update the Cloudinary configuration in `.env` file

5. Create an admin user:
```bash
node scripts/createAdmin.js
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/admin/login` - Admin login
- `POST /api/v1/admin/refresh-token` - Refresh access token
- `POST /api/v1/admin/logout` - Logout

### Projects
- `GET /api/v1/projects` - Get all projects
- `PUT /api/v1/projects/:projectId` - Update project details (Admin only)
- `POST /api/v1/projects/:projectId/image` - Update project image (Admin only)

### Donation Details
- `GET /api/v1/donation-details` - Get donation details
- `PUT /api/v1/donation-details` - Update donation details (Admin only)
- `POST /api/v1/donation-details/qr` - Update QR code image (Admin only)

## Security Features

- JWT-based authentication with access and refresh tokens
- Password hashing using bcrypt
- Protected admin routes
- CORS configuration
- Secure file uploads with Cloudinary
- Input validation and sanitization 