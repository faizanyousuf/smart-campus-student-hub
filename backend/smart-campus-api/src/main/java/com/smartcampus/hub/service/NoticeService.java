package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.NoticeRequest;
import com.smartcampus.hub.dto.NoticeResponse;
import com.smartcampus.hub.dto.NoticeUpdateRequest;
import com.smartcampus.hub.entity.Notice;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.NoticeRepository;
import com.smartcampus.hub.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    public NoticeService(NoticeRepository noticeRepository,
                         UserRepository userRepository) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
    }

    public List<NoticeResponse> findAll() {
        return noticeRepository.findAllByOrderByPinnedDescCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NoticeResponse> findByCategory(Notice.Category category) {
        return noticeRepository.findByCategory(category)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public NoticeResponse findById(Long id) {
        return toResponse(findEntity(id));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public NoticeResponse create(NoticeRequest request) {
        User author = userRepository.findById(request.postedById())
                .orElseThrow(() -> new NoSuchElementException(
                        "User not found: " + request.postedById()));

        Notice notice = new Notice(
                request.title(),
                request.body(),
                request.category(),
                author
        );
        notice.setPinned(request.pinned());

        return toResponse(noticeRepository.save(notice));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public NoticeResponse update(Long id, NoticeUpdateRequest request) {
        Notice notice = findEntity(id);
        notice.setTitle(request.title());
        notice.setBody(request.body());
        notice.setCategory(request.category());
        notice.setPinned(request.pinned());
        return toResponse(noticeRepository.save(notice));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public NoticeResponse pin(Long id) {
        Notice notice = findEntity(id);
        notice.setPinned(true);
        return toResponse(noticeRepository.save(notice));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public NoticeResponse unpin(Long id) {
        Notice notice = findEntity(id);
        notice.setPinned(false);
        return toResponse(noticeRepository.save(notice));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Transactional
    public void delete(Long id) {
        noticeRepository.delete(findEntity(id));
    }

    private Notice findEntity(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Notice not found: " + id));
    }

    private NoticeResponse toResponse(Notice notice) {
        return new NoticeResponse(
                notice.getId(),
                notice.getTitle(),
                notice.getBody(),
                notice.getCategory(),
                notice.isPinned(),
                notice.getPostedBy().getId(),
                notice.getPostedBy().getFullName(),
                notice.getCreatedAt()
        );
    }
}
