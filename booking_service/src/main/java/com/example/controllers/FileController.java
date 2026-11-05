package com.example.controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import jakarta.ws.rs.PathParam;
// Removed unused Uni import

@Path("/files")
public class FileController {

    private static final String UPLOAD_DIR = "resource/new_images";
    private static final String ROOM_UPLOAD_DIR = "resource/room_images";

    public FileController() {
        java.nio.file.Path uploadPath = Paths.get(UPLOAD_DIR);
        java.nio.file.Path roomPath = Paths.get(ROOM_UPLOAD_DIR);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            if (!Files.exists(roomPath)) {
                Files.createDirectories(roomPath);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Existing uploadFile method remains unchanged

    @POST
    @Path("/room/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadRoomImage(@RestForm("file") FileUpload file) {
        if (file == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"No file uploaded\"}").build();
        }
        String fileName = UUID.randomUUID().toString() + "_" + file.fileName();
        java.nio.file.Path targetPath = Paths.get(ROOM_UPLOAD_DIR, fileName);
        try {
            Files.copy(file.uploadedFile(), targetPath);
            String fileUrl = "http://localhost:8080/api/files/room/" + fileName;
            return Response.ok("{\"url\": \"" + fileUrl + "\"}").build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Failed to save file: " + e.getMessage() + "\"}").build();
        }
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadFile(@RestForm("file") FileUpload file) {
        if (file == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"No file uploaded\"}").build();
        }

        String fileName = UUID.randomUUID().toString() + "_" + file.fileName();
        java.nio.file.Path targetPath = Paths.get(UPLOAD_DIR, fileName);

        try {
            Files.copy(file.uploadedFile(), targetPath);
            // Trả về URL tuyệt đối để Frontend dễ dàng sử dụng
            String fileUrl = "http://localhost:8080/api/files/" + fileName;
            return Response.ok("{\"url\": \"" + fileUrl + "\"}").build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Failed to save file: " + e.getMessage() + "\"}").build();
        }
    }

    @GET
    @Path("/{fileName}")
    public Response getFile(@PathParam("fileName") String fileName) {
        java.nio.file.Path filePath = Paths.get(UPLOAD_DIR, fileName);
        if (!Files.exists(filePath)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        File file = filePath.toFile();
        String contentType = "image/jpeg"; // Mặc định, bạn có thể dùng Files.probeContentType(filePath)
        try {
            contentType = Files.probeContentType(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return Response.ok(file).type(contentType).build();
    }
@GET
    @Path("/room/{fileName}")
    public Response getRoomFile(@PathParam("fileName") String fileName) {
        java.nio.file.Path filePath = Paths.get(ROOM_UPLOAD_DIR, fileName);
        if (!Files.exists(filePath)) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        File file = filePath.toFile();
        String contentType = "image/jpeg";
        try {
            contentType = Files.probeContentType(filePath);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Response.ok(file).type(contentType).build();
    }
}

