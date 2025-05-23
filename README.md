# FlyLog FPV – Backend API

**Backend API to register FPV flights, manage drones, and track pilot statistics.**

Built with [Bun.js](https://bun.sh/), [Hono](https://hono.dev/), and [MongoDB + Mongoose](https://mongoosejs.com/).

---

## 🚀 Features

- Register and retrieve FPV flight logs
- Create and manage user profiles
- Log drones and assign them to users
- Track points and stats for leaderboard
- Built-in REST API structure with CORS & logging

---

## 🛠 Tech Stack

- **Runtime:** Bun.js
- **Framework:** Hono
- **Database:** MongoDB (via Mongoose)
- **Env Management:** Dotenv

---

## 📦 Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/flylog-fpv.git
cd flylog-fpv
```

2. **Install dependencies**
```bash
bun install
```

3. **Create a `.env` file**
```env
PORT=3000
MONGO_URI=mongodb+srv://<your-uri>
```

4. **Run the server**
```bash
bun run index.ts
```

---

## 📬 API Endpoints (MVP)

| Method | Endpoint           | Description                      |
|--------|--------------------|----------------------------------|
| GET    | `/`                | Health check                     |
| GET    | `/users/:id`       | Get user profile by ID           |
| POST   | `/users`           | Create new user                  |
| PUT    | `/users/:id`       | Update user profile              |
| GET    | `/flights`         | Get all flights (public/recent)  |
| POST   | `/flights`         | Log a new flight                 |
| GET    | `/flights/:id`     | Get flight details               |
| GET    | `/drones`          | List all drones (user's)         |
| POST   | `/drones`          | Add a new drone                  |
| GET    | `/leaderboard`     | Get global leaderboard           |

More endpoints coming soon (drones, leaderboard, zones...)

---

## 📄 License
MIT License

---

Made with ❤️ by @DaniInarejos
