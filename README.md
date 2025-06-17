# FlyLog FPV - Backend API

**Backend API for registering FPV flights, managing drones, and tracking pilot statistics.**

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
bun run src/index.ts
```

---

## 📬 API Endpoints

### 🏥 Estado
| Método | Endpoint           | Descripción                      | Autenticación |
|--------|--------------------|----------------------------------|---------------|
| GET    | `/health`          | Verificar estado del servidor    | No            |

### 🔐 Autenticación
| Método | Endpoint           | Descripción                      | Autenticación |
|--------|--------------------|----------------------------------|---------------|
| POST   | `/auth/register`   | Register new user                | No            |
| POST   | `/auth/login`      | Login user                       | No            |

### 👤 Usuarios
| Método | Endpoint            | Descripción                      | Autenticación |
|--------|---------------------|----------------------------------|---------------|
| GET    | `/users/profile`    | Get own profile                  | Required      |
| GET    | `/users`            | List all users                   | Required      |
| GET    | `/users/:id`        | Get user by ID                   | Required      |
| PATCH  | `/users/:id`        | Update user                      | Required      |
| DELETE | `/users/:id`        | Delete user                      | Required      |
| GET    | `/users/:id/drones` | List user's drones               | Required      |
| GET    | `/users/:id/flights`| List user's flights              | Required      |

### ✈️ Drones
| Método | Endpoint           | Descripción                      | Autenticación |
|--------|--------------------|----------------------------------|---------------|
| POST   | `/drones`          | Create new drone                 | Required      |
| GET    | `/drones`          | List all drones                  | Required      |
| GET    | `/drones/:id`      | Get drone by ID                  | Required      |
| PATCH  | `/drones/:id`      | Update drone                     | Required      |
| DELETE | `/drones/:id`      | Delete drone                     | Required      |

### 🏷️ Tipos de Drones
| Método | Endpoint           | Descripción                      | Autenticación |
|--------|--------------------|----------------------------------|---------------|
| POST   | `/drone-types`     | Create new drone type            | Required      |
| GET    | `/drone-types`     | List all drone types             | Required      |
| GET    | `/drone-types/:id` | Get drone type by ID             | Required      |
| PATCH  | `/drone-types/:id` | Update drone type                | Required      |
| DELETE | `/drone-types/:id` | Delete drone type                | Required      |

### 🏭 Marcas de Drones
| Método | Endpoint           | Descripción                      | Autenticación |
|--------|--------------------|----------------------------------|---------------|
| POST   | `/drone-brands`    | Create new drone brand           | Required      |
| GET    | `/drone-brands`    | List all drone brands            | Required      |
| GET    | `/drone-brands/:id`| Get drone brand by ID            | Required      |
| PATCH  | `/drone-brands/:id`| Update drone brand               | Required      |
| DELETE | `/drone-brands/:id`| Delete drone brand               | Required      |

### 🛫 Vuelos
| Método | Endpoint           | Descripción                      | Autenticación |
|--------|--------------------|----------------------------------|---------------|
| POST   | `/flights`         | Register new flight              | Required      |
| GET    | `/flights`         | List all flights                 | Required      |
| GET    | `/flights/:id`     | Get flight by ID                 | Required      |
| PATCH  | `/flights/:id`     | Update flight                    | Required      |
| DELETE | `/flights/:id`     | Delete flight                    | Required      |



More endpoints coming soon (leaderboard, zones, piezes...)

---

## 📄 License
MIT License

---

Made with ❤️ by @DaniInarejos
