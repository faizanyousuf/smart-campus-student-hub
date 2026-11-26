package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.DashboardResponse;
import com.smartcampus.hub.entity.Claim;
import com.smartcampus.hub.entity.Complaint;
import com.smartcampus.hub.entity.LostItem;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.ClaimRepository;
import com.smartcampus.hub.repository.ComplaintRepository;
import com.smartcampus.hub.repository.LostItemRepository;
import com.smartcampus.hub.repository.NoticeRepository;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final NoticeRepository noticeRepository;
    private final ComplaintRepository complaintRepository;
    private final LostItemRepository lostItemRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    public DashboardService(NoticeRepository noticeRepository,
                            ComplaintRepository complaintRepository,
                            LostItemRepository lostItemRepository,
                            ClaimRepository claimRepository,
                            UserRepository userRepository) {
        this.noticeRepository = noticeRepository;
        this.complaintRepository = complaintRepository;
        this.lostItemRepository = lostItemRepository;
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));

        long totalNotices = noticeRepository.count();
        long totalComplaints = complaintRepository.count();
        long openComplaints = complaintRepository.findAll()
                .stream()
                .filter(complaint -> complaint.getStatus() == Complaint.Status.OPEN)
                .count();

        long totalLostItems = lostItemRepository.count();
        long openLostItems = lostItemRepository.findAll()
                .stream()
                .filter(item -> item.getStatus() == LostItem.Status.OPEN)
                .count();

        long pendingClaims = claimRepository.findAll()
                .stream()
                .filter(claim -> claim.getStatus() == Claim.Status.PENDING)
                .count();

        long myComplaints = complaintRepository.findAll()
                .stream()
                .filter(complaint -> complaint.getCreatedBy().getId().equals(user.getId()))
                .count();

        long myClaims = claimRepository.findAll()
                .stream()
                .filter(claim -> claim.getClaimedBy().getId().equals(user.getId()))
                .count();

        long myLostItems = lostItemRepository.findAll()
                .stream()
                .filter(item -> item.getCreatedBy().getId().equals(user.getId()))
                .count();

        return new DashboardResponse(
                user.getFullName(),
                user.getRole().name(),
                totalNotices,
                totalComplaints,
                openComplaints,
                totalLostItems,
                openLostItems,
                pendingClaims,
                myComplaints,
                myClaims,
                myLostItems
        );
    }
}
