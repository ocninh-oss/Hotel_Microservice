package com.example.config;

import com.example.entity.mysql.User;
import com.example.repository.mysql.UserRepository;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.util.logging.Logger;

/**
 * Tự động tạo tài khoản ADMIN mặc định khi khởi động lần đầu
 * (nếu chưa có user nào trong DB)
 */
@ApplicationScoped
public class StartupConfig {

    private static final Logger LOG = Logger.getLogger(StartupConfig.class.getName());

    @Inject
    UserRepository userRepository;

    @Transactional
    public void onStart(@Observes StartupEvent event) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.username = "admin";
            admin.fullName = "Super Admin";
            admin.email    = "admin@hotel22.com";
            admin.password = BcryptUtil.bcryptHash("Admin@123");
            admin.phone    = "0365467482";
            admin.role     = User.Role.ADMIN;
            admin.status   = true;
            userRepository.persist(admin);
            LOG.info("Tạo tài khoản ADMIN mặc định: admin@hotel22.com / Admin@123");
        }
    }
}