🏨 Hotel 22 - Microservices Management System & AI Chatbot

Hệ thống quản lý khách sạn toàn diện được xây dựng theo kiến trúc Microservices. Dự án kết hợp các dịch vụ Backend mạnh mẽ (Java Quarkus), bộ định tuyến API Gateway linh hoạt (Python FastAPI) và tích hợp sẵn một Lễ tân ảo AI (RAG Chatbot) sử dụng công nghệ LangChain và Google Gemini.

🚀 Công nghệ sử dụng

Backend Services: Java (Quarkus), Hibernate

API Gateway & AI Chatbot: Python, FastAPI, LangChain, Chroma, Google Gemini API

Cơ sở dữ liệu: MySQL

Frontend: React.js (Giao tiếp qua CORS với API Gateway)

Triển khai: Docker & Docker Compose

🏗️ Kiến trúc & Cấu trúc cổng (Ports)

Hệ thống được chia thành các container độc lập chạy trên Docker:

API Gateway (8080): Nhận toàn bộ request từ Frontend. Xử lý logic AI Chatbot tại endpoint /api/chat và định tuyến các request khác tới những dịch vụ Quarkus tương ứng.

Auth Service (8081): Quản lý users, auth, profile.

Room Service (8082): Quản lý rooms, services, files.

Booking Service (8083): Quản lý bookings, vouchers, news.

MySQL Database (3309): Cơ sở dữ liệu nội bộ của hệ thống (ánh xạ từ cổng 3306 bên trong container).

⚙️ Yêu cầu hệ thống

Docker và Docker Compose đã được cài đặt và khởi chạy.

Khóa API của Google Gemini (Lấy tại Google AI Studio).

Cổng 8080, 8081, 8082, 8083 và 3309 trên máy của bạn đang khả dụng (không bị ứng dụng khác chiếm dụng).

🛠️ Hướng dẫn Cài đặt & Khởi chạy

Bước 1: Clone dự án

git clone https://github.com/your-username/hotel-microservice.git
cd hotel-microservice


Bước 2: Cấu hình Biến môi trường

Tìm file .env.example trong thư mục API Gateway (hoặc thư mục gốc).

Sao chép và đổi tên file đó thành .env.

Cấp quyền truy cập AI bằng cách điền Google API Key vào file .env:

GOOGLE_API_KEY=nhap_api_key_cua_ban_vao_day


Bước 3: Khởi chạy hệ thống bằng Docker
Mở Terminal tại thư mục chứa file docker-compose.yml và chạy lệnh sau để đóng gói và khởi động tất cả các dịch vụ:

docker compose up -d --build


Bước 4: Kiểm tra hoạt động

Đợi khoảng 1-2 phút để các dịch vụ Quarkus và cơ sở dữ liệu khởi tạo thành công.

Truy cập log của api-gateway trên Docker, nếu thấy dòng Khởi tạo RAG thành công!, Lễ tân AI đã sẵn sàng.

Frontend React (mặc định tại http://localhost:5173) có thể kết nối gọi API thông qua cổng 8080.

🤖 Cấu hình Lễ tân AI (RAG Chatbot)

Hệ thống Chatbot áp dụng mô hình RAG (Retrieval-Augmented Generation) để cung cấp câu trả lời chính xác dựa trên dữ liệu thật của khách sạn.

Nguồn tri thức (hotel_policy.txt): Nơi lưu trữ thông tin về giờ check-in, số điện thoại, giá phòng, quy định... Bạn có thể tự do chỉnh sửa file này để cập nhật kiến thức cho bot.

Mô hình nhúng (Embedding): Hệ thống sử dụng models/gemini-embedding-2 để tối ưu hóa việc băm và tìm kiếm dữ liệu vector.

Lưu ý quan trọng khi cập nhật kiến thức:
Nếu bạn thay đổi nội dung file hotel_policy.txt, bạn BẮT BUỘC phải:

Xóa thư mục chroma_db để dọn dẹp bộ nhớ đệm vector cũ.

Build và khởi động lại container bằng lệnh: docker compose build --no-cache api-gateway và docker compose up -d api-gateway.

🗄️ Quản lý Cơ sở dữ liệu

Database MySQL chạy ngầm trong Docker và tự động đồng bộ cấu trúc bảng từ các module Quarkus (thông qua Hibernate).
Để thao tác (xem, thêm, sửa, xóa dữ liệu) từ bên ngoài:

Mở phần mềm quản lý database (như MySQL Workbench, DBeaver, Navicat...).

Tạo kết nối mới với thông tin:

Host: 127.0.0.1 (hoặc localhost)

Port: 3309

Username: root

Password: 123456 (Cấu hình mặc định trong file docker-compose).

Phát triển bởi [Tên của bạn/Đội ngũ của bạn]