package com.example.repository.mongodb;

import com.example.entity.mongodb.Service;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ServiceRepository implements PanacheMongoRepository<Service> { }