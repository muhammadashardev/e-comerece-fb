# E-Commerce Auth Backend

A robust Node.js/Express backend with complete authentication and authorization features.

## Features
- **Registration & Login**: Secure signup with OTP verification.
- **JWT Authentication**: Short-lived Access Tokens (15m) and long-lived Refresh Tokens (7d).
- **Refresh Token Rotation**: Secure session management.
- **OTP via Email**: Email verification and password reset using 6-digit OTP.
- **Role-Based Access Control (RBAC)**: Middleware for protecting routes based on roles (`user`, `admin`).
- **Security**: Password hashing (bcrypt), Cookie-based refresh tokens, Helmet headers, and CORS.

## API Endpoints

### Authentication (`/api/v1/auth`)
- `POST /signup`: Register a new user (sends OTP).
- `POST /verify-otp`: Verify email and get tokens.
- `POST /login`: Standard login.
- `POST /refresh-token`: Exchange refresh token for a new access token.
- `POST /forgot-password`: Request password reset OTP.
- `POST /reset-password`: Reset password using OTP.

### Testing Protected Routes
- `GET /me`: Get current user info (Requires `Bearer Token`).
- `GET /admin-only`: Access admin-only section (Requires `admin` role).

## How to Run

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configuration**:
   - Update `MONGO_URI` in `.env`.
   - Update `EMAIL_USER` and `EMAIL_PASS` for SMTP (OTP will fail without this).

3. **Start Server**:
   ```bash
   npm run dev (if nodemon installed) or node server.js
   ```

## Development
- Uses `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `nodemailer`, `cookie-parser`.
