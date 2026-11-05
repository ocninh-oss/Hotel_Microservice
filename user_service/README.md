# hotel_22

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: <https://quarkus.io/>.

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./mvnw quarkus:dev
```

📦 Nếu muốn build trước khi chạy
Từ cùng thư mục:
```
.\mvnw.cmd -DskipTests package
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at <http://localhost:8080/q/dev/>.

## Packaging and running the application

The application can be packaged using:

```shell script
./mvnw package
```

It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:

```shell script
./mvnw package -Dquarkus.package.jar.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using:

```shell script
./mvnw package -Dnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using:

```shell script
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/hotel_22-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult <https://quarkus.io/guides/maven-tooling>.

## Related Guides

- MongoDB with Panache ([guide](https://quarkus.io/guides/mongodb-panache)): Simplify your persistence code for MongoDB via the active record or the repository pattern
- Hibernate Validator ([guide](https://quarkus.io/guides/validation)): Bean validation using Hibernate Validator and Jakarta Validation annotations
- REST Jackson ([guide](https://quarkus.io/guides/rest#json-serialisation)): Jackson serialization support for Quarkus REST. This extension is not compatible with the quarkus-resteasy extension, or any of the extensions that depend on it
- Hibernate ORM with Panache ([guide](https://quarkus.io/guides/hibernate-orm-panache)): Simplified JPA/Hibernate data access layer with active record and repository patterns
- SmallRye JWT ([guide](https://quarkus.io/guides/security-jwt)): Secure your applications with JSON Web Token
- JDBC Driver - MySQL ([guide](https://quarkus.io/guides/datasource)): Connect to the MySQL database via JDBC
- SmallRye JWT Build ([guide](https://quarkus.io/guides/security-jwt-build)): Create JSON Web Token with SmallRye JWT Build API

## Provided Code

### Hibernate ORM

Create your first JPA entity

[Related guide section...](https://quarkus.io/guides/hibernate-orm)


[Related Hibernate with Panache section...](https://quarkus.io/guides/hibernate-orm-panache)


### REST

Easily start your REST Web Services

[Related guide section...](https://quarkus.io/guides/getting-started-reactive#reactive-jax-rs-resources)


## Overall Structure
```
project/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/example/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   └── config/
│   └── src/main/resources/
│       └── application.properties
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        ├── utils/
        ├── App.js
        ├── index.js
        └── index.css
```
## Database Configuration

### MongoDB Connection
```
Connection String: mongodb+srv://levanchinh13052005_db_user:ZnNNmXhZq98owuOC@cluster0.j9w8jmh.mongodb.net/?appName=Cluster0
Username: levanchinh13052005_db_user
Password: ZnNNmXhZq98owuOC
```

### MySQL Configuration
Update in `src/main/resources/application.properties`:
```properties
quarkus.datasource.db-kind=mysql
quarkus.datasource.jdbc.url=jdbc:mysql://localhost:3306/hotel_booking
quarkus.datasource.username=root
quarkus.datasource.password=your_password
```

## How to Run the Application

### Quick Start (Terminal 1 - Backend)
```bash
./mvnw quarkus:dev
# Backend will run at: http://localhost:8080
# API Base URL: http://localhost:8080/api
```

### Quick Start (Terminal 2 - Frontend)
```bash
cd frontend
npm install  # First time only
npm start
# Frontend will run at: http://localhost:3000
```

## API Testing Guide

### Using Postman
1. Download and install [Postman](https://www.postman.com/downloads/)
2. Import collection from `backend/postman_collection.json` (if available)
3. Set environment variables:
   - `BASE_URL`: http://localhost:8080
   - `TOKEN`: Your JWT token after login

### Using cURL

#### 1. User Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "Password123!",
    "fullName": "John Doe",
    "email": "user@example.com",
    "phone": "0912345678"
  }'
```

#### 2. User Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

Response will include JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John"
  }
}
```

#### 3. Get All Rooms
```bash
curl -X GET http://localhost:8080/api/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Create New Room (Admin Only)
```bash
curl -X POST http://localhost:8080/api/admin/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "roomNumber": "101",
    "roomType": "Deluxe",
    "price": 150.0,
    "description": "Beautiful room with ocean view",
    "capacity": 2
  }'
```

#### 5. Create Booking
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "roomId": 1,
    "checkInDate": "2026-05-10",
    "checkOutDate": "2026-05-12",
    "voucherId": null
  }'
```

#### 6. Get User Bookings
```bash
curl -X GET http://localhost:8080/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 7. Cancel Booking
```bash
curl -X PUT http://localhost:8080/api/bookings/1/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 8. Get Room by ID
```bash
curl -X GET http://localhost:8080/api/rooms/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 9. Update Room (Admin Only)
```bash
curl -X PUT http://localhost:8080/api/admin/rooms/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "price": 200.0,
    "description": "Updated description"
  }'
```

#### 10. Delete Room (Admin Only)
```bash
curl -X DELETE http://localhost:8080/api/admin/rooms/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using REST Client in VS Code

Install "REST Client" extension, then create `test.http` file:

```http
### Variables
@baseUrl = http://localhost:8080
@token = YOUR_JWT_TOKEN_HERE

