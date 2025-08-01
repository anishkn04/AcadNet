# 🎓 AcadNet - Academic Study Platform

> **Learn together, grow together** - Join or build study groups tailored to your syllabus.

AcadNet is a comprehensive academic collaboration platform designed to connect students through structured study groups, resource sharing, and interactive discussions. Built with modern web technologies, it facilitates seamless academic collaboration and knowledge sharing.

## ✨ Key Features

### 🔗 **Study Group Management**
- **Create & Join Groups**: Form study groups with custom syllabi and course structures
- **Public & Private Groups**: Control group visibility and access
- **Anonymous Participation**: Join groups without revealing your identity
- **Role-based Access**: Admin and member roles with different permissions

### 📚 **Resource Sharing**
- **File Upload & Management**: Share notes, assignments, and study materials
- **Content Moderation**: Admin approval system for shared resources
- **Topic Organization**: Categorize resources by syllabus topics and subtopics
- **Like/Dislike System**: Community-driven content rating

### 💬 **Discussion Forums**
- **Group Forums**: Dedicated discussion spaces for each study group
- **Threaded Conversations**: Organized discussions with replies and nested comments
- **Pinned Threads**: Highlight important discussions
- **Moderation Tools**: Lock threads and manage conversations

### 👤 **User Management**
- **Profile System**: Complete user profiles with educational background
- **Authentication**: Secure login with OAuth integration (GitHub)
- **User Reporting**: Community moderation and safety features
- **Admin Dashboard**: System administration tools

## 🏗️ Tech Stack

### **Backend**
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT + Passport.js (GitHub OAuth)
- **File Storage**: Local file system with organized structure
- **Email**: Nodemailer for OTP verification

### **Frontend**
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Shadcn/UI
- **State Management**: React Context API
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [PostgreSQL](https://www.postgresql.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anishkn04/AcadNet.git
   cd AcadNet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb acadnet
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # PostgreSQL Database Configuration
   PG_HOST=localhost
   PG_PORT=5432
   PG_USER=your_postgres_user
   PG_PASSWORD=your_postgres_password
   PG_DATABASE=acadnet

   # JWT Secrets
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret

   # GitHub OAuth Credentials (Optional)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Email Configuration
   EMAIL=your_email@example.com
   EMAIL_PASSWORD=your_email_password

   # Server Configuration
   BACKEND_PORT=3000
   ```

5. **Start the Application**
   ```bash
   # Backend server (Terminal 1)
   npm start
   
   # Frontend development server (Terminal 2)
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api-docs`

## 📁 Project Structure

```
AcadNet/
├── backend/
│   ├── controllers/         # Route handlers
│   ├── models/             # Database models (Sequelize)
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic layer
│   ├── middlewares/        # Express middlewares
│   ├── config/             # Database & app configuration
│   ├── passport/           # OAuth strategies
│   ├── utils/              # Utility functions
│   └── validator/          # Input validation
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── data/           # Static data & constants
│   └── public/             # Static assets
└── package.json
```

## 📋 Available Scripts

```bash
# Development
npm start          # Start backend server with nodemon
npm run dev        # Start frontend development server
npm run build      # Build frontend for production
npm run preview    # Preview production build
npm run lint       # Run ESLint on frontend

# Testing
npm test          # Run tests (not yet configured)
```

## 🔌 API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `POST` | `/signup` | Register new user | No |
| `POST` | `/login` | User login | No |
| `GET` | `/github` | GitHub OAuth login | No |
| `POST` | `/logout` | Logout user | No |
| `POST` | `/refresh-token` | Refresh JWT token | Yes |
| `POST` | `/otp-auth` | Send OTP verification | No |
| `POST` | `/otp-verify` | Verify OTP | No |
| `POST` | `/password-reset` | Reset password | No |

### Study Groups (`/api/v1/groups`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `GET` | `/` | Get all groups | Yes |
| `POST` | `/create` | Create new group | Yes |
| `GET` | `/:groupCode` | Get group details | Yes |
| `POST` | `/:groupCode/join` | Join a group | Yes |
| `POST` | `/:groupCode/leave` | Leave a group | Yes |
| `POST` | `/:groupCode/resources` | Upload resources | Yes |

### Forum Routes (`/api/v1/forum`)

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `GET` | `/groups/:groupCode/forum` | Get group forum | Yes |
| `POST` | `/groups/:groupCode/threads` | Create thread | Yes |
| `GET` | `/threads/:threadId` | Get thread details | Yes |
| `POST` | `/threads/:threadId/replies` | Create reply | Yes |

## 🌟 Key Features Deep Dive

### Study Group Workflow
1. **Create Account** - Register with email and complete profile
2. **Browse Groups** - Discover existing study groups or create custom ones
3. **Join/Create** - Join groups matching your courses or create new groups
4. **Collaborate** - Share resources, participate in discussions
5. **Moderate** - Admins manage content and members

### Resource Management
- Upload study materials with topic categorization
- Admin approval system for quality control
- Community rating system (likes/dislikes)
- Organized storage by group and topic structure

### Discussion System
- Real-time forum discussions within study groups
- Threaded conversations for organized communication
- Moderation tools (pin/lock threads)
- Anonymous participation options

## 🛡️ Security & Privacy

- **JWT Authentication**: Secure token-based authentication
- **CSRF Protection**: Cross-site request forgery protection
- **Input Validation**: Comprehensive validation using express-validator
- **File Upload Security**: Safe file handling with type validation
- **Privacy Controls**: Anonymous participation and private groups

## 👥 Contributing Team

- **Rishav Chapagain**
- **Anish Kumar Neupane**  
- **Rushab Risal**
- **Nishan Paudel**

## 🔗 Links

- **Issues**: [Bug Reports & Feature Requests](mailto:gainrishavchap@gmail.com)

---

**Built with ❤️ for academic collaboration**
