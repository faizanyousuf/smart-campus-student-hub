package com.smartcampus.hub.config;

import com.smartcampus.hub.entity.*;
import com.smartcampus.hub.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataSeeder {

    // DEMO ONLY - public local-testing password. Change before any real deployment.
    private static final String DEMO_PASSWORD = "Demo@12345";

    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;
    private final LostItemRepository lostItemRepository;
    private final ClaimRepository claimRepository;

    public DataSeeder(UserRepository userRepository,
                      NoticeRepository noticeRepository,
                      ComplaintRepository complaintRepository,
                      LostItemRepository lostItemRepository,
                      ClaimRepository claimRepository) {
        this.userRepository = userRepository;
        this.noticeRepository = noticeRepository;
        this.complaintRepository = complaintRepository;
        this.lostItemRepository = lostItemRepository;
        this.claimRepository = claimRepository;
    }

    @Bean
    CommandLineRunner seed() {
        return args -> {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String hash = encoder.encode(DEMO_PASSWORD);

            User admin = ensureUser("Campus Admin", "admin@smartcampus.edu",
                    null, "Administration", User.Role.ADMIN, hash);
            User staff = ensureUser("Dr. Sarah Staff", "staff@smartcampus.edu",
                    null, "Student Affairs", User.Role.STAFF, hash);
            User student = ensureUser("Ali Student", "student@smartcampus.edu",
                    "STU-1001", "Computer Science", User.Role.STUDENT, hash);
            User student2 = ensureUser("Aisha Student", "student2@smartcampus.edu",
                    "STU-1002", "Business", User.Role.STUDENT, hash);

            if (noticeRepository.count() == 0) {
                noticeRepository.save(new Notice(
                        "Welcome to Smart Campus",
                        "Orientation starts Monday at the main hall. Bring your student ID.",
                        Notice.Category.GENERAL, admin));

                Notice event = new Notice(
                        "Career Fair This Friday",
                        "Over 30 companies will attend. Register at the student affairs desk.",
                        Notice.Category.EVENT, staff);
                event.setPinned(true);
                noticeRepository.save(event);

                noticeRepository.save(new Notice(
                        "Library Extended Hours",
                        "The library will stay open until 22:00 during exam week.",
                        Notice.Category.ACADEMIC, staff));
            }

            if (complaintRepository.findByReferenceCode("CMP-1001").isEmpty()) {
                Complaint c1 = new Complaint(
                        "CMP-1001",
                        "Wi-Fi in Library",
                        "The second-floor Wi-Fi keeps disconnecting during lectures.",
                        "IT", student);
                c1.setAssignedTo(staff);
                complaintRepository.save(c1);
            }

            if (complaintRepository.findByReferenceCode("CMP-1002").isEmpty()) {
                complaintRepository.save(new Complaint(
                        "CMP-1002",
                        "Hostel water supply",
                        "No hot water in Block B since yesterday evening.",
                        "Facilities", student2));
            }

            LostItem lostItem = lostItemRepository.findByReferenceCode("LNF-1001")
                    .orElseGet(() -> lostItemRepository.save(new LostItem(
                            "LNF-1001",
                            "Blue backpack",
                            "Blue backpack with a laptop inside, last seen near the library.",
                            "Accessories", "Library",
                            LostItem.LostOrFound.LOST, student)));

            LostItem foundItem = lostItemRepository.findByReferenceCode("LNF-1002")
                    .orElseGet(() -> lostItemRepository.save(new LostItem(
                            "LNF-1002",
                            "Student ID card",
                            "Found a student ID card near the cafeteria entrance.",
                            "Documents", "Cafeteria",
                            LostItem.LostOrFound.FOUND, staff)));

            if (!claimRepository.existsByItemAndClaimedBy(foundItem, student2)) {
                claimRepository.save(new Claim(
                        foundItem, student2,
                        "I lost this card yesterday afternoon."));
            }

            System.out.println("Seed complete. Demo login: student@smartcampus.edu / " + DEMO_PASSWORD);
        };
    }

    private User ensureUser(String fullName, String email, String studentId,
                            String department, User.Role role, String hash) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User(fullName, email, hash, role);
            user.setStudentId(studentId);
            user.setDepartment(department);
            return userRepository.save(user);
        });
    }
}
