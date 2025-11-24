from app.utils.logger import log_event
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from sqlalchemy import func

from app.database import get_db
from app.schemas.assistant import AIAssistantRequest, AIAssistantResponse
from app.models.payments import Payment
from app.models.invoices import Invoice, InvoiceStatus
from app.services.gemini_client import ask_gemini, gemini_enabled

router = APIRouter(tags=["AI Assistant"])

def get_accounting_context_from_db(db):
    invoices = db.query(Invoice).all()
    payments = db.query(Payment).all()

    return {
        "invoices": [i.to_dict() for i in invoices],
        "payments": [p.to_dict() for p in payments],
    }

def build_ai_prompt(user_prompt: str, context: dict, history: list[dict] = None):
    history_text = ""
    if history:
        for msg in history:
            role = msg["role"]
            content = msg["content"]
            history_text += f"{role.capitalize()}: {content}\n"

    return f"""
You are an AI accounting assistant.

Database context (JSON):
{context}

Conversation history:
{history_text}

User question:
{user_prompt}

Give a concise, accurate answer based on context and conversation history.
"""



def mock_ai_answer(query: str, db: Session):
    """
    Original rule-based fallback AI.
    Keeps your existing logic cleanly separated.
    """
    q = query.lower()

    # Unpaid invoices rule
    if "unpaid" in q:
        unpaid = db.query(Invoice).filter(Invoice.status == InvoiceStatus.unpaid).all()
        total_unpaid = sum(i.amount_due for i in unpaid)
        return f"There are {len(unpaid)} unpaid invoices totaling {total_unpaid:.2f}."

    # Last 30 days payments
    if "last 30" in q or "30 days" in q:
        cutoff = date.today() - timedelta(days=30)
        pays = db.query(Payment).filter(Payment.created_at >= cutoff).all()
        total = sum(p.amount for p in pays)
        return f"Found {len(pays)} payments in the last 30 days totaling {total:.2f}."

    # Fallback summary
    payments_agg = db.query(func.sum(Payment.amount), func.count(Payment.id)).one()
    total_payments_amount = float(payments_agg[0] or 0.0)
    total_payments_count = int(payments_agg[1] or 0)
    unpaid_count = db.query(Invoice).filter(Invoice.status == InvoiceStatus.unpaid).count()

    return (
        f"Payments summary: {total_payments_count} transactions totaling {total_payments_amount:.2f}. "
        f"Unpaid invoices: {unpaid_count}."
    )

# Simple in-memory session storage 
session_histories = {}  

@router.post("/ai-assistant", response_model=AIAssistantResponse)
def ai_assistant(req: AIAssistantRequest, db: Session = Depends(get_db), user_id: str = "default"):
    prompt_text = req.query.strip()
    ts = datetime.utcnow().isoformat() + "Z"

    # Get user history
    history = session_histories.get(user_id, [])

    try:
        context = get_accounting_context_from_db(db)
        prompt = build_ai_prompt(prompt_text, context, history)

        if gemini_enabled:
            try:
                answer = ask_gemini(prompt)
                matched = True
            except Exception as e:
                print(e, "Error")
                answer = mock_ai_answer(prompt_text, db)
                matched = False
        else:
            answer = mock_ai_answer(prompt_text, db)
            matched = False

        # Update conversation history
        history.append({"role": "user", "content": prompt_text})
        history.append({"role": "assistant", "content": answer})
        session_histories[user_id] = history[-20:]  # Keep last 20 messages

        log_event("assistant", "ai-assistant.query", {"query": prompt_text, "gemini": gemini_enabled})

        return {"answer": answer, "matched": matched}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Assistant failed: {str(e)}")

