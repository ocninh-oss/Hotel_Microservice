package com.example.mapper;

import com.example.dto.request.CreateServiceRequest;
import com.example.dto.response.ServiceResponse;
import com.example.entity.mongodb.Service;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ServiceMapper {

    public ServiceResponse toResponse(Service s) {
        if (s == null) return null;
        ServiceResponse res = new ServiceResponse();
        res.id          = s.id.toHexString();
        res.serviceName = s.serviceName;
        res.description = s.description;
        res.price       = s.price;
        // Nếu ServiceResponse.unit là String, ta lấy displayName để hiển thị cho đẹp
        res.unit        = (s.unit != null) ? s.unit.displayName : null; 
        res.isAvailable = s.isAvailable;
        return res;
    }

    public Service toEntity(CreateServiceRequest req) {
        if (req == null) return null;
        Service s = new Service();
        s.serviceName = req.serviceName;
        s.description = req.description;
        s.price       = req.price;
        
        // Sửa lỗi tại đây: Sử dụng hàm static từ class Service
        s.unit        = Service.ServiceUnit.fromString(req.unit);
        
        s.isAvailable = (req.isAvailable != null) ? req.isAvailable : true;
        return s;
    }

    public void updateEntity(Service s, CreateServiceRequest req) {
        if (s == null || req == null) return;
        s.serviceName = req.serviceName;
        s.description = req.description;
        s.price       = req.price;
        
        // Cập nhật enum unit
        s.unit        = Service.ServiceUnit.fromString(req.unit);
        
        if (req.isAvailable != null) {
            s.isAvailable = req.isAvailable;
        }
    }
}