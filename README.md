# E-Skool

A full-stack student registration and authentication system built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- ✅ User signup with validation
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ MongoDB Atlas database
- ✅ Responsive frontend

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Fetch API for async requests

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/E-Skool.git
cd E-Skool
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student_portal?retryWrites=true&w=majority
PORT=3001
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### 4. Run the server
```bash
npm run dev
```

### 5. Open in browser
```
http://localhost:3001/signup.html
```

## Project Structure

```
Student_registration_portal/
├── models/
│   └── user.js           # User schema
├── routes/
│   └── auth.js           # Signup/login routes
├── public/
│   ├── signup.html
│   ├── signup.css
│   ├── login.html
│   ├── login.css
│   ├── dashboard.html
│   └── dashboard.css
├── server.js             # Express server
├── db.js                 # MongoDB connection
├── package.json
└── .env                  # Environment variables (not in git)
```

## API Endpoints

### POST `/api/signup`
Create a new user account.

**Request body:**
```json
{
  "srn": "1RV17CS001",
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "department": "CSE",
  "year": "3"
}
```

### POST `/api/login`
Authenticate user and return JWT cookie.

**Request body:**
```json
{
  "identifier": "john@example.com",
  "password": "SecurePass123",
  "remember": false
}
```

## Deployment

See deployment guides:
- [Render](https://render.com/docs)
- [Railway](https://railway.app/docs)
- [Vercel](https://vercel.com/docs) (for static frontend only)

## License

MIT

## Author

Harshit Baliyan
```