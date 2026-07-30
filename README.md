# Interview Slot Booking App (MERN)

## What's included
- **backend/**: Express + MongoDB (Mongoose) API — auth (JWT), services, slots (next 3 days),
  bookings (atomic reservation to prevent double-booking), dashboard endpoint.
- **frontend/**: React (Vite) app — Register/Login, service list, slot picker + payment
  choice (Prepaid/COD), dashboard of past/upcoming bookings.

## How data integrity (ACID) is handled
MongoDB guarantees that a single document write is atomic. Booking a slot is implemented
as ONE atomic update:

```js
Slot.findOneAndUpdate(
  { _id: slotId, $expr: { $lt: ["$bookedCount", "$capacity"] } },
  { $inc: { bookedCount: 1 } },
  { new: true }
)
```

This only succeeds if there's still room. If two users hit "Confirm" on the last seat at
the exact same millisecond, MongoDB serializes the two writes — only one `findOneAndUpdate`
will match the `$lt` condition, so only one booking is created. No double-booking is
possible. If the booking document then fails to save for any reason, the increment is
rolled back so the slot count and the ledger of bookings never drift apart.

## Setup (run these in order)

### 1. MongoDB
Install MongoDB locally, or use a free MongoDB Atlas cluster. You need a connection string.

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and a random JWT_SECRET
npm run seed     # creates services + 3 days of slots
npm run dev      # starts API on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev       # starts app on http://localhost:5173
```

The Vite dev server proxies `/api` calls to `http://localhost:5000`, so just open
http://localhost:5173 in your browser.

## Test flow
1. Open the app → see services grouped by Senior Wellness / Mobility.
2. Click "Book Now" on any service → redirected to login/register (auth required to book).
3. Log in → pick a slot from the next 3 days → choose Prepaid or COD → Confirm.
4. Go to "My Bookings" → see it under Upcoming, with a Cancel option.

## Folder structure
```
kineticage/
├── backend/
│   ├── config/db.js
│   ├── models/ (User, Service, Slot, Booking)
│   ├── middleware/auth.js
│   ├── routes/ (auth, services, slots, bookings)
│   ├── utils/seed.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/Navbar.jsx
        ├── pages/ (Home, Login, Register, Booking, Dashboard)
        └── App.jsx, main.jsx, styles.css
```

## What to explain if asked in an interview
- **Auth**: JWT signed on register/login, stored in localStorage, sent as `Authorization: Bearer <token>`, verified by `middleware/auth.js`.
- **Why atomic update instead of a transaction**: real MongoDB transactions need a replica set; the `$expr`+`$inc` atomic update achieves the same "no double booking" guarantee on a single standalone instance, which is faster to set up. If you want to explicitly mention transactions, the write-up in `bookings.js` comments explains the reasoning.
- **DRY**: axios instance auto-attaches the token; ProtectedRoute wraps any page needing auth.
