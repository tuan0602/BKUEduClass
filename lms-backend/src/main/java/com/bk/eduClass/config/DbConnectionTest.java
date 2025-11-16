// package com.bk.eduClass.config;

// import com.bk.eduClass.repository.UserRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;
// import org.springframework.beans.factory.annotation.Autowired;

// @Component
// public class DbConnectionTest implements CommandLineRunner {

//     private final UserRepository userRepository;

//     @Autowired
//     public DbConnectionTest(UserRepository userRepository) {
//         this.userRepository = userRepository;
//     }

//     @Override
//     public void run(String... args) throws Exception {
//         try {
//             long count = userRepository.count(); // Thử truy vấn đơn giản
//             System.out.println("✅ Database connected successfully! Users count: " + count);
//         } catch (Exception e) {
//             System.err.println("❌ Failed to connect to database:");
//             e.printStackTrace();
//         }
//     }
// }
