package com.example.repository.mongodb;

import com.example.entity.mongodb.Room;
import com.example.entity.mongodb.Room.RoomType;
import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class RoomRepository implements PanacheMongoRepository<Room> {

    public List<Room> search(String type, String address, Double minPrice,
                              Double maxPrice, Integer maxOccupancy) {
        StringBuilder query = new StringBuilder();
        io.quarkus.panache.common.Parameters params = new io.quarkus.panache.common.Parameters();

        if (type != null && !type.isBlank()) {
            query.append("type = :type and ");
            params.and("type", type.toUpperCase());
        }
        if (address != null && !address.isBlank()) {
            query.append("address like :address and ");
            params.and("address", "%" + address + "%");
        }
        if (minPrice != null) {
            query.append("basePrice >= :minPrice and ");
            params.and("minPrice", minPrice);
        }
        if (maxPrice != null) {
            query.append("basePrice <= :maxPrice and ");
            params.and("maxPrice", maxPrice);
        }
        if (maxOccupancy != null) {
            query.append("maxOccupancy >= :maxOccupancy and ");
            params.and("maxOccupancy", maxOccupancy);
        }

        if (query.length() > 0) {
            String q = query.substring(0, query.length() - 5);
            return find(q, params).list();
        }

        return listAll();
    }
}