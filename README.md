# Mint AI — ChatGPT Clone

A modern AI chat assistant built with **React + Vite** (frontend) and **Node.js + Express** (backend), powered by the OpenAI GPT-4.1 API.

---

## Features

- Clean, mint-themed chat UI with dark mode themes
- Chat history stored in localStorage (create, switch, delete chats)
- Rich text responses (markdown: bold, bullets, headings, code)
- 5 background color themes
- Rate-limited backend with security headers
- Fully responsive layout

---

## Tech Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS      |
| Backend   | Node.js, Express 5                |
| AI        | OpenAI GPT-4.1 (`/v1/responses`) |
| Security  | helmet, express-rate-limit        |

---

## Project Structure

```
chatgpt-clone/
├── backend/
│   ├── server.js          # Express API server
│   ├── .env               # Your secrets (not committed)
│   ├── .env.example       # Template for .env
│   └── package.json
└── frontend/
    └── vite-project/
        ├── src/
        │   ├── App.jsx    # Main React app
        │   └── index.css  # Animations & global styles
        ├── public/
        │   └── mint.svg   # Favicon
        ├── .env           # Frontend env vars (not committed)
        ├── .env.example   # Template for .env
        └── package.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- An [OpenAI API key](https://platform.openai.com/api-keys)

---

## Setup & Running

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd chatgpt-clone
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your values:

```env
OPENAI_KEY=sk-your-openai-key-here
PORT=5001
CLIENT_ORIGIN=http://localhost:5174
```

Install dependencies and start the backend:

```bash
npm install
npm run dev       # development (auto-restarts on change)
# or
npm start         # production
```

The backend runs at **http://localhost:5001**

### 3. Configure the frontend

```bash
cd ../frontend/vite-project
cp .env.example .env
```

The default `.env` points to the local backend — no changes needed for local development:

```env
VITE_API_URL=http://localhost:5001
```

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

The app opens at **http://localhost:5174**

---

## Building for Production

```bash
# Frontend
cd frontend/vite-project
npm run build     # outputs to dist/

# Backend
cd backend
npm start         # runs with node (no nodemon)
```

For deployment, set `CLIENT_ORIGIN` in the backend `.env` to your frontend's production URL, and set `VITE_API_URL` in the frontend `.env` to your backend's production URL before building.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable        | Description                        | Default                   |
|-----------------|------------------------------------|---------------------------|
| `OPENAI_KEY`    | Your OpenAI API key                | —                         |
| `PORT`          | Port the backend listens on        | `5001`                    |
| `CLIENT_ORIGIN` | Allowed frontend origin for CORS   | `http://localhost:5174`   |

### Frontend (`frontend/vite-project/.env`)

| Variable       | Description               | Default                  |
|----------------|---------------------------|--------------------------|
| `VITE_API_URL` | Backend API base URL      | `http://localhost:5001`  |
