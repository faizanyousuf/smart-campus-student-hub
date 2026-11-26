package com.smartcampus.hub.controller;

import com.smartcampus.hub.dto.NoticeRequest;
import com.smartcampus.hub.dto.NoticeResponse;
import com.smartcampus.hub.dto.NoticeUpdateRequest;
import com.smartcampus.hub.entity.Notice;
import com.smartcampus.hub.service.NoticeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    public List<NoticeResponse> all() {
        return noticeService.findAll();
    }

    @GetMapping("/{id}")
    public NoticeResponse one(@PathVariable Long id) {
        return noticeService.findById(id);
    }

    @GetMapping("/category/{category}")
    public List<NoticeResponse> byCategory(@PathVariable Notice.Category category) {
        return noticeService.findByCategory(category);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoticeResponse create(@Valid @RequestBody NoticeRequest request) {
        return noticeService.create(request);
    }

    @PutMapping("/{id}")
    public NoticeResponse update(@PathVariable Long id,
                                 @Valid @RequestBody NoticeUpdateRequest request) {
        return noticeService.update(id, request);
    }

    @PatchMapping("/{id}/pin")
    public NoticeResponse pin(@PathVariable Long id) {
        return noticeService.pin(id);
    }

    @PatchMapping("/{id}/unpin")
    public NoticeResponse unpin(@PathVariable Long id) {
        return noticeService.unpin(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        noticeService.delete(id);
    }
}
