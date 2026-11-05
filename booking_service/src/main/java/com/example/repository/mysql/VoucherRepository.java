package com.example.repository.mysql;

import com.example.entity.mysql.Voucher;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class VoucherRepository implements PanacheRepository<Voucher> {
    public Optional<Voucher> findByCode(String code) {
        return find("code", code).firstResultOptional();
    }

    public List<Voucher> findAvailableVouchers() {
        return find("status = true AND quantity > 0 AND expiryDate >= ?1", LocalDate.now()).list();
    }
}