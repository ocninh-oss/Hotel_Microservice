package com.example.controllers;

import java.util.List;

import com.example.dto.request.CreateVoucherRequest; // Bổ sung import Request DTO
import com.example.dto.response.VoucherResponse;
import com.example.services.VoucherService;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST; // Bổ sung import POST
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
@Path("/vouchers")
@Produces(MediaType.APPLICATION_JSON)
public class VoucherController {

    @Inject
    VoucherService voucherService;

    /**
     * Endpoint cho khách hàng xem các mã giảm giá hiện có
     */
    @GET
    @PermitAll
    public Response getAvailableVouchers() {
        List<VoucherResponse> vouchers = voucherService.getAvailableVouchers();
        return Response.ok(vouchers).build();
    }

    /**
     * Endpoint để kiểm tra nhanh một mã voucher (dùng trong trang đặt phòng)
     */
    @GET
    @Path("/validate")
    @RolesAllowed({"CUSTOMER", "ADMIN"})
    public Response validateVoucher(@QueryParam("code") String code, 
                                   @QueryParam("totalPrice") Double totalPrice) {
        VoucherResponse response = voucherService.validateVoucher(code, totalPrice);
        return Response.ok(response).build();
    }

    /**
     * Endpoint để Admin tạo thêm mã giảm giá mới
     */
    @POST
    @RolesAllowed("ADMIN") // Khóa bảo mật: Chỉ Admin mới được phép gọi hàm này
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createVoucher(CreateVoucherRequest req) {
        // Gọi sang tầng Service để xử lý logic lưu Database
        VoucherResponse response = voucherService.createVoucher(req);
        
        // Trả về HTTP Status 201 (Created) báo hiệu tạo tài nguyên thành công
        return Response.status(Response.Status.CREATED).entity(response).build();
    }
    /**
     * Endpoint để Admin cập nhật mã giảm giá hiện có
     */
    @PUT
    @Path("/{id}") // Vì class đã có @Path("/vouchers") và API Gateway định tuyến /admin/vouchers đến đây
    @RolesAllowed("ADMIN")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateVoucher(@PathParam("id") Long id, CreateVoucherRequest req) {
        VoucherResponse response = voucherService.updateVoucher(id, req);
        return Response.ok(response).build();
    }
}