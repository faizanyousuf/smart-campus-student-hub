package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.*;
import com.smartcampus.hub.entity.Claim;
import com.smartcampus.hub.entity.LostItem;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.ClaimRepository;
import com.smartcampus.hub.repository.LostItemRepository;
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
public class LostItemService {

    private final LostItemRepository lostItemRepository;
    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    public LostItemService(LostItemRepository lostItemRepository,
                           ClaimRepository claimRepository,
                           UserRepository userRepository) {
        this.lostItemRepository = lostItemRepository;
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    public List<LostItemResponse> findAll(LostItem.LostOrFound lostOrFound,
                                          LostItem.Status status) {
        List<LostItem> items;

        if (lostOrFound != null && status != null) {
            items = lostItemRepository.findByLostOrFoundOrderByCreatedAtDesc(lostOrFound)
                    .stream()
                    .filter(item -> item.getStatus() == status)
                    .toList();
        } else if (lostOrFound != null) {
            items = lostItemRepository.findByLostOrFoundOrderByCreatedAtDesc(lostOrFound);
        } else if (status != null) {
            items = lostItemRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            items = lostItemRepository.findAll()
                    .stream()
                    .sorted(Comparator.comparing(LostItem::getId).reversed())
                    .toList();
        }

        return items.stream().map(this::toItemResponse).toList();
    }

    public LostItemResponse findById(Long id) {
        return toItemResponse(findItem(id));
    }

    @Transactional
    public LostItemResponse create(String email, LostItemRequest request) {
        User createdBy = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));

        String referenceCode = "LF-"
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        LostItem item = new LostItem(
                referenceCode,
                request.itemName(),
                request.description(),
                request.category(),
                request.location(),
                request.lostOrFound(),
                createdBy
        );
        item.setImageUrl(request.imageUrl());

        return toItemResponse(lostItemRepository.save(item));
    }

    @Transactional
    public ClaimResponse claim(Long itemId, String email, ClaimRequest request) {
        LostItem item = findItem(itemId);
        User claimant = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));

        if (item.getCreatedBy().getId().equals(claimant.getId())) {
            throw new IllegalArgumentException("You cannot claim your own item");
        }

        if (item.getStatus() != LostItem.Status.OPEN
                && item.getStatus() != LostItem.Status.MATCHED) {
            throw new IllegalArgumentException("This item is no longer available for claims");
        }

        if (claimRepository.existsByItemAndClaimedBy(item, claimant)) {
            throw new IllegalArgumentException("You have already claimed this item");
        }

        Claim claim = new Claim(item, claimant, request.message());
        return toClaimResponse(claimRepository.save(claim));
    }

    public List<ClaimResponse> findClaimsForItem(Long itemId, Authentication authentication) {
        LostItem item = findItem(itemId);

        if (!isManager(authentication)
                && !item.getCreatedBy().getEmail().equals(authentication.getName())) {
            throw new AccessDeniedException("You cannot view claims for this item");
        }

        return claimRepository.findByItem(item)
                .stream()
                .map(this::toClaimResponse)
                .toList();
    }

    public List<ClaimResponse> findMyClaims(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + email));

        return claimRepository.findByClaimedBy(user)
                .stream()
                .map(this::toClaimResponse)
                .toList();
    }

    public List<ClaimResponse> findAllClaims() {
        return claimRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Claim::getId).reversed())
                .map(this::toClaimResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public ClaimResponse approve(Long claimId, String staffEmail) {
        return decide(claimId, Claim.Status.APPROVED, staffEmail);
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public ClaimResponse reject(Long claimId, String staffEmail) {
        return decide(claimId, Claim.Status.REJECTED, staffEmail);
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public LostItemResponse updateItemStatus(Long id, LostItem.Status status) {
        LostItem item = findItem(id);
        item.setStatus(status);
        return toItemResponse(lostItemRepository.save(item));
    }

    private ClaimResponse decide(Long claimId, Claim.Status decision, String staffEmail) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new NoSuchElementException("Claim not found: " + claimId));

        User staff = userRepository.findByEmail(staffEmail)
                .orElseThrow(() -> new NoSuchElementException("User not found: " + staffEmail));

        claim.setStatus(decision);
        claim.setHandledBy(staff);

        if (decision == Claim.Status.APPROVED) {
            LostItem item = claim.getItem();
            item.setStatus(LostItem.Status.CLAIMED);
            lostItemRepository.save(item);
        }

        return toClaimResponse(claimRepository.save(claim));
    }

    private boolean isManager(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority ->
                        authority.getAuthority().equals("ROLE_STAFF")
                                || authority.getAuthority().equals("ROLE_ADMIN"));
    }

    private LostItem findItem(Long id) {
        return lostItemRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Lost item not found: " + id));
    }

    private LostItemResponse toItemResponse(LostItem item) {
        return new LostItemResponse(
                item.getId(),
                item.getReferenceCode(),
                item.getItemName(),
                item.getDescription(),
                item.getCategory(),
                item.getLocation(),
                item.getLostOrFound(),
                item.getStatus(),
                item.getImageUrl(),
                item.getCreatedBy().getId(),
                item.getCreatedBy().getFullName(),
                item.getCreatedAt()
        );
    }

    private ClaimResponse toClaimResponse(Claim claim) {
        User handled = claim.getHandledBy();

        return new ClaimResponse(
                claim.getId(),
                claim.getItem().getId(),
                claim.getItem().getReferenceCode(),
                claim.getItem().getItemName(),
                claim.getClaimedBy().getId(),
                claim.getClaimedBy().getFullName(),
                claim.getMessage(),
                claim.getStatus(),
                handled == null ? null : handled.getId(),
                handled == null ? null : handled.getFullName(),
                claim.getCreatedAt()
        );
    }
}
