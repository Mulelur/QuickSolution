# QuickSolution Project

## Project Overview

This project is a simplified Accountant Data Aggregation and Insights Dashboard. It simulates multiple agent-based data sources (Payments and Invoices), provides summaries, AI-assisted queries, and observability logs, all displayed on a responsive frontend dashboard.

## Features

- **Backend (FastAPI, Python)**
  - Payments & Invoices Agents with pagination & filtering
  - Summary Aggregator (`/api/summary`)
  - AI Assistant (`/api/ai-assistant`) with mock responses
  - Observability logs (`/api/agent-logs`)
  - SQLite database (in-memory for session persistence)
- **Frontend (Next.js, React, TypeScript)**
  - Dashboard with key summary metrics
  - Paginated & filterable tables for Payments & Invoices
  - Visualizations (e.g., monthly totals)
  - AI Assistant chat panel
  - Observability widget for logs
- **State Management & Data Fetching**
  - Redux
- **Styling**
  - Tailwind CSS for responsive UI

## Tech Stack

- Backend: Python, FastAPI, SQLAlchemy
- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Database: SQLite (in-memory or persistent for session)
- State Management: Redux
- Charts: ui.shadcn charts
- Mock AI responses for LLM interactions
- Google Gemini LLM 

## Setup Instructions

### Backend

1. **Clone the repo**:

```bash
git clone https://github.com/Mulelur/QuickSolution
cd QuickSolution
```

Create virtual environment:

```
python -m venv venv
source venv/bin/activate # Linux/macOS
venv\Scripts\activate # Windows
```

Install dependencies:

`pip install -r requirements.txt`

Create .env

copy the example.env to a create .env and populate it

Run the backend:

`uvicorn main:app --reload`

API Endpoints

GET `/api/payments` - List payments (pagination & filters)

GET `/api/invoices` - List invoices (pagination & filters)

GET `/api/summary` - Aggregated metrics

POST `/api/ai-assistant` - AI assistant query

GET `/api/agent-logs` - Recent activity logs

### Frontend

#### Frontend (Next.js) - minimal example

Create a minimal Next.js page to call the backend

Run frontend:

Create .env

copy the example.env to a create .env and populate it

```
cd frontend
npm install
npm run dev
```

Example package.json dependencies (Next + React):

```
next
react
react-dom
tailwindcss
ai-elements
ai-sdk
```

## File references

- Backend
  - app/main.py (FastAPI app)
  - app/agents/payments.py (payments agent endpoints / logic)
  - app/agents/invoices.py (invoices agent endpoints / logic)
  - app/db/\* (SQLAlchemy models & migrations)
- Frontend
  - frontend/pages/\* (Next.js pages and API routes)
  - frontend/components/\* (UI components / ui.shadcn)
  - frontend/styles/\* (Tailwind / CSS)
