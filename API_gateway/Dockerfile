# Dùng Python bản nhẹ
FROM python:3.11-slim 

# Đặt thư mục làm việc
WORKDIR /app

# Copy thư viện và cài đặt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code (nhưng Docker sẽ bỏ qua các file trong .dockerignore)
COPY . .

# Mở cổng 8080
EXPOSE 8080

# Lệnh khởi động (Lưu ý host là 0.0.0.0 để ra internet)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]