import app
from app.database import get_db
from app.helper import apply_pagination_and_filters_query
from ..utils.logger import log_event
from fastapi import APIRouter, HTTPException
from fastapi import Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from datetime import date
from sqlalchemy.orm import Session


PAGE_DEFAULT = 1
PAGE_SIZE_DEFAULT = 10
SEED_PAYMENTS = 25
SEED_INVOICES = 25
LOG_MAX = 200