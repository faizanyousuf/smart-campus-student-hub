package com.smartcampus.hub.service;

import com.smartcampus.hub.dto.NoticeRequest;
import com.smartcampus.hub.dto.NoticeResponse;
import com.smartcampus.hub.entity.Notice;
import com.smartcampus.hub.entity.User;
import com.smartcampus.hub.repository.NoticeRepository;
import com.smartcampus.hub.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NoticeServiceTest {

    @Mock
    private NoticeRepository noticeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NoticeService noticeService;

    @Test
    void createSavesNoticeForAuthor() {
        User author = new User(
                "Campus Admin",
                "admin@smartcampus.edu",
                "hashed-password",
                User.Role.ADMIN
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(author));
        when(noticeRepository.save(any(Notice.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        NoticeRequest request = new NoticeRequest(
                "Exam schedule",
                "The exam timetable is published.",
                Notice.Category.ACADEMIC,
                false,
                1L
        );

        NoticeResponse response = noticeService.create(request);

        assertEquals("Exam schedule", response.title());
        assertEquals("Campus Admin", response.postedByName());

        ArgumentCaptor<Notice> captor = ArgumentCaptor.forClass(Notice.class);
        verify(noticeRepository).save(captor.capture());

        Notice saved = captor.getValue();
        assertEquals("Exam schedule", saved.getTitle());
        assertEquals(author, saved.getPostedBy());
        assertEquals(Notice.Category.ACADEMIC, saved.getCategory());
    }

    @Test
    void findByIdThrowsWhenNoticeMissing() {
        when(noticeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(
                NoSuchElementException.class,
                () -> noticeService.findById(999L)
        );
    }
}
