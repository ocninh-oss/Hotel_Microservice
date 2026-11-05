package main.java.com.example.controllers;

import com.example.services.UserService;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
public class UserQueryController {

    @Inject
    UserService userService;

    // API này sẽ khớp với đường dẫn /users/{id} mà booking_service đang gọi
    @GET
    @Path("/{id}")
    @PermitAll // Cho phép booking_service gọi sang mà không bị chặn xác thực
    public com.example.dto.response.UserResponse getUserById(@PathParam("id") Long id) {
        return userService.getUserById(id);
    }
}