package com.example.client;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;

@Path("/users") // Điều chỉnh URL khớp với API bên user_service của bạn
@RegisterRestClient(configKey = "user-service")
public interface UserServiceClient {
    
    @GET
    @Path("/{id}")
    com.example.dto.response.UserDto getUserById(@PathParam("id") Long id);
}