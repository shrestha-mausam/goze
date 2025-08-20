# Backend Server Integration Rules

## API Request Flow

All API requests must follow this flow:

1. **Browser/Client** makes request to Next.js API routes
2. **Next.js API Routes** process the request and call appropriate service
3. **Services** make API calls to the Spring Boot backend
4. **Spring Boot Backend** processes the request and returns response
5. **Next.js API** processes the response and returns to client 