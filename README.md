# Hobbioo REST API

A RESTful API service built with Express.js and TypeScript, serving the Hobbioo Platform. This API implements clean architecture principles and provides user management functionality.

## Features

- Clean Architecture implementation
- User management (CRUD operations)
- Input validation and sanitization
- Error handling
- PostgreSQL database integration with Prisma ORM
- Logging system

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Winston (logging)

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd hobbioo-rest-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
DIRECT_URL="postgresql://username:password@localhost:5432/database_name"
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Migrate database:

```bash
npm run prisma:migrate
```

6. Start the server:

```bash
npm run dev
```

The server will start on port 3000 by default.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run start` - Start the production server
- `npm run serve` - Serve the built project
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Project Structure

## Error Handling

The API implements comprehensive error handling including:
- Validation errors
- Domain errors
- Database errors
- Use case errors

## Logging

Winston logger is configured to log:
- Error logs to console
- Daily rotating file logs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Oleksandr Riazantsev
