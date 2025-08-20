# Client Architecture Documentation

## Table of Contents
1. [Project Structure](#project-structure)
2. [Architecture Overview](#architecture-overview)
3. [API Call Flow](#api-call-flow)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Development Guidelines](#development-guidelines)
7. [Troubleshooting](#troubleshooting)

## Project Structure

### Directory Organization

```
client/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── api/               # API Routes (Server-side)
│   │   │   └── auth/          # Authentication endpoints
│   │   │       ├── login/route.ts
│   │   │       ├── register/route.ts
│   │   │       └── logout/route.ts
│   │   ├── home/              # Dashboard route (/home)
│   │   │   └── page.tsx
│   │   ├── login/             # Login route (/login)
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Root layout wrapper
│   │   ├── page.tsx           # Root route (/)
│   │   ├── loading.tsx        # Global loading UI
│   │   ├── error.tsx          # Global error boundary
│   │   └── not-found.tsx      # 404 page
│   ├── components/            # Reusable UI components
│   │   ├── AppLayout.tsx      # Main app layout wrapper
│   │   ├── LoginForm.tsx      # User authentication form
│   │   ├── RegisterForm.tsx   # User registration form
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   ├── Topbar.tsx         # Top navigation bar
│   │   ├── ChartOverview.tsx  # Financial data visualization
│   │   ├── Transactions.tsx   # Transaction management
│   │   ├── FinancialAccounts.tsx # Account management
│   │   └── CategoryManagement.tsx # Category management
│   ├── services/              # API and data services
│   │   ├── authentication.server.ts # Auth API calls
│   │   ├── transactions.server.ts   # Transaction API calls
│   │   ├── financialAccounts.server.ts # Account API calls
│   │   └── categoryManagement.server.ts # Category API calls
│   ├── lib/                   # Utility libraries
│   │   └── api.client.ts      # HTTP client configuration
│   ├── contexts/              # React Context providers
│   │   └── ThemeContext.tsx   # Theme/UI state management
│   ├── styles/                # CSS and styling
│   │   ├── globals.css        # Global CSS styles
│   │   └── theme.ts           # Theme configuration
│   ├── types/                 # TypeScript type definitions
│   │   └── server.ts          # Backend API types
│   └── middleware.ts          # Next.js middleware (authentication)
├── .eslintrc.js               # ESLint configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── .env.local                 # Environment variables (gitignored)
```

### Rationale Behind Organization

#### 1. **App Router Structure (`src/app/`)**
- **Modern Next.js 13+ Architecture**: Uses the latest App Router for better performance and developer experience
- **File-based Routing**: Each folder represents a route, with `page.tsx` as the route component
- **Co-located Files**: Loading, error, and layout files are placed alongside their routes for better organization
- **API Routes**: Server-side endpoints in `api/` folder for backend communication

#### 2. **Component Separation (`src/components/`)**
- **Reusable Components**: All UI components are modular and reusable
- **Single Responsibility**: Each component handles one specific functionality
- **PrimeReact Integration**: Uses PrimeReact for consistent, enterprise-grade UI components
- **Form Components**: Separate forms for login and registration with clear interfaces

#### 3. **Service Layer (`src/services/`)**
- **Server-side Services**: `.server.ts` files can only be imported in server components or API routes
- **API Abstraction**: Encapsulates backend communication logic
- **Error Handling**: Centralized error handling for API calls
- **Type Safety**: Full TypeScript integration with backend types

#### 4. **Type Safety (`src/types/`)**
- **Backend Contract**: Type definitions match Spring Boot backend responses
- **API Consistency**: Ensures frontend and backend stay in sync
- **Developer Experience**: IntelliSense and compile-time error checking

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.3.0 (React 18)
- **Language**: TypeScript 5.3.3
- **UI Library**: PrimeReact 10.5.1 + PrimeFlex 3.3.1
- **Styling**: CSS with PrimeFlex utility classes
- **State Management**: React Context + useState/useEffect
- **HTTP Client**: Native fetch API
- **Build Tool**: Next.js built-in bundler

### Architecture Principles
1. **Server-First**: Default to server components, use client components only when needed
2. **Type Safety**: Full TypeScript coverage for better development experience
3. **Separation of Concerns**: Clear separation between UI, business logic, and data fetching
4. **Performance**: Server-side rendering with client-side hydration where needed
5. **Security**: Server-side API calls prevent client-side exposure of sensitive logic

## API Call Flow

### Complete Request Flow Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │  Next.js API     │    │  Spring Boot    │    │   Database      │
│   Component     │    │  Route           │    │  Backend        │    │   (PostgreSQL)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         │ 1. User Action       │                       │                       │
         │ (click, submit)      │                       │                       │
         │                       │                       │                       │
         │ 2. Component State   │                       │                       │
         │ Update               │                       │                       │
         │                       │                       │                       │
         │ 3. API Call          │                       │                       │
         │ (fetch to /api/*)    │                       │                       │
         │                       │                       │                       │
         │                       │ 4. Route Handler     │                       │
         │                       │ (processes request)  │                       │
         │                       │                       │                       │
         │                       │ 5. Service Call      │                       │
         │                       │ (authentication.server.ts)                   │
         │                       │                       │                       │
         │                       │                       │ 6. HTTP Request      │
         │                       │                       │ (to Spring Boot)     │
         │                       │                       │                       │
         │                       │                       │ 7. Controller       │
         │                       │                       │ (AuthController.java)│
         │                       │                       │                       │
         │                       │                       │ 8. Service Layer    │
         │                       │                       │ (AuthService.java)   │
         │                       │                       │                       │
         │                       │                       │ 9. Repository       │
         │                       │                       │ (UserRepository.java)│
         │                       │                       │                       │
         │                       │                       │ 10. Database Query  │
         │                       │                       │ (SQL execution)      │
         │                       │                       │                       │
         │                       │                       │ 11. Database Result │
         │                       │                       │ (User data)          │
         │                       │                       │                       │
         │                       │                       │ 12. Service Response│
         │                       │                       │ (User object)        │
         │                       │                       │                       │
         │                       │                       │ 13. Controller      │
         │                       │                       │ Response             │
         │                       │                       │ (JSON response)      │
         │                       │                       │                       │
         │                       │ 14. Service Response  │                       │
         │                       │ (Response object)     │                       │
         │                       │                       │                       │
         │                       │ 15. Route Response    │                       │
         │                       │ (JSON + cookies)      │                       │
         │                       │                       │                       │
         │ 16. Component Update │                       │                       │
         │ (state, redirect)    │                       │                       │
         │                       │                       │                       │
```

### Detailed Flow Breakdown

#### 1. **Client-Side Component (e.g., LoginForm.tsx)**
```typescript
'use client';

export default function LoginForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Component makes API call to Next.js API route
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
      router.push('/home'); // Redirect on success
    }
  };
}
```

#### 2. **Next.js API Route (e.g., /api/auth/login/route.ts)**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import authService from '@/services/authentication.server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // API route calls server-side service
    const response = await authService.login(username, password);
    
    if (response.ok) {
      // Process response and set cookies
      const responseData = await response.json();
      const nextjsResp = NextResponse.json({ success: true });
      
      // Set JWT cookies
      nextjsResp.cookies.set('accessToken', responseData.data.accessToken);
      nextjsResp.cookies.set('refreshToken', responseData.data.refreshToken);
      
      return nextjsResp;
    }
  } catch (error) {
    // Error handling
  }
}
```

#### 3. **Server-Side Service (e.g., authentication.server.ts)**
```typescript
const authService = {
  login: async (username: string, password: string): Promise<Response> => {
    try {
      // Service makes HTTP call to Spring Boot backend
      const response = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      return response;
    } catch (error) {
      console.error('Login service error:', error);
      return Response.error();
    }
  }
};
```

#### 4. **Spring Boot Backend (AuthController.java)**
```java
@PostMapping("/login")
public ResponseEntity<ApiResponse<JwtTokenResponse>> loginUser(
    @RequestBody LoginRequest loginRequest,
    HttpServletRequest request) throws Exception {
    
    // Check rate limit
    authService.checkRateLimit(authService.getClientIP(request));
    
    // Authenticate user
    JwtTokenResponse tokenResponse = authService.loginUser(loginRequest);
    
    return ResponseEntity.ok(ApiResponse.success(tokenResponse));
}
```

## Component Architecture

### Component Hierarchy

```
AppLayout (Server Component)
├── ThemeProvider (Client Component)
│   └── PrimeReactProvider
│       ├── Sidebar (Client Component)
│       ├── Topbar (Client Component)
│       └── Page Content
│           ├── LoginForm (Client Component)
│           ├── RegisterForm (Client Component)
│           ├── ChartOverview (Client Component)
│           ├── Transactions (Client Component)
│           ├── FinancialAccounts (Client Component)
│           └── CategoryManagement (Client Component)
```

### Component Types

#### **Server Components (Default)**
- **Layout.tsx**: Root layout wrapper
- **Loading.tsx**: Loading UI
- **Error.tsx**: Error boundaries
- **API Routes**: Server-side endpoints

#### **Client Components (`'use client'`)**
- **Interactive Components**: Forms, buttons, state management
- **Event Handlers**: onClick, onChange, form submissions
- **Browser APIs**: localStorage, router navigation
- **State Management**: useState, useEffect, useContext

### Component Communication

1. **Props**: Parent to child data flow
2. **Context**: Global state (theme, authentication)
3. **Event Handlers**: Child to parent communication
4. **Router**: Navigation between pages
5. **Local Storage**: Persistent user preferences

## State Management

### React Context (ThemeContext.tsx)
```typescript
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = () => {
    setThemeType(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ themeType, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Local State Management
- **Form State**: Input values, validation, submission status
- **UI State**: Loading states, error messages, modal visibility
- **Navigation State**: Current page, sidebar collapse state

## Development Guidelines

### Code Organization Rules

1. **File Naming Convention**
   - Components: PascalCase (e.g., `LoginForm.tsx`)
   - Utilities: camelCase (e.g., `api.client.ts`)
   - Types: camelCase with `.server.ts` suffix for server-only types

2. **Import Organization**
   ```typescript
   // External libraries
   import React from 'react';
   import { Button } from 'primereact/button';
   
   // Internal components
   import LoginForm from '@/components/LoginForm';
   
   // Types and utilities
   import { LoginRequest } from '@/types.server';
   import { loginUser } from '@/lib/api.client';
   ```

3. **Component Structure**
   ```typescript
   'use client';
   
   // Imports
   import React, { useState, useEffect } from 'react';
   
   // Types
   interface ComponentProps {
     // Props definition
   }
   
   // Component
   export default function ComponentName({ prop }: ComponentProps) {
     // State
     const [state, setState] = useState();
     
     // Effects
     useEffect(() => {
       // Side effects
     }, []);
     
     // Event handlers
     const handleEvent = () => {
       // Event logic
     };
     
     // Render
     return (
       <div>
         {/* JSX */}
       </div>
     );
   }
   ```

### ESLint Rules and Best Practices

1. **No Unused Imports/Variables**: Keep code clean
2. **Restricted Imports**: Prevent server services in client components
3. **Type Safety**: Use proper TypeScript types, avoid `any`
4. **Console Statements**: Minimize console.log in production

### Environment Configuration

1. **Environment Variables**
   ```env
   # .env.local (gitignored)
   BACKEND_API_URL=http://localhost:8080/api/v1
   NODE_ENV=development
   ```

2. **Configuration Files**
   - `next.config.js`: Next.js configuration
   - `tsconfig.json`: TypeScript configuration
   - `.eslintrc.js`: Code quality rules

## Troubleshooting

### Common Issues and Solutions

#### 1. **"Database goze does not exist"**
```bash
# Connect to PostgreSQL container
podman exec -it <container-name> psql -U postgres

# Create database
CREATE DATABASE goze;

# Run schema
podman exec -i <container-name> psql -U postgres -d goze < server/src/main/resources/db/migration/V1_create_initial_schema.sql
```

#### 2. **Environment Variables Not Loading**
- Ensure `.env.local` exists in `client/` directory
- Restart Next.js development server after changes
- Check variable names match exactly (case-sensitive)

#### 3. **ESLint Errors**
- Run `npm run lint` to see all issues
- Use `npm run lint --fix` to auto-fix some issues
- Check `.eslintrc.js` configuration

#### 4. **Build Failures**
- Check for TypeScript errors: `npx tsc --noEmit`
- Verify all imports are correct
- Check for missing dependencies

#### 5. **API Connection Issues**
- Verify Spring Boot backend is running on port 8080
- Check `BACKEND_API_URL` environment variable
- Verify network connectivity between containers

### Development Workflow

1. **Start Backend**: `mvn spring-boot:run` in `server/` directory
2. **Start Frontend**: `npm run dev` in `client/` directory
3. **Database**: Ensure PostgreSQL container is running with `goze` database
4. **Environment**: Verify `.env.local` contains correct backend URL

### Performance Considerations

1. **Code Splitting**: Next.js automatically splits code by route
2. **Server Components**: Use server components when possible to reduce bundle size
3. **Image Optimization**: Use Next.js Image component for automatic optimization
4. **Lazy Loading**: Implement lazy loading for heavy components

### Security Best Practices

1. **Server-Side API Calls**: Never expose backend URLs in client code
2. **Environment Variables**: Keep sensitive data in `.env.local` (gitignored)
3. **Input Validation**: Validate all user inputs on both client and server
4. **HTTPS**: Use HTTPS in production environments
5. **CORS**: Configure CORS properly for production domains

---

*This documentation should be updated as the project evolves. For questions or clarifications, refer to the codebase or consult with the development team.* 