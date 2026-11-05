from fastapi import FastAPI, Request, Response
import httpx
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Hotel Microservices API Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Khai báo cổng tương ứng của từng dịch vụ Quarkus
AUTH_SERVICE = "http://localhost:8081"
ROOM_SERVICE = "http://localhost:8082"
BOOKING_SERVICE = "http://localhost:8083"

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
    # Loại bỏ tiền tố 'api/' nếu frontend vẫn còn gửi lên (giúp chống lỗi 404 do cache)
    clean_path = full_path.lstrip("/")
    if clean_path.startswith("api/"):
        clean_path = clean_path[4:]
    elif clean_path == "api":
        clean_path = ""

    # ... (giữ nguyên phần trên) ...
    # Bóc tách segment đầu tiên để định tuyến
    parts = clean_path.split("/", 1)
    first_segment = parts[0] if parts else ""

    target_base = None

    # Biến lưu trữ đường dẫn thực tế sẽ gửi sang Quarkus
    forward_path = clean_path

    # Xử lý các route dành cho admin
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
            forward_path = parts[1]  # <-- SỬA Ở ĐÂY: Cắt bỏ chữ "admin/" để thành /users
        else:
            target_base = ROOM_SERVICE
            forward_path = parts[1]
            
    elif first_segment == "profile":
        target_base = AUTH_SERVICE
    else:
        target_base = ROUTE_MAP.get(first_segment)

    if not target_base:
        return Response(content='{"error": "Service Not Found"}', media_type="application/json", status_code=404)

    # Ghép URL gửi sang Quarkus (SỬ DỤNG forward_path thay vì clean_path)
    target_url = f"{target_base}/{forward_path}"
    # ... (giữ nguyên phần dưới) ...

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