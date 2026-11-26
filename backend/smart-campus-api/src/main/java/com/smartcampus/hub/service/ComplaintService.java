package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.ComplaintRequest;
import com.smartcampus.hub.dto.ComplaintResponse;
import com.smartcampus.hub.dto.ComplaintStatusRequest;
import com.smartcampus.hub.entity.Complaint;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.ComplaintRepository;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintService(ComplaintRepository complaintRepository,
                            UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    public List<ComplaintResponse> findAllForPrincipal(Authentication authentication) {
        boolean manager = isManager(authentication);

        return complaintRepository.findAll()
                .stream()
                .filter(complaint -> manager
                        || complaint.getCreatedBy().getEmail().equals(authentication.getName()))
                .sorted(Comparator.comparing(Complaint::getId).reversed())
                .map(this::toResponse)
                .toList();
    }

    public ComplaintResponse findById(Long id, Authentication authentication) {
        Complaint complaint = findEntity(id);

        if (!isManager(authentication)
                && !complaint.getCreatedBy().getEmail().equals(authentication.getName())) {
            throw new AccessDeniedException("You cannot view this complaint");
        }

        return toResponse(complaint);
    }

    @Transactional
    public ComplaintResponse create(String email, ComplaintRequest request) {
        User createdBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));

        String referenceCode = "CMP-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Complaint complaint = new Complaint(
                referenceCode,
                request.title(),
                request.description(),
                request.category(),
                createdBy
        );

        return toResponse(complaintRepository.save(complaint));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public ComplaintResponse assign(Long id, String email) {
        User staff = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));

        Complaint complaint = findEntity(id);
        complaint.setAssignedTo(staff);

        return toResponse(complaintRepository.save(complaint));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public ComplaintResponse updateStatus(Long id, ComplaintStatusRequest request) {
        Complaint complaint = findEntity(id);
        complaint.setStatus(request.status());

        return toResponse(complaintRepository.save(complaint));
    }

    private boolean isManager(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_STAFF")
                                || authority.getAuthority().equals("ROLE_ADMIN"));
    }

    private Complaint findEntity(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Complaint not found: " + id));
    }

    private ComplaintResponse toResponse(Complaint complaint) {
        User assigned = complaint.getAssignedTo();

        return new ComplaintResponse(
                complaint.getId(),
                complaint.getReferenceCode(),
                complaint.getTitle(),
                complaint.getDescription(),
                complaint.getCategory(),
                complaint.getStatus(),
                complaint.getCreatedBy().getId(),
                complaint.getCreatedBy().getFullName(),
                assigned == null ? null : assigned.getId(),
                assigned == null ? null : assigned.getFullName(),
                complaint.getCreatedAt()
        );
    }
}
