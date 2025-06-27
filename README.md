# AcadNet

AcadNet is a full-stack web application designed to serve as an academy software. It includes user authentication (including OAuth with GitHub), profile management, and a modern frontend built with React and Vite.

## Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: Passport.js for OAuth, JWT for session management
- **Email**: Nodemailer for sending OTPs

### Frontend
- **Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Language**: TypeScript

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/anishkn04/AcadNet.git
    cd AcadNet
    ```

2.  **Install dependencies:**
    This will install both backend and frontend dependencies.
    ```bash
    npm install
    ```

3.  **Setup the database:**
    - Make sure your PostgreSQL server is running.
    - Create a new database. You can name it `acadnet` or choose another name.

4.  **Create a `.env` file:**
    Create a `.env` file in the root of the project and add the following environment variables. These are required to run the backend server.

    ```env
    # PostgreSQL Database Configuration
    PG_HOST=localhost
    PG_PORT=5432
    PG_USER=your_postgres_user
    PG_PASSWORD=your_postgres_password
    PG_DATABASE=acadnet

    # Or you can use a single DATABASE_URL
    # DATABASE_URL="postgres://your_postgres_user:your_postgres_password@localhost:5432/acadnet"

    # JWT Secrets
    JWT_ACCESS_SECRET=your_jwt_access_secret
    JWT_REFRESH_SECRET=your_jwt_refresh_secret

    # GitHub OAuth Credentials
    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret

    # Nodemailer Configuration (for sending emails)
    EMAIL=your_email@example.com
    EMAIL_PASSWORD=your_email_password
    ```

5.  **Start the application:**
    You can run the backend and frontend in separate terminals.

    - **Start the backend server:**
      ```bash
      npm start
      ```
      The backend will be running on `http://localhost:3000` (or the port specified in your environment).

    - **Start the frontend development server:**
      ```bash
      npm run dev
      ```
      The frontend will be available at `http://localhost:5173`.

## Available Scripts

- `npm start`: Starts the backend server with `nodemon`.
- `npm run dev`: Starts the frontend development server with Vite.
- `npm run build`: Builds the frontend for production.
- `npm run lint`: Lints the frontend code.
- `npm run preview`: Previews the production build of the frontend.
- `npm test`: (Not yet configured)

## API Endpoints

The backend exposes the following REST API endpoints.

### Authentication Routes

Base path: `/api/v1/auth`

| Method | Endpoint              | Description                                       | Protected |
| :----- | :-------------------- | :------------------------------------------------ | :-------- |
| `POST` | `/signup`             | Register a new user.                              | No        |
| `POST` | `/login`              | Login an existing user.                           | No        |
| `GET`  | `/github`             | Initiates GitHub OAuth2 authentication.           | No        |
| `GET`  | `/github/callback`    | Callback URL for GitHub OAuth2.                   | No        |
| `GET`  | `/failure`            | Redirect URL on OAuth failure.                    | No        |
| `POST` | `/checkSession`       | Checks if the user's session is valid.            | Yes       |
| `POST` | `/refresh-token`      | Refreshes the JWT access token.                   | Yes       |
| `POST` | `/logout`             | Logs out the user from the current device.        | No        |
| `POST` | `/logout-all`         | Logs out the user from all devices.               | Yes       |
| `GET`  | `/authorizedPage`     | Example of an authorization-protected route.      | Yes       |
| `POST` | `/otp-auth`           | Generates and sends an OTP for verification.      | No        |
| `POST` | `/otp-verify`         | Verifies the provided OTP.                        | No        |
| `POST` | `/password-reset`     | Sends a password reset link/token.                | No        |
| `POST` | `/password-verify`    | Verifies the password reset token.                | No        |
| `POST` | `/change-password`    | Changes the user's password.                      | No        |

### Data Routes

Base path: `/api/v1/data`

| Method | Endpoint        | Description                  | Protected |
| :----- | :-------------- | :--------------------------- | :-------- |
| `GET`  | `/user`         | Get the current user's info. | Yes       |
| `GET`  | `/user/:userId`  | Get the details of given user id  | Yes
| `POST` | `/editprofile`  | Edit the user's profile.     | Yes       |

#### The GET /user returns all data of current user while the /user/userId only returns given data:
```json
{
  "user_id": 6,
  "username": "anishkn",
  "created_at": "2025-06-27T19:33:52.960Z",
  "email": "anish@gmail.com",
  "fullName": null,
  "role": "user",
  "age": null,
  "phone": null,
  "nationality": null,
  "address": {},
  "education": {}
}
```

## Frontend

The frontend is a single-page application (SPA) built with React and Vite.

- **Routing**: `react-router-dom` is used for client-side routing.
- **State Management**: React Context API is used for managing user state.
- **Styling**: Styled with Tailwind CSS and uses `shadcn/ui` for components.
- **Structure**:
    - `src/pages`: Contains the main pages of the application.
    - `src/components`: Contains reusable UI components.
    - `src/layouts`: Contains layout components for different parts of the app.
    - `src/services`: Contains functions for making API calls to the backend.
    - `src/routes`: Defines the application's routes, including protected routes.
