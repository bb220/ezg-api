# EZG API

![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)
![Express.js](https://img.shields.io/badge/Express.js-API-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

Welcome to the EZG API repository! 🚀

This project represents an Express.js API server built for managing data and services for [My Easy Golf Scorecard](https://myeasygolfscorecard.com/) (formerly EZG).

---

## Features

- RESTful API built with Express.js
- MongoDB database integration via Mongoose
- Basic user authentication and authorization
- Environment-based configuration (dotenv)
- Structured project organization for scalability

---

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** (via Mongoose)
- **dotenv** for environment variable management

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- MongoDB Atlas account (or a local MongoDB server)

### Installation

1. Clone the repository:

```bash
 git clone https://github.com/bb220/ezg-api.git
 cd ezg-api
```

2. Install dependencies:

```bash
 npm install
```

3. Create a `.env` file in the root directory based on `.env.example` (create this file if not present). Example:

```bash
 PORT=5000
 DB_URI=your_mongo_db_connection_string
 JWT_SECRET=your_secret_key
```

4. Start the development server:

```bash
 npm run dev
```

or for production:

```bash
 npm start
```

The server will start on `http://localhost:5000` by default.

---

## Environment Variables

| Variable | Description |
|:---------|:------------|
| `PORT` | Port number the server listens on |
| `DB_URI` | MongoDB connection URI |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## Project Structure

```
├── controllers/
├── models/
├── routes/
├── middleware/
├── server.js
└── package.json
```

- `controllers/`: Handles business logic
- `models/`: Mongoose data models
- `routes/`: Express route definitions
- `middleware/`: Custom middleware (auth, error handling, etc.)

---

## Security Notice

- No sensitive information (API keys, secrets) is included in this public repo.
- Ensure you configure a proper `.env` file before running the application.

---

## License

This project is licensed under the MIT License.

---

## Author

Built by [bb220](https://github.com/bb220) and contributors
