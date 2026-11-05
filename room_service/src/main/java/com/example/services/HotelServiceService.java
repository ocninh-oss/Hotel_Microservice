package com.example.services;

import com.example.dto.request.CreateServiceRequest;
import com.example.entity.mongodb.Service.ServiceUnit;
import com.example.dto.response.ServiceResponse;
import com.example.entity.mongodb.Service;
import com.example.exceptions.AppException;
import com.example.mapper.ServiceMapper;
import com.example.repository.mongodb.ServiceRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.bson.types.ObjectId;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class HotelServiceService {

    @Inject ServiceRepository serviceRepository;
    @Inject ServiceMapper     serviceMapper;

    public List<ServiceResponse> getAll() {
        return serviceRepository.listAll()
                .stream()
                .map(serviceMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<ServiceResponse> getAvailable() {
        return serviceRepository.find("isAvailable", true)
                .stream()
                .map(serviceMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ServiceResponse getById(String id) {
        return serviceMapper.toResponse(findByIdOrThrow(id));
    }

    public ServiceResponse create(CreateServiceRequest req) {
        ServiceUnit unit = validateServiceRequest(req);
        Service s = serviceMapper.toEntity(req);
        s.unit = unit; // Manually assign to resolve type mismatch in mapper
        serviceRepository.persist(s);
        return serviceMapper.toResponse(s);
    }

    public ServiceResponse update(String id, CreateServiceRequest req) {
        ServiceUnit unit = validateServiceRequest(req);
        Service s = findByIdOrThrow(id);
        serviceMapper.updateEntity(s, req);
        s.unit = unit; // Manually assign to resolve type mismatch in mapper
        serviceRepository.update(s);
        return serviceMapper.toResponse(s);
    }

    public void delete(String id) {
        Service s = findByIdOrThrow(id);
        serviceRepository.delete(s);
    }

    public ServiceResponse toggleAvailability(String id) {
        Service s = findByIdOrThrow(id);
        s.isAvailable = !s.isAvailable;
        serviceRepository.update(s);
        return serviceMapper.toResponse(s);
    }

    // ─── helpers ────────────────────────────────────────────────────────────

    private Service findByIdOrThrow(String id) {
        try {
            return serviceRepository.findByIdOptional(new ObjectId(id))
                    .orElseThrow(() -> new AppException("Dịch vụ không tồn tại", 404));
        } catch (IllegalArgumentException e) {
            throw new AppException("ID dịch vụ không hợp lệ", 400);
        }
    }

    private ServiceUnit validateServiceRequest(CreateServiceRequest req) {
        if (req.serviceName == null || req.serviceName.isBlank())
            throw new AppException("Tên dịch vụ không được để trống", 400);
        if (req.price == null || req.price < 0)
            throw new AppException("Giá dịch vụ không hợp lệ", 400);
        if (req.unit == null || req.unit.isBlank())
            throw new AppException("Đơn vị tính không được để trống", 400);

        // Validate unit against allowed enum values
        ServiceUnit unit = ServiceUnit.fromString(req.unit);
        if (unit == null) {
            throw new AppException("Đơn vị tính không hợp lệ. Chỉ chấp nhận: Lượt, Ngày, Người, Người/Ngày", 400);
        }
        return unit;
    }
}