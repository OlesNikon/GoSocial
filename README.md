# GoSocial - Social Media Platform

A full-stack social media platform built with Go (backend) and React + TypeScript (frontend), featuring posts, comments, followers, user authentication, and more.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Posts & Comments**: Create, read, update, and delete posts with commenting functionality
- **Social Features**: Follow/unfollow users, personalized feed
- **User Invitations**: Email-based user invitation system using SendGrid
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Caching**: Redis-based caching for improved performance
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Database Migrations**: Version-controlled database schema migrations
- **Docker Support**: Containerized deployment with Docker and Docker Compose

## 🛠️ Tech Stack

### Backend
- **Language**: Go 1.25
- **Router**: Chi
- **Database**: PostgreSQL 16
- **Cache**: Redis 6.2
- **Authentication**: JWT tokens
- **Email**: SendGrid
- **API Docs**: Swagger/OpenAPI
- **Logging**: Zap

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS
- **HTTP Client**: Axios

## 📋 Prerequisites

- Go 1.25 or higher
- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 16 (if not using Docker)
- Redis (if not using Docker)
- Make (optional, for using Makefile commands)

## 🚦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/OlesNikon/GoSocial.git
cd GoSocial
```

### 2. Set Up Environment Variables

Create a `.envrc` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .envrc
```

Update the configuration values:

```bash
# Server Configuration
ADDR=:8080
EXTERNAL_URL=localhost:8080
ENV=development

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGIN=http://localhost:5173

# Database Configuration
DB_ADDR=postgres://admin:adminpassword@localhost:5432/socialnetwork?sslmode=disable
DB_MAX_OPEN_CONNS=30
DB_MAX_IDLE_CONNS=30
DB_MAX_IDLE_TIME=15m

# Redis Configuration
REDIS_ADDR=localhost:6379
REDIS_PW=
REDIS_DB=0
REDIS_ENABLED=true

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com

# Authentication Configuration
AUTH_BASIC_USER=admin
AUTH_BASIC_PASS=your_secure_password
AUTH_TOKEN_SECRET=your_very_long_random_secret_at_least_32_chars

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATELIMITER_REQUESTS_COUNT=100
```

### 3. Start Infrastructure Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port `5432`
- Redis on port `6379`
- Redis Commander (web UI) on port `8081`

### 4. Run Database Migrations

```bash
make migrate-up
```

### 5. Seed the Database (Optional)

```bash
make seed
```

### 6. Start the Backend

```bash
go run ./cmd/api
```

Or using Air for hot reload:

```bash
air
```

The API will be available at `http://localhost:8080`

### 7. Start the Frontend

```bash
cd web
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📚 API Documentation

Once the backend is running, visit:

- **Swagger UI**: `http://localhost:8080/swagger/index.html`

To regenerate API documentation:

```bash
make gen-docs
```

## 🧪 Testing

Run all tests:

```bash
make test
```

Or directly:

```bash
go test -v ./...
```

## 🗂️ Project Structure

```
.
├── cmd/
│   ├── api/              # API server and handlers
│   └── migrate/          # Database migrations and seeding
├── internal/
│   ├── auth/             # Authentication logic (JWT)
│   ├── db/               # Database connection and utilities
│   ├── env/              # Environment variable handling
│   ├── mailer/           # Email service (SendGrid)
│   ├── ratelimiter/      # Rate limiting implementation
│   └── store/            # Data access layer
│       └── cache/        # Redis caching layer
├── docs/                 # Swagger documentation
├── scripts/              # Utility scripts
├── web/                  # React frontend application
├── docker-compose.yml    # Docker services configuration
├── Dockerfile            # Backend container image
├── Makefile              # Build and task automation
└── go.mod                # Go dependencies
```

## 🗄️ Database Migrations

### Create a new migration

```bash
make migration <migration_name>
```

### Run migrations

```bash
make migrate-up
```

### Rollback migrations

```bash
make migrate-down <number_of_steps>
```

## 🔐 Authentication

The API uses JWT tokens for authentication. To access protected endpoints:

1. Register a new user: `POST /v1/users`
2. Activate your account via the invitation email
3. Login: `POST /v1/authentication/token`
4. Include the token in the `Authorization` header: `Bearer <your_token>`

## 🚢 Deployment

### Using Docker

Build the backend image:

```bash
docker build -t gosocial:latest .
```

Run with docker-compose:

```bash
docker-compose up
```

## 📝 Available Make Commands

```bash
make migration <name>    # Create a new database migration
make migrate-up          # Run all pending migrations
make migrate-down <n>    # Rollback n migrations
make seed                # Seed the database with test data
make gen-docs            # Generate Swagger documentation
make test                # Run all tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Oles Nikon**
- GitHub: [@OlesNikon](https://github.com/OlesNikon)

## 🙏 Acknowledgments

- Built as a learning project for Go backend development
- Inspired by modern social media platforms
- Thanks to the Go and React communities for excellent tools and libraries

---

⭐ Star this repository if you find it helpful!
