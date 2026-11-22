package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Long> {

    Optional<LostItem> findByReferenceCode(String referenceCode);

    @Query("select l from LostItem l where l.lostOrFound = :lostOrFound order by l.createdAt desc")
    List<LostItem> findByLostOrFoundOrderByCreatedAtDesc(
            @Param("lostOrFound") LostItem.LostOrFound lostOrFound);

    @Query("select l from LostItem l where l.status = :status order by l.createdAt desc")
    List<LostItem> findByStatusOrderByCreatedAtDesc(
            @Param("status") LostItem.Status status);
}
