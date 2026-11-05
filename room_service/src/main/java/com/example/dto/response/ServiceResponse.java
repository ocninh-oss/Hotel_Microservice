package com.example.dto.response;

import com.example.entity.mongodb.Service;

public class ServiceResponse {
    public String id;
    public String serviceName;
    public String description;
    public Double price;
    public String unit;
    public Boolean isAvailable;

    public static ServiceResponse from(Service s) {
        ServiceResponse r = new ServiceResponse();
        r.id = s.id.toHexString(); r.serviceName = s.serviceName;
        r.description = s.description; r.price = s.price;
        r.unit = (s.unit != null) ? s.unit.displayName : null;
        r.isAvailable = s.isAvailable;
        return r;
    }
}