from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from anthropic import Anthropic
from pydantic import BaseModel
from typing import Optional
import os

app = FastAPI(title="eRIPT LMS AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic()

SYSTEM_PROMPT = """Bạn là trợ lý học tập thông minh của hệ thống eRIPT LMS - Học viện Công nghệ Bưu chính Viễn thông (PTIT).

Nhiệm vụ của bạn:
- Giải thích các khái niệm kỹ thuật và nội dung bài học một cách rõ ràng, dễ hiểu
- Trả lời câu hỏi về lập trình, công nghệ thông tin và các môn học CNTT
- Gợi ý lộ trình học tập phù hợp với mục tiêu của sinh viên
- Hỗ trợ giải bài tập lập trình với gợi ý từng bước (không đưa code hoàn chỉnh ngay)
- Tư vấn hướng nghiệp trong ngành CNTT

Phong cách trả lời:
- Sử dụng tiếng Việt, ngắn gọn và dễ hiểu
- Dùng ví dụ thực tế khi giải thích khái niệm trừu tượng
- Khuyến khích sinh viên tự tìm hiểu thêm
- Nếu câu hỏi nằm ngoài phạm vi học tập, lịch sự chuyển hướng"""

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: Optional[str] = None
    messages: Optional[list[ChatMessage]] = None
    courseContext: Optional[str] = None

@app.post("/api/v1/ai/chat")
async def chat(body: ChatRequest):
    if body.messages:
        messages = [{"role": m.role, "content": m.content} for m in body.messages]
    elif body.message:
        messages = [{"role": "user", "content": body.message}]
    else:
        raise HTTPException(status_code=400, detail="Either 'message' or 'messages' is required")

    system = SYSTEM_PROMPT
    if body.courseContext:
        system += f"\n\nNgữ cảnh khóa học hiện tại: {body.courseContext}"

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=system,
        messages=messages
    )
    return {
        "reply": response.content[0].text,
        "model": response.model,
        "usage": {
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens
        }
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "eRIPT AI Service"}

@app.get("/")
async def root():
    return {"message": "eRIPT LMS AI Service is running"}
