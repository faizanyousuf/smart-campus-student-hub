package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.ClaimRequest;
import com.smartcampus.hub.dto.ClaimResponse;
import com.smartcampus.hub.dto.LostItemRequest;
import com.smartcampus.hub.dto.LostItemResponse;
import com.smartcampus.hub.dto.LostItemStatusRequest;
import com.smartcampus.hub.entity.LostItem;
import com.smartcampus.hub.service.LostItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost-items")
public class LostItemController {

    private final LostItemService lostItemService;

    public LostItemController(LostItemService lostItemService) {
        this.lostItemService = lostItemService;
    }

    @GetMapping
    public List<LostItemResponse> all(
            @RequestParam(required = false) LostItem.LostOrFound lostOrFound,
            @RequestParam(required = false) LostItem.Status status) {
        return lostItemService.findAll(lostOrFound, status);
    }

    @GetMapping("/type/{lostOrFound}")
    public List<LostItemResponse> byType(@PathVariable LostItem.LostOrFound lostOrFound) {
        return lostItemService.findAll(lostOrFound, null);
    }

    @GetMapping("/status/{status}")
    public List<LostItemResponse> byStatus(@PathVariable LostItem.Status status) {
        return lostItemService.findAll(null, status);
    }

    @GetMapping("/{id}")
    public LostItemResponse one(@PathVariable Long id) {
        return lostItemService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LostItemResponse create(@AuthenticationPrincipal UserDetails userDetails,
                                   @Valid @RequestBody LostItemRequest request) {
        return lostItemService.create(userDetails.getUsername(), request);
    }

    @PostMapping("/{id}/claims")
    @ResponseStatus(HttpStatus.CREATED)
    public ClaimResponse claim(@PathVariable Long id,
                               @AuthenticationPrincipal UserDetails userDetails,
                               @Valid @RequestBody ClaimRequest request) {
        return lostItemService.claim(id, userDetails.getUsername(), request);
    }

    @GetMapping("/{id}/claims")
    public List<ClaimResponse> claims(@PathVariable Long id, Authentication authentication) {
        return lostItemService.findClaimsForItem(id, authentication);
    }

    @PatchMapping("/{id}/status")
    public LostItemResponse updateStatus(@PathVariable Long id,
                                         @Valid @RequestBody LostItemStatusRequest request) {
        return lostItemService.updateItemStatus(id, request.status());
    }
}
