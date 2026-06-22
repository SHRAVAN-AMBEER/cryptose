# CRYPTOSE

CRYPTOSE is a full‑stack cryptocurrency dashboard and tracking app. It combines a Flask backend (MongoDB) with a React frontend to provide market data, price history and comparison visualizations, role‑based user management (User / Member / Admin), and coin‑view tracking.

This README explains what the project does, how it is structured, and how to run it locally for development.

---

## Table of contents
- Features
- Tech stack
- Project structure
- API (summary)
- Frontend routes (summary)
- Setup (development)
  - Prerequisites
  - Backend
  - Frontend
- Environment & configuration
- Security notes & recommendations
- Contributing
- License

---

## Features
- Browse cryptocurrency market data and trending coins
- Get price history (last 7 days) returned as JSON plus a base64-encoded PNG chart
- Compare multiple coins and generate comparison charts
- Role-based accounts: User, Member, Admin (register, promote/demote, delete)
- Track coin views and coin-comparison events per user/member (stored in MongoDB)
- Server-side chart generation (Matplotlib) and client-side charts (Chart.js)

---

## Tech stack
- Backend: Python, Flask, Flask-PyMongo, Matplotlib, Requests
- Database: MongoDB
- Frontend: React (Create React App), Chart.js, react-router-dom, Tailwind CSS
- HTTP client: axios

---

## Project structure (high level)
- backend/
  - app.py — main Flask application with routes and API logic
  - config.py — configuration defaults (placeholder keys present; override in production)
  - init_db.py — DB initialization utilities
  - requirements.txt — Python dependencies
  - routes/ — additional Flask blueprints (compare blueprint registered in app.py)
  - utils/ — helper modules (e.g., CoinGecko wrapper)
  - templates/ — optional Flask templates
- frontend/
  - package.json — React app config, proxy set to the backend
  - src/ — React source code (components, pages, context, styles)
- package-lock.json, node_modules/ (do not commit in general)

---

## API (summary)
The backend exposes numerous endpoints. Below is a concise reference; see `backend/app.py` for implementation details.

General
- GET / — health check (returns a running message)
- GET /test-db — ping MongoDB and list collections

Authentication & profile
- GET /check-auth — checks presence of Bearer token header (token verification is NOT implemented)
- GET /profile?email=<email> — get profile (users/members/admins), hides password
- PUT /profile — update profile (JSON body, requires email)
- POST /check-email — check whether an email exists and in which collection
- POST /reset-password — reset password (email + newPassword)

Registration
- POST /register/user — register a new User
- POST /register/member — register a new Member
- POST /register/admin — register a new Admin

User administration
- GET /admins — list admins
- GET /get/users — list all users (password hidden)
- GET /get/members — list all members
- POST /promote/user — promote user to member (expects JSON { id })
- POST /demote/member — demote member to user (expects JSON { id })
- DELETE /delete/<role>/<id> — delete user or member by role and id

Crypto data & visualization
- GET /api/market-data — market data (CoinGecko)
- GET /api/member-market-data — extended market data for members
- GET /api/crypto — filtered popular coins
- GET /trending — trending market data (CoinGecko)
- GET /api/coin-history/<coin_id> — historical price data + base64 PNG of chart
- GET /api/compare?coins=coin1,coin2,... — comparison chart as base64 PNG

Coin view tracking
- POST /track-coin-view — track a coin view (requires Authorization header)
- POST /track-compare-coins — track comparison event for member
- GET /get-coin-history?email=<email> — get stored coin history for a user/member/admin

Auth flows
- POST /login — login (checks admins -> members -> users by email and password)
- POST /forgot-password — update password across collections if email found

---

## Frontend routes (from `frontend/src/App.js`)
- `/` — Home
- `/login` — Login
- `/signup` — Signup hub
- `/signup/admin`, `/signup/member`, `/signup/user` — role-specific signups
- `/forgot-password` — Forgot password page
- `/profile` — Profile
- `/markets` — Markets overview
- `/cryptos` — Crypto list
- `/graph/:coinName` — coin graph
- `/coin/:id` — coin detail graph
- `/compare`, `/compare-graph` — comparison pages
- `/gemini-recommendations` — Gemini recommendations page
- `/AdminDashboard`, `/MemberDashboard`, `/UserDashboard` — dashboards per role

---

## Setup (development)
Prerequisites
- Node.js and npm (or yarn)
- Python 3.10+ recommended
- MongoDB running locally (or a hosted MongoDB instance)
- (Optional) Python virtual environment

Backend
1. cd backend
2. (optional) python -m venv venv
3. Activate the virtualenv:
   - macOS/Linux: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
4. Install dependencies:
   - `pip install -r requirements.txt`
5. Ensure MongoDB is running. Default URI used in code: `mongodb://localhost:27017/cryptose` (override for production)
6. Run the backend server:
   - `python app.py` (runs on localhost:5000 by default)

Frontend
1. cd frontend
2. Install dependencies:
   - `npm install`
3. Start the dev server:
   - `npm start`

Note: frontend/package.json sets `proxy` to `http://localhost:5000`, so API calls to `/api/*` will route to the Flask backend in development.

---

## Environment & configuration
Important configuration values are in `backend/config.py`. For production, set these via environment variables and do NOT commit secrets.
- MONGO_URI — MongoDB connection string (default in config.py points to localhost)
- JWT_SECRET_KEY — JWT secret (placeholder value in repo; override in production)
- GEMINI_API_KEY — placeholder present in `config.py` — remove from repo and supply via env var

---

## Security notes & recommendations
- Passwords are currently stored and compared as plaintext in the database. This is NOT secure for production. Implement password hashing (bcrypt or argon2) before storing passwords and use secure comparison on login.
- JWT verification: `check-auth` only checks presence of the Authorization header. Implement proper JWT signing and verification for protected routes.
- Remove hard-coded API keys from `config.py` and use environment variables or a secret management service.
- Protect MongoDB (do not expose an unauthenticated MongoDB instance to the public internet). Use network rules and authentication.

---

## Development & testing tips
- Use `GET /test-db` to confirm MongoDB connectivity
- Use Postman or curl to exercise endpoints (register/login/track)
- Consider adding unit tests and a CI workflow
- Consider dockerizing backend, frontend, and MongoDB with `docker-compose` for a consistent dev environment

---

## Contributing
Contributions are welcome. Suggested workflow:
1. Fork the repository
2. Create a branch for your change
3. Add tests and ensure existing tests pass
4. Open a pull request describing your change

Please avoid committing `node_modules` or any secret keys.

---

## License
If you don’t have a license yet, consider using the MIT License. Let me know if you want me to add a LICENSE file.

---

If you'd like, I can also:
- Add example curl / Postman requests for key endpoints
- Add Docker and docker-compose files for local development
- Add password hashing and JWT examples