### Register User
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test123456!",
  "fullName": "Test User",
  "email": "testuser@example.com",
  "phone": "0987654321"
}

### Login User
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "Test123456!"
}

### Get All Rooms
GET {{baseUrl}}/api/rooms
Authorization: Bearer {{token}}

### Create Room (Admin)
POST {{baseUrl}}/api/admin/rooms
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "roomNumber": "102",
  "roomType": "Standard",
  "price": 100.0,
  "description": "Standard room",
  "capacity": 2
}

### Get Room by ID
GET {{baseUrl}}/api/rooms/1
Authorization: Bearer {{token}}

### Create Booking
POST {{baseUrl}}/api/bookings
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "roomId": 1,
  "checkInDate": "2026-05-10",
  "checkOutDate": "2026-05-12",
  "voucherId": null
}

### Get My Bookings
GET {{baseUrl}}/api/bookings
Authorization: Bearer {{token}}

### Cancel Booking
PUT {{baseUrl}}/api/bookings/1/cancel
Authorization: Bearer {{token}}

### Update Room (Admin)
PUT {{baseUrl}}/api/admin/rooms/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "price": 180.0,
  "description": "Premium room"
}

### Delete Room (Admin)
DELETE {{baseUrl}}/api/admin/rooms/1
Authorization: Bearer {{token}}
```

### Using JavaScript/Fetch API

Create test file in frontend or browser console:

```javascript
// Config
const BASE_URL = 'http://localhost:8080/api';
let token = '';

// Register User
async function register() {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser',
      password: 'Test123456!',
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '0912345678'
    })
  });
  return response.json();
}

// Login User
async function login() {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'Test123456!'
    })
  });
  const data = await response.json();
  token = data.token;
  return data;
}

// Get All Rooms
async function getRooms() {
  const response = await fetch(`${BASE_URL}/rooms`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// Create Booking
async function createBooking(roomId, checkInDate, checkOutDate) {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      roomId,
      checkInDate,
      checkOutDate,
      voucherId: null
    })
  });
  return response.json();
}

// Usage
(async () => {
  await register();
  const loginData = await login();
  console.log('Login successful:', loginData);
  
  const rooms = await getRooms();
  console.log('Available rooms:', rooms);
  
  const booking = await createBooking(1, '2026-05-10', '2026-05-12');
  console.log('Booking created:', booking);
})();
```

## API Endpoints Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh-token` | Refresh JWT token | Yes |

### Rooms
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/rooms` | Get all rooms | Yes |
| GET | `/api/rooms/{id}` | Get room by ID | Yes |
| POST | `/api/admin/rooms` | Create room | Yes (Admin) |
| PUT | `/api/admin/rooms/{id}` | Update room | Yes (Admin) |
| DELETE | `/api/admin/rooms/{id}` | Delete room | Yes (Admin) |

### Bookings
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/bookings` | Create booking | Yes |
| GET | `/api/bookings` | Get user's bookings | Yes |
| GET | `/api/bookings/{id}` | Get booking details | Yes |
| PUT | `/api/bookings/{id}/cancel` | Cancel booking | Yes |

### Vouchers
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/vouchers` | Get available vouchers | Yes |
| POST | `/api/admin/vouchers` | Create voucher | Yes (Admin) |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/users/profile` | Get current user profile | Yes |
| PUT | `/api/users/profile` | Update user profile | Yes |

## Response Format

### Success Response (200, 201)
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response (400, 401, 403, 404, 500)
```json
{
  "status": "error",
  "message": "Error description",
  "timestamp": "2026-05-02T10:30:00Z"
}
```

## Running Tests

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```


MySQL entities extend PanacheEntityBase và dùng @Entity, @Table của Jakarta Persistence.
MongoDB entities extend PanacheMongoEntityBase và dùng @MongoEntity của Quarkus.
Booking đặt Voucher là @ManyToOne nullable — khi không dùng voucher thì để null.
BookingService.priceAtBooking lưu giá tại thời điểm đặt để tránh ảnh hưởng khi admin đổi giá sau.
Bạn cần thêm dependency quarkus-mongodb-panache và quarkus-hibernate-orm-panache trong pom.xml nếu chưa có.


Luồng hoạt động chuẩn của request
    Client
    ↓
    Controller
    ↓
    DTO Request
    ↓
    Service
    ↓
    Repository
    ↓
    Database

Response:
    Database
    ↓
    Entity
    ↓
    Mapper
    ↓
    DTO Response
    ↓
    Controller
    ↓
    Client


config       → Cấu hình hệ thống / framework
controllers  → API endpoint nhận request từ client
dto          → Object trao đổi dữ liệu request/response
entity       → Mapping bảng database
repository   → Truy vấn và thao tác database
services     → Xử lý business logic
mapper       → Convert giữa Entity và DTO
exceptions   → Xử lý / định nghĩa lỗi hệ thống
security     → Authentication / Authorization / JWT
utils        → Hàm tiện ích dùng chung
