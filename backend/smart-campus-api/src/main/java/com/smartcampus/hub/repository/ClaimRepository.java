package com.smartcampus.hub.repository;

import com.smartcampus.hub.entity.Claim;
import com.smartcampus.hub.entity.LostItem;
import com.smartcampus.hub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByItem(LostItem item);

    List<Claim> findByClaimedBy(User claimedBy);

    boolean existsByItemAndClaimedBy(LostItem item, User claimedBy);
}
