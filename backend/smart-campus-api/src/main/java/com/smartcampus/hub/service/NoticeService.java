package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.NoticeRequest;
import com.smartcampus.hub.dto.NoticeResponse;
import com.smartcampus.hub.entity.Notice;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.NoticeRepository;
import com.smartcampus.hub.repository.UserRepository;
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
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Notice not found: " + id));
        return toResponse(notice);
    }

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

    @Transactional
    public NoticeResponse pin(Long id) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Notice not found: " + id));
        notice.setPinned(true);
        return toResponse(noticeRepository.save(notice));
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
