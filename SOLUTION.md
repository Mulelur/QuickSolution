# OpenTax Full Stack Developer Assignment - Solution

## Architecture Overview

- **Backend**

  - FastAPI app with modular routers for Payments, Invoices, Summary, AI Assistant, and Logs.
  - SQLAlchemy models for Payments & Invoices.
  - In-memory SQLite for session persistence.
  - Mock AI implemented for handling queries without LLM.
  - Observability logs stored in memory with timestamp, action, and error if any.

- **Frontend**
  - Next.js + React with TypeScript.
  - Dashboard page with:
    - Summary cards (total payments, unpaid invoices)
    - Tables for Payments & Invoices (paginated, filterable)
    - AI Assistant chat panel (history & retry)
    - Observability logs panel
  - State management via Redux
  - Charts (area) for monthly totals using ui.shadcn charts
  - Responsive design using Tailwind CSS.

## Assumptions

- AI LLM API is optional; fallback to mocked responses is acceptable.
- Data volume is small (20–30 entries per agent), so in-memory DB is sufficient.
- No authentication needed as per assignment instructions.
- Paginated tables have default 10 rows per page.

## Major Tradeoffs

- **Database**
  - SQLite in-memory is fast and simple for demo, but not suitable for production or multi-user.
- **Charts**
  - Only basic visualizations implemented due to time constraints.

## Mocking / AI Implementation

- AI Assistant reads current database state and constructs responses based on simple rules:
  - "unpaid" → counts unpaid invoices
  - "last 30 days" → aggregates payments in last 30 days
  - Otherwise → summary of payments & unpaid invoices
- Logs prompt, response, and timestamp in memory.

## Setup & Running

See **README.md** for full setup instructions.

## Video Walkthrough

- https://www.loom.com/share/35f79e92b9864b5d9790fb37dd22bba9
- Explains key logic, API routes, frontend structure, AI assistant, and observability panel.
