package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findAllByOrderByPinnedDescCreatedAtDesc();

    List<Notice> findByCategory(Notice.Category category);
}
