from pydantic import BaseModel


class AIAssistantRequest(BaseModel):
    query: str


class AIAssistantResponse(BaseModel):
    answer: str
    matched: bool