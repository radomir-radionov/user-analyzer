# Backend API Documentation

## Project Overview

This project is a **Node.js backend** built with **Express.js** and **TypeScript**. It provides a RESTful API with user authentication, user management, and documentation using Swagger UI.

The project structure includes:

- **Authentication**: JWT-based authentication using `passport-jwt`.
- **Database**: Prisma as an ORM to interact with the database.
- **Validation**: Input validation with `express-validator`.
- **API Documentation**: Swagger UI for API docs.
- **Middleware**: Error handling, authentication, and input validation.

## Technologies Used

This project uses the following technologies and libraries:

- Node.js
- Express.js
- TypeScript
- Prisma (ORM)
- JWT for authentication
- Swagger UI for API documentation
- Bcrypt for password hashing
- Express-validator for input validation
- Nodemailer for sending emails

---

## Features

- **Authentication**: User signup, login, logout, and token refresh endpoints.
- **User Management**: CRUD operations for users.
- **Secure Passwords**: Passwords are hashed using `bcryptjs`.
- **Validation**: Input validation for all endpoints.
- **Error Handling**: Centralized error handling.
- **API Documentation**: Swagger UI integration.    
- **Welcome Email on Signup**: Users receive a welcome email after successful signup using `Nodemailer`.

---

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js >= 14.x
- npm or yarn
- A database (configured using Prisma)

---

## Installation

will be soon

## Running the Application

`npm run dev` - Start the development server with hot reload.     
`npm run build` -	Build the TypeScript code into JavaScript.      
`npm start` -	Start the production server.        
`npm run` prisma:seed	- Seed the database with initial data.

## API Documentation

- http://localhost:3000/api-docs/#/


## Project Structure

```arduino 
src
├── api
│   ├── auth
│   │   ├── constants
│   │   ├── services
│   │   ├── controller.ts
│   │   ├── routes.ts
│   │   ├── validations.ts
│   ├── user
│   │   ├── constants
│   │   ├── services
│   │   ├── controller.ts
│   │   ├── routes.ts
│   │   ├── validations.ts
├── config
│   ├── passport.ts
│   ├── swagger.ts
├── middleware
├── shared
├── utils
├── app.ts
├── index.ts
```