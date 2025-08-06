# Zynta Referral System

A full-stack referral system built with Node.js/Express backend and vanilla HTML/CSS/JavaScript frontend,

## 📋 API Endpoints

| Method | Endpoint                   | Description                                     |
| ------ | -------------------------- | ----------------------------------------------- |
| GET    | `/api/users`               | Get all registered users                        |
| POST   | `/api/register`            | Register a new user with optional referral code |
| GET    | `/api/users/:referralCode` | Get user by referral code                       |

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)

### Installation

1. **Extract the project files** to a directory on your computer

2. **Navigate to the project directory**

   ```bash
   cd zynta-referral-system
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   For development with auto-restart:

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and go to: `http://localhost:3000`
   - The server will be running on port 3000

## 🏗️ Project Structure

```
zynta-referral-system/
├── server.js              # Main server file with Express routes
├── package.json           # Project dependencies and scripts
├── README.md             # This file
└── public/
    └── index.html        # Frontend HTML with JavaScript
```

## 🎯 Usage
