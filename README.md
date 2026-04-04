<div align="center">

<img src="https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
<img src="https://img.shields.io/badge/Auth-JWT_+_OAuth2-FF6B35?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/Payments-Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white" />

<br/><br/>

# 🅿️ SlotHub — Backend API

### *The engine behind smart parking.*

REST API for SlotHub — a full-stack smart parking platform.  
JWT Auth | Google OAuth 2.0 | Razorpay Payments | Nodemailer | Rate Limiting | MVC Architecture

<br/>

[![Live API](https://img.shields.io/badge/⚡_Live_API-Render-46e3b7?style=for-the-badge)](https://smart-parking-system-backend-oco6.onrender.com)
[![Frontend Repo](https://img.shields.io/badge/🚀_Frontend_Repo-Vercel-22c55e?style=for-the-badge)](https://github.com/chiragdhiman99/smart-parking-system-frontend)

</div>

---

## 🧠 Core Problem Solved

### ⚡ Time-Based Slot Conflict Resolution

Most parking backends block a slot for the **entire day** once booked. SlotHub's booking logic validates against **time ranges** — so multiple users can book the same slot on the same day as long as their windows don't overlap.

```
Slot C1 — April 4, 2026
├── Booking 1: 10:00 AM → 12:00 PM  ✅ Allowed
├── Booking 2: 01:00 PM → 03:00 PM  ✅ Allowed  
└── Booking 3: 11:00 AM → 02:00 PM  ❌ Blocked (time conflict)
```

This maximizes slot utilization — one slot serves multiple users per day.

---

## 🏗️ Architecture

Clean **MVC pattern** with separation of concerns:

```
smart-parking-system-backend/
│
├── server.js              ← Entry point, Express setup, DB connect
│
├── config/
│   └── passport.js        ← Google OAuth 2.0 strategy (Passport.js)
│
├── models/                ← Mongoose schemas
│   ├── User.js            ← Driver / Owner / Admin
│   ├── Parking.js         ← Parking locations & slots
│   ├── Booking.js         ← Bookings with time-based conflict logic
│   └── Review.js          ← User reviews
│
├── controllers/           ← Business logic
│   ├── authController.js  ← Signup, login, user CRUD
│   ├── parkingController.js ← Parking CRUD, slot management
│   ├── bookingController.js ← Booking creation, conflict detection
│   ├── adminController.js ← Admin operations
│   └── paymentController.js ← Razorpay order & verification
│
├── routes/                ← Express routers
│   ├── authRoutes.js      ← /api/auth/*
│   ├── parkingRoutes.js   ← /api/parkings/*
│   ├── bookingRoutes.js   ← /api/bookings/*
│   ├── adminRoutes.js     ← /api/admin/*
│   └── paymentRoutes.js   ← /api/payment/*
│
├── middleware/
│   ├── ratelimiter.js     ← express-rate-limit (brute force protection)
│   └── validator.js       ← Input validation middleware
│
└── utils/
    └── sendEmail.js       ← Nodemailer email utility
```

---

## 🔌 API Endpoints

### Auth `/api/auth`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register new user |
| POST | `/login` | Login with email & password |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | Google OAuth callback → JWT redirect |
| GET | `/user/:userId` | Get user by ID |
| PUT | `/user/:userId` | Update user profile |
| GET | `/users` | Get all users (admin) |
| PUT | `/user/:userId/status` | Update user status |

### Parkings `/api/parkings`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all parking locations |
| POST | `/` | Add new parking (owner) |
| GET | `/:id` | Get parking detail |
| PUT | `/:id` | Update parking |
| DELETE | `/:id` | Delete parking |

### Bookings `/api/bookings`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create booking (with conflict check) |
| GET | `/user/:userId` | Get bookings by user |
| GET | `/parking/:parkingId` | Get bookings by parking |
| PUT | `/:id/status` | Update booking status |

### Payments `/api/payment`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-order` | Create Razorpay order |
| POST | `/verify` | Verify payment signature |

### Admin `/api/admin`
| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Admin login (rate limited) |
| GET | `/stats` | Platform-wide stats |

---

## 🔐 Authentication

### JWT Flow
```
POST /api/auth/login
     → Validate credentials
     → bcrypt.compare(password, hash)
     → jwt.sign({ userId, role }, secret, { expiresIn: '7d' })
     → Return token to client
```

### Google OAuth 2.0 Flow
```
GET /api/auth/google
     → Passport.js redirects to Google
     → User consents
GET /api/auth/google/callback
     → Passport.js receives profile
     → Find or create user in DB
     → jwt.sign({ userId, role })
     → Redirect to /{role}/dashboard?token=...
```

### Role-Based Access
- `driver` — search, book, view own bookings
- `owner` — manage listings, view bookings for their parkings
- `admin` — full platform access, protected route + rate limiting

---

## 💳 Payment Flow (Razorpay)

```
POST /api/payment/create-order
     → razorpay.orders.create({ amount, currency })
     → Return order_id to frontend

Razorpay checkout on frontend
     → Payment success

POST /api/payment/verify
     → crypto.createHmac('sha256', secret)
     → Verify razorpay_signature
     → If valid → confirm booking
     → Send confirmation email
```

---

## 📧 Email Notifications

Nodemailer sends booking confirmation emails automatically after successful payment:
- Booking details (slot, date, time, amount)
- Receipt summary
- Configured with Gmail SMTP

---

## 🛡️ Security

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs |
| Auth tokens | JWT (7d expiry) |
| Google login | Passport.js OAuth 2.0 |
| Brute force protection | express-rate-limit on admin login |
| Input validation | Custom validator middleware |
| Payment verification | HMAC SHA256 signature check |

---

## 🛠️ Tech Stack

| Package | Purpose |
|---|---|
| Node.js 22 | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database + ODM |
| Passport.js | Google OAuth 2.0 |
| jsonwebtoken | JWT auth |
| bcryptjs | Password hashing |
| Razorpay | Payment gateway |
| Nodemailer | Email service |
| express-rate-limit | Rate limiting |
| dotenv | Environment config |
| cors | Cross-origin requests |

---

## 🌐 Deployment

Deployed on **Render** with auto-deploy from GitHub main branch.

| | |
|---|---|
| **Live URL** | https://smart-parking-system-backend-oco6.onrender.com |
| **Platform** | Render (Node.js service) |
| **Database** | MongoDB Atlas (cloud) |
| **Node version** | 22.22.0 |

---

## 🚀 Run Locally

```bash
git clone https://github.com/chiragdhiman99/smart-parking-system-backend
cd smart-parking-system-backend
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
GMAIL_USER=your_gmail
GMAIL_PASS=your_app_password
```

```bash
node server.js
```

---

## 🔗 Related

- **Frontend Repo** → [smart-parking-system-frontend](https://github.com/chiragdhiman99/smart-parking-system-frontend)
- **Live App** → [smart-parking-system-frontend-kappa.vercel.app](https://smart-parking-system-frontend-kappa.vercel.app)

---

## 📬 Contact

**Chirag Dhiman**  
📧 dhimanchirag99@gmail.com  
🔗 [GitHub](https://github.com/chiragdhiman99)

---

<div align="center">

**Built with ❤️ from Dharamsala, Himachal Pradesh 🏔️**

⭐ Star this repo if you found it helpful!

</div>
