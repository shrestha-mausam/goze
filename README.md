# Goze - Financial Expense Tracking Application

**Goze** is a comprehensive financial expense tracking application that helps you track, manage, and visualize your weekly expenses. It integrates with Plaid to securely connect to your financial institutions and automatically sync transactions.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Plaid Integration](#plaid-integration)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

Goze is a full-stack financial management application built with:
- **Frontend**: Next.js 15 with React 18 and TypeScript
- **Backend**: Spring Boot 3.4.4 with Java 21
- **Database**: PostgreSQL
- **Integration**: Plaid API for financial data

The application provides:
- Secure user authentication with JWT tokens
- Automatic transaction synchronization from financial institutions
- Real-time expense tracking and visualization
- Account management across multiple financial institutions
- Transaction categorization and reporting

## Architecture

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   Next.js       │         │   Spring Boot   │         │   PostgreSQL    │
│   Frontend      │◄───────►│   Backend API   │◄───────►│   Database      │
│   (Port 8181)   │         │   (Port 8080)   │         │   (Port 5432)   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                           │
         │                           │
         │                           ▼
         │                  ┌─────────────────┐
         │                  │   Plaid API     │
         │                  │   (External)    │
         │                  └─────────────────┘
         │
         ▼
┌─────────────────┐
│   User Browser  │
└─────────────────┘
```

### Request Flow

1. **Client Request**: User interacts with Next.js frontend
2. **API Route**: Next.js API route processes request (server-side)
3. **Backend Service**: Spring Boot controller handles business logic
4. **Database**: PostgreSQL stores and retrieves data
5. **Plaid Integration**: External API calls for financial data
6. **Response**: Data flows back through the layers to the client

### Directory Structure

```
goze/
├── client/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── api/          # API routes (proxy to backend)
│   │   │   ├── home/         # Dashboard page
│   │   │   ├── login/        # Login page
│   │   │   └── reports/      # Reports page
│   │   ├── components/       # React components
│   │   ├── contexts/         # React Context providers
│   │   ├── lib/              # Utilities and types
│   │   └── styles/           # CSS and themes
│   ├── package.json
│   └── tsconfig.json
│
├── server/                    # Spring Boot backend application
│   ├── src/main/java/
│   │   └── com/mshrestha/goze/
│   │       ├── config/       # Configuration classes
│   │       ├── controller/   # REST controllers
│   │       ├── dto/          # Data Transfer Objects
│   │       ├── model/        # JPA entities
│   │       ├── repository/   # Data access layer
│   │       ├── scheduler/    # Scheduled tasks
│   │       ├── security/     # Security configuration
│   │       ├── service/      # Business logic
│   │       └── utils/        # Utility classes
│   ├── src/main/resources/
│   │   ├── application.yml   # Main configuration
│   │   └── db/migration/     # Database migrations
│   └── pom.xml
│
├── docs/                      # Additional documentation
├── Dockerfile                 # Docker configuration
└── README.md                  # This file
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15.3.0
- **Language**: TypeScript 5.3.3
- **UI Library**: PrimeReact 10.5.1, PrimeFlex 3.3.1
- **Charts**: Chart.js 4.4.8
- **Plaid Integration**: react-plaid-link 3.0.0
- **Icons**: FontAwesome 6.7.2

### Backend
- **Framework**: Spring Boot 3.4.4
- **Language**: Java 21
- **Security**: Spring Security with JWT
- **Database**: PostgreSQL with JPA/Hibernate
- **Build Tool**: Maven
- **JSON Processing**: Google Gson 2.10.1
- **Rate Limiting**: Bucket4j 7.6.0

### Database
- **RDBMS**: PostgreSQL
- **Migration**: Flyway (via Spring Boot)

### External Services
- **Financial Data**: Plaid API

## Features

### Authentication & Security
- ✅ JWT-based authentication with access and refresh tokens
- ✅ Account locking after failed login attempts
- ✅ Rate limiting to prevent brute force attacks
- ✅ Password hashing with BCrypt
- ✅ Secure token storage in HTTP-only cookies

### Financial Management
- ✅ Connect multiple financial institutions via Plaid
- ✅ Automatic transaction synchronization
- ✅ Real-time account balance tracking
- ✅ Transaction categorization
- ✅ Expense visualization with charts
- ✅ Transaction history and filtering

### User Experience
- ✅ Responsive design with PrimeReact components
- ✅ Dark/Light theme support
- ✅ Real-time data updates
- ✅ Intuitive dashboard interface

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Java 21** or higher
- **Node.js 18+** and npm
- **PostgreSQL 12+**
- **Maven 3.8+**
- **Plaid Account** (for financial integration)
- **Docker** (optional, for containerized deployment)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd goze
```

### 2. Database Setup

#### Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker run --name goze-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=goze \
  -p 5432:5432 \
  -d postgres:15

# Wait for container to start, then run migration
docker exec -i goze-postgres psql -U postgres -d goze < server/src/main/resources/db/migration/V1_create_initial_schema.sql
```

#### Manual Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and schema
CREATE DATABASE goze;
\c goze
\i server/src/main/resources/db/migration/V1_create_initial_schema.sql
```

### 3. Backend Setup

#### Configure Environment Variables

Create a `.env` file in the `server/` directory (or set environment variables):

```bash
# Database Configuration
DB_URL=jdbc:postgresql://localhost:5432/goze?currentSchema=goze
DB_USERNAME=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your-secret-key-here-minimum-64-characters-for-HS512-algorithm

# Plaid Configuration
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_PUBLIC_KEY=your-plaid-public-key
PLAID_ENVIRONMENT=sandbox  # or 'production'
```

#### Build and Run Backend

```bash
cd server

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

#### Configure Environment Variables

Create a `.env.local` file in the `client/` directory:

```bash
# Backend API URL
BACKEND_API_URL=http://localhost:8080/api/v1

# Next.js Configuration
NODE_ENV=development
```

#### Install Dependencies and Run

```bash
cd client

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on `http://localhost:8181`

### 5. Verify Setup

1. Open `http://localhost:8181` in your browser
2. Register a new account
3. Login with your credentials
4. You should see the dashboard

## Plaid Integration

### Overview

Plaid integration allows users to securely connect their financial accounts and automatically sync transactions. The integration follows Plaid's standard flow:

1. **Link Token Creation**: Generate a link token for Plaid Link
2. **User Authentication**: User connects account via Plaid Link UI
3. **Public Token Exchange**: Exchange public token for access token
4. **Account & Transaction Sync**: Fetch and store accounts and transactions

### Setup Plaid Account

1. **Create Plaid Account**
   - Visit [Plaid Dashboard](https://dashboard.plaid.com/)
   - Sign up for a developer account
   - Create a new application

2. **Get Credentials**
   - **Client ID**: Found in your Plaid dashboard
   - **Secret**: Found in your Plaid dashboard (different for each environment)
   - **Public Key**: Found in your Plaid dashboard (for Link)
   - **Environment**: Use `sandbox` for development, `production` for live

3. **Configure Environment Variables**
   ```bash
   PLAID_CLIENT_ID=your-client-id
   PLAID_SECRET=your-secret-key
   PLAID_PUBLIC_KEY=your-public-key
   PLAID_ENVIRONMENT=sandbox
   ```

### Plaid Integration Flow

#### 1. Create Link Token

**Endpoint**: `POST /api/v1/plaid/link_token/create`

**Request**: Automatically handled by backend (uses authenticated user's ID)

**Response**:
```json
{
  "success": true,
  "data": {
    "link_token": "link-sandbox-xxx",
    "expiration": "2024-01-01T00:00:00Z"
  }
}
```

#### 2. Initialize Plaid Link (Frontend)

```typescript
import { usePlaidLink } from 'react-plaid-link';

const { open, ready } = usePlaidLink({
  token: linkToken,
  onSuccess: (publicToken, metadata) => {
    // Exchange public token
    exchangePublicToken(publicToken);
  },
});

// Open Plaid Link
open();
```

#### 3. Exchange Public Token

**Endpoint**: `POST /api/v1/plaid/public_token/exchange`

**Request**:
```json
{
  "public_token": "public-sandbox-xxx"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "item_id": "item-xxx",
    "access_token": "access-sandbox-xxx"
  }
}
```

#### 4. Automatic Transaction Sync

After successful token exchange:
- Accounts are automatically fetched and stored
- Initial transaction sync is performed
- Scheduled sync runs daily at midnight (configurable)

### Plaid API Endpoints

The backend implements the following Plaid endpoints:

- **Link Token Create**: `/api/v1/plaid/link_token/create`
- **Exchange Public Token**: `/api/v1/plaid/public_token/exchange`
- **Get Accounts**: `/api/v1/dashboard/accounts`
- **Get Transactions**: `/api/v1/dashboard/transactions`

### Testing with Plaid Sandbox

Plaid Sandbox provides test credentials:

- **Username**: `user_good`
- **Password**: `pass_good`
- **Institution**: Search for "First Platypus Bank" or "Chase"

### Transaction Sync Scheduler

The application includes a scheduled task that automatically syncs transactions:

- **Frequency**: Daily at midnight (configurable)
- **Scope**: All active Plaid items
- **Process**: 
  1. Fetches new transactions from Plaid
  2. Updates existing transactions
  3. Removes deleted transactions
  4. Updates cursor for incremental sync

Configuration in `TransactionSyncScheduler.java`:
```java
@Scheduled(cron = "0 0 0 * * *") // Midnight daily
public void syncAllTransactions() { ... }
```

## Database Schema

### Core Tables

#### Users
- `id` (UUID): Primary key
- `user_name` (VARCHAR): Unique username
- `email` (VARCHAR): Unique email
- `password_hash` (VARCHAR): BCrypt hashed password
- `failed_login_attempts` (INTEGER): Failed login counter
- `account_locked_until` (TIMESTAMP): Lockout expiration

#### Plaid Items
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users
- `item_id` (VARCHAR): Plaid item identifier
- `access_token` (VARCHAR): Encrypted Plaid access token
- `institution_id` (VARCHAR): Plaid institution ID
- `institution_name` (VARCHAR): Institution display name
- `cursor` (VARCHAR): Transaction sync cursor
- `is_active` (BOOLEAN): Active status

#### Accounts
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users
- `plaid_item_id` (UUID): Foreign key to plaid_items
- `account_id` (VARCHAR): Plaid account identifier
- `name` (VARCHAR): Account display name
- `type` (VARCHAR): Account type (depository, credit, etc.)
- `current_balance` (DECIMAL): Current balance
- `available_balance` (DECIMAL): Available balance

#### Transactions
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to users
- `account_id` (VARCHAR): Foreign key to accounts
- `plaid_transaction_id` (VARCHAR): Plaid transaction identifier
- `amount` (DECIMAL): Transaction amount
- `date` (DATE): Transaction date
- `name` (VARCHAR): Transaction name
- `merchant_name` (VARCHAR): Merchant name
- `plaid_category` (VARCHAR): Plaid category
- `pending` (BOOLEAN): Pending status
- `location` (JSONB): Location data
- `payment_meta` (JSONB): Payment metadata

### Indexes

- `idx_transactions_user_date`: Optimizes transaction queries by user and date
- `idx_transactions_account`: Optimizes account-based queries
- `idx_accounts_user`: Optimizes user account queries

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

#### Refresh Token
```
POST /api/v1/auth/refresh
Content-Type: application/json
Cookie: refreshToken=xxx

{
  "refreshToken": "jwt-refresh-token"
}
```

#### Logout
```
POST /api/v1/auth/logout
Cookie: accessToken=xxx; refreshToken=xxx
```

### Dashboard Endpoints

#### Get Accounts
```
GET /api/v1/dashboard/accounts
Authorization: Bearer <access-token>
```

#### Get Transactions
```
GET /api/v1/dashboard/transactions
Authorization: Bearer <access-token>

Query Parameters:
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
- accountId: (optional)
```

#### Get Expenses
```
GET /api/v1/dashboard/transactions/expenses
Authorization: Bearer <access-token>

Query Parameters:
- startDate: YYYY-MM-DD
- endDate: YYYY-MM-DD
```

### Plaid Endpoints

#### Create Link Token
```
POST /api/v1/plaid/link_token/create
Authorization: Bearer <access-token>
```

#### Exchange Public Token
```
POST /api/v1/plaid/public_token/exchange
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "public_token": "public-sandbox-xxx"
}
```

## Development Workflow

### Running the Application

1. **Start Database** (if using Docker):
   ```bash
   docker start goze-postgres
   ```

2. **Start Backend**:
   ```bash
   cd server
   mvn spring-boot:run
   ```

3. **Start Frontend**:
   ```bash
   cd client
   npm run dev
   ```

### Code Organization

#### Frontend
- **Components**: Reusable UI components in `client/src/components/`
- **Pages**: Route pages in `client/src/app/`
- **API Routes**: Server-side API proxies in `client/src/app/api/`
- **Services**: API service functions (server-side only)
- **Types**: TypeScript type definitions

#### Backend
- **Controllers**: REST endpoints in `controller/`
- **Services**: Business logic in `service/`
- **Repositories**: Data access in `repository/`
- **DTOs**: Data transfer objects in `dto/`
- **Models**: JPA entities in `model/`

### Testing

#### Backend Tests
```bash
cd server
mvn test
```

#### Frontend Tests
```bash
cd client
npm test
```

### Building for Production

#### Backend
```bash
cd server
mvn clean package
# JAR file will be in target/goze-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd client
npm run build
# Production build in .next/
```

## Security Features

### Authentication Security

1. **JWT Tokens**
   - Access tokens: 1 hour expiration
   - Refresh tokens: 24 hour expiration
   - HMAC-SHA512 algorithm
   - Stored in HTTP-only cookies

2. **Password Security**
   - BCrypt hashing (10 rounds)
   - Never stored or transmitted in plain text
   - Minimum complexity requirements

3. **Account Protection**
   - Account locked after 5 failed login attempts
   - 30-minute lockout period
   - Automatic unlock after lockout expires

4. **Rate Limiting**
   - 5 login attempts per minute per IP
   - Prevents brute force attacks
   - Uses Bucket4j library

### API Security

1. **CORS Configuration**
   - Configured per environment
   - Allows specific origins only
   - Credentials enabled for authenticated requests

2. **Input Validation**
   - Server-side validation on all endpoints
   - SQL injection prevention via JPA
   - XSS protection via Next.js

3. **Token Validation**
   - JWT signature verification
   - Expiration checking
   - User authentication on every request

## Deployment

### Docker Deployment

The project includes a `Dockerfile` for containerized deployment:

```bash
# Build Docker image
docker build -t goze:latest .

# Run container
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://db:5432/goze \
  -e JWT_SECRET=your-secret \
  -e PLAID_CLIENT_ID=your-id \
  -e PLAID_SECRET=your-secret \
  goze:latest
```

### Environment-Specific Configuration

The backend supports multiple profiles:

- **local**: Development configuration
- **dev**: Development server configuration
- **prod**: Production configuration

Set active profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

### Production Checklist

- [ ] Set strong JWT secret (minimum 64 characters)
- [ ] Configure production database
- [ ] Set Plaid environment to `production`
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Review security settings

## Troubleshooting

### Common Issues

#### Database Connection Errors

**Error**: `Connection refused` or `Database goze does not exist`

**Solution**:
```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database exists
docker exec -it goze-postgres psql -U postgres -l

# Create database if missing
docker exec -it goze-postgres psql -U postgres -c "CREATE DATABASE goze;"
```

#### JWT Token Errors

**Error**: `Invalid token` or `Token expired`

**Solution**:
- Clear browser cookies
- Re-login to get new tokens
- Verify JWT_SECRET is set correctly
- Check token expiration settings

#### Plaid Integration Issues

**Error**: `Invalid client_id` or `Invalid secret`

**Solution**:
- Verify Plaid credentials in environment variables
- Check Plaid environment matches (sandbox vs production)
- Ensure Plaid account is active
- Verify API version compatibility

#### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
- Verify CORS configuration in `application-local.yml`
- Check frontend URL matches allowed origins
- Ensure credentials are properly configured

#### Transaction Sync Not Working

**Error**: Transactions not appearing

**Solution**:
- Check Plaid item is active in database
- Verify access token is valid
- Check scheduler is running (check logs)
- Manually trigger sync if needed

### Debugging Tips

1. **Backend Logs**:
   ```bash
   # Enable debug logging
   # In application-local.yml:
   logging:
     level:
       com.mshrestha.goze: DEBUG
   ```

2. **Frontend Logs**:
   - Check browser console
   - Check Network tab for API calls
   - Verify API responses

3. **Database Queries**:
   ```bash
   # Connect to database
   docker exec -it goze-postgres psql -U postgres -d goze

   # Check users
   SELECT * FROM goze.users;

   # Check plaid items
   SELECT * FROM goze.plaid_items;

   # Check transactions
   SELECT COUNT(*) FROM goze.transactions;
   ```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Plaid API Documentation](https://plaid.com/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation in `docs/` directory
- Review code comments for implementation details

---

**Note**: This README is a living document. Update it as the project evolves.

