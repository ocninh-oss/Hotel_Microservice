# --- BƯỚC 1: Build source code bằng Node.js ---
FROM node:20-alpine AS build
WORKDIR /app

# Copy file cấu hình package và cài đặt thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ code và build ra thư mục 'dist'
COPY . .
RUN npm run build

# --- BƯỚC 2: Chạy web bằng Nginx (siêu nhẹ) ---
FROM nginx:alpine
# Copy file cấu hình mới vào thay thế file mặc định
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy code đã build
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]