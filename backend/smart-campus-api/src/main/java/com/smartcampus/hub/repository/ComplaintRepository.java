package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Complaint;
import com.smartcampus.hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Optional<Complaint> findByReferenceCode(String referenceCode);

    List<Complaint> findByCreatedByOrderByCreatedAtDesc(User createdBy);

    List<Complaint> findByStatusOrderByCreatedAtDesc(Complaint.Status status);
}
