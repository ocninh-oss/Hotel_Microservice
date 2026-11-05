package com.example.controllers;

import com.example.services.NewsService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/news")
@Produces(MediaType.APPLICATION_JSON)
public class NewsController {

    @Inject NewsService newsService;

    @GET
    public Response getPublished() {
        return Response.ok(newsService.getPublished()).build();
    }

    @GET @Path("/{id}")
    public Response getById(@PathParam("id") String id) {
        return Response.ok(newsService.getAdminById(id)).build();
    }
}