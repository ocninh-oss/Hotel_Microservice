package main.java.com.example.controllers;

import com.example.entity.mysql.User;
// Nhớ import các DTO (nếu có) như UserRequest, UserResponse...
import jakarta.annotation.security.RolesAllowed;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.example.services.UserService;

@Path("/users") // Khớp với đường dẫn Gateway đẩy sang sau khi cắt chữ /admin/
@RequestScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("ADMIN") // Chỉ Admin mới được phép thao tác
public class AdminUserController {

    @Inject
    UserService userService;

    // 1. Lấy danh sách toàn bộ người dùng hiển thị lên bảng
    @GET
    public Response getAllUsers() {
        // Giả sử trong UserService bạn đã viết hàm getAllUsers()
        return Response.ok(userService.getAllUsers()).build();
    }

    // 2. Thêm người dùng mới (từ nút Thêm mới)
    // @POST
    // public Response createUser(...) { ... }

    // 3. Khóa/Mở khóa tài khoản (từ nút Toggle)
    // @PUT
    // @Path("/{id}/toggle")
    // public Response toggleUserStatus(@PathParam("id") Long id) { ... }

    // 4. Xóa người dùng (từ nút Thùng rác)
    // @DELETE
    // @Path("/{id}")
    // public Response deleteUser(@PathParam("id") Long id) { ... }
}