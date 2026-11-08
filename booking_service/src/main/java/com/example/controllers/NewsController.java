package com.example.controllers;

import com.example.dto.request.CreateNewsRequest;
import com.example.services.NewsService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/news")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NewsController {

    @Inject NewsService newsService;

    @GET
    public Response getPublished() {
        return Response.ok(newsService.getPublished()).build();
    }

    @GET 
    @Path("/{id}")
    public Response getById(@PathParam("id") String id) {
        return Response.ok(newsService.getAdminById(id)).build();
    }

    // --- CÁC API THÊM, SỬA, XÓA ĐƯỢC BỔ SUNG ---

    @POST
    public Response create(CreateNewsRequest req) {
        return Response.status(Response.Status.CREATED)
                       .entity(newsService.create(req))
                       .build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") String id, CreateNewsRequest req) {
        return Response.ok(newsService.update(id, req)).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") String id) {
        newsService.delete(id);
        return Response.noContent().build();
    }
}