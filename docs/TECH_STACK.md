# TTS Booking System - Tech Stack

## Backend Framework
**Node.js + Express.js** v20+
- RESTful API development
- Async/await support
- Middleware ecosystem

## Database
**PostgreSQL 15+**
- JSONB support for flexible fields
- Full-text search capabilities
- Azure Database for PostgreSQL

## Authentication
**JWT (JSON Web Tokens)**
- Token-based stateless auth
- 24-hour session expiry
- Bcrypt password hashing (rounds: 12)

## Payment Processing
**ECPay Integration (Phase 1)**
- Provider self-managed payment
- No platform transaction fees
- Standard ECPay SDK for Node.js

## Infrastructure
**Microsoft Azure**
- Azure App Service (Node.js)
- Azure Database for PostgreSQL
- Azure Storage (file uploads)
- Azure Key Vault (secrets management)
- Azure Application Insights (monitoring)

## API Documentation
**Swagger/OpenAPI 3.0**
- Auto-generated API docs
- Interactive testing interface
- Request/response schemas

## Testing
**Jest + Supertest**
- Unit testing
- Integration testing
- API endpoint testing

## Code Quality
**ESLint + Prettier**
- Code style consistency
- Automatic formatting
- Best practices enforcement

## Environment
**.env-based Configuration**
- Development
- Staging
- Production
- Database credentials
- API keys
- JWT secrets

## Project Structure
```
tts-booking/
├── src/
│  ├── api/
│  │  ├── routes/
│  │  ├── controllers/
│  │  └── middleware/
│  ├── services/
│  ├── models/
│  ├── utils/
│  ├── config/
│  └── server.js
├── tests/
│  ├── unit/
│  ├── integration/
└  ├── e2e/
├── docs/
├── config/
└── package.json
```

## Dependencies (Phase 1)
**Core Framework**
- express: ^4.18.0
- dotenv: ^16.0.0

**Database**
- pg: ^8.10.0
- sequelize: ^6.35.0

**Authentication**
- jsonwebtoken: ^9.0.0
- bcryptjs: ^2.4.3

**Validation**
- joi: ^17.10.0

**API Documentation**
- swagger-ui-express: ^5.0.0
- swagger-jsdoc: ^6.2.0

**Testing**
- jest: ^29.0.0
- supertest: ^6.3.0

**Code Quality**
- eslint: ^8.50.0
- prettier: ^3.0.0

**Utilities**
- axios: ^1.6.0 (external API calls)
- uuid: ^9.0.0
- cors: ^2.8.5
- helmet: ^7.0.0 (security)

## Deployment
**Azure App Service**
- Runtime: Node.js 20 LTS
- Build: npm run build
- Start: npm start
- Port: 3000

**Environment Variables**
```
PORT=3000
NODE_ENV=production
DB_HOST=<azure-postgres-host>
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_NAME=tts_booking
JWT_SECRET=<jwt-secret>
JWT_EXPIRY=86400
ECPAY_API_KEY=<ecpay-key>
```
