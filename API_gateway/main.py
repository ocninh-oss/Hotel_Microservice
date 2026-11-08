from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI, Request, Response
import httpx
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# --- THƯ VIỆN LANGCHAIN CHO AI CHATBOT ---
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

app = FastAPI(title="Hotel Microservices API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= CẤU HÌNH AI CHATBOT (RAG) =================
# TODO: Dán API Key thật của bạn vào đây

print("Đang nạp tri thức khách sạn vào VectorDB...")
try:
    loader = TextLoader("hotel_policy.txt", encoding="utf-8")
    docs = loader.load()

    # Tăng kích thước băm dữ liệu để không bị đứt đoạn câu
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    splits = text_splitter.split_documents(docs)

    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-2"), 
        persist_directory="./chroma_db",
)
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    def make_llm(name, timeout):
        return ChatGoogleGenerativeAI(model=name, temperature=0.3, timeout=timeout, max_retries=0)

    llm = make_llm("gemini-3.7-flash", 15).with_fallbacks([
        make_llm("gemini-3.5-flash", 15),
        make_llm("gemini-3.1-flash-lite", 20),
])

    template = """Bạn là nhân viên lễ tân ảo của khách sạn. Hãy trả lời câu hỏi của khách hàng dựa trên thông tin sau:
    {context}

    Quy tắc:
    - Trả lời ngắn gọn, lịch sự, xưng "em" và gọi khách là "quý khách".
    - Nếu thông tin không có trong ngữ cảnh trên, hãy nói: "Dạ, hiện tại em chưa có thông tin về vấn đề này, quý khách vui lòng liên hệ hotline ạ." Tuyệt đối không bịa đặt thêm.

    Câu hỏi: {question}
    Trả lời:"""
    prompt = ChatPromptTemplate.from_template(template)

    rag_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    print("Khởi tạo RAG thành công!")
except Exception as e:
    print("Khởi tạo RAG thất bại (bỏ qua nếu chưa cần AI). Lỗi:", e)

class ChatRequest(BaseModel):
    message: str

# Đón endpoint riêng cho Chatbot (phải đặt TRƯỚC luồng gateway động)
@app.post("/api/chat")
def chat_endpoint(req: ChatRequest): # Bỏ chữ async
    try:
        # Dùng invoke đồng bộ thay vì ainvoke để tương thích tốt nhất với Chroma
        response = rag_chain.invoke(req.message) 
        return {"reply": response}
    except Exception as e:
        print(f"LỖI CHATBOT GEMINI: {e}")
        return {"reply": "Hệ thống AI đang bận, vui lòng thử lại sau."}
# ==============================================================


# ================= PHẦN ĐỊNH TUYẾN MICROSERVICES CŨ =================
# Khai báo cổng tương ứng của từng dịch vụ Quarkus
# Cấu hình cũ: AUTH_SERVICE = "http://localhost:8081"
# Sửa lại thành:
AUTH_SERVICE = "http://auth-service:8081"
ROOM_SERVICE = "http://room-service:8082"
BOOKING_SERVICE = "http://booking-service:8083"

# Bản đồ định tuyến ánh xạ từng đầu mục sang đúng service Quarkus
ROUTE_MAP = {
    # 8081 - User & Auth
    "auth": AUTH_SERVICE,
    "users": AUTH_SERVICE,
    "profile": AUTH_SERVICE,
    
    # 8082 - Room, Service, Voucher, News, Files
    "rooms": ROOM_SERVICE,
    "services": ROOM_SERVICE,
    "files": ROOM_SERVICE,
    
    # 8083 - Booking
    "bookings": BOOKING_SERVICE,
    "vouchers": BOOKING_SERVICE,
    "news": BOOKING_SERVICE,
}

client = httpx.AsyncClient()

@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway(full_path: str, request: Request):
    # Tránh để gateway bắt nhầm request của chatbot
    if full_path.startswith("api/chat"):
        return Response(status_code=404)

    # Loại bỏ tiền tố 'api/' nếu frontend vẫn còn gửi lên (giúp chống lỗi 404 do cache)
    clean_path = full_path.lstrip("/")
    if clean_path.startswith("api/"):
        clean_path = clean_path[4:]
    elif clean_path == "api":
        clean_path = ""

    # Bóc tách segment đầu tiên để định tuyến
    parts = clean_path.split("/", 1)
    first_segment = parts[0] if parts else ""

    target_base = None

    # Biến lưu trữ đường dẫn thực tế sẽ gửi sang Quarkus
    forward_path = clean_path

    # Xử lý các route dành cho admin
    if first_segment == "admin":
        sub_segment = parts[1].split("/", 1)[0] if len(parts) > 1 else ""
        if sub_segment in ["rooms", "services"]:
            target_base = ROOM_SERVICE
            forward_path = parts[1]  # Cắt bỏ chữ "admin/"
        elif sub_segment in ["bookings", "vouchers", "news"]:
            target_base = BOOKING_SERVICE
            forward_path = parts[1]  # Cắt bỏ chữ "admin/"
        elif sub_segment in ["users"]:
            target_base = AUTH_SERVICE
            forward_path = parts[1]  # Cắt bỏ chữ "admin/" để thành /users
        else:
            target_base = ROOM_SERVICE
            forward_path = parts[1]
            
    elif first_segment == "profile":
        target_base = AUTH_SERVICE
    else:
        target_base = ROUTE_MAP.get(first_segment)

    if not target_base:
        return Response(content='{"error": "Service Not Found"}', media_type="application/json", status_code=404)

    # Ghép URL gửi sang Quarkus
    target_url = f"{target_base}/{forward_path}"

    body = await request.body()
    headers = dict(request.headers)
    headers.pop("host", None)

    req = client.build_request(
        method=request.method,
        url=target_url,
        headers=headers,
        content=body,
        params=request.query_params
    )

    try:
        response = await client.send(req)
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers)
        )
    except httpx.RequestError:
        return Response(content=f'{{"error": "Service for path /{clean_path} is offline"}}', media_type="application/json", status_code=503)