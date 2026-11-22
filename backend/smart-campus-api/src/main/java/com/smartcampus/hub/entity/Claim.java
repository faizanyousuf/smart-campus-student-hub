package com.smartcampus.hub.entity;

import jakarta.persistence.*;

@Entity
@Table(
    name = "claims",
    uniqueConstraints = @UniqueConstraint(
        name = "uq_claim_item_user",
        columnNames = {"item_id", "claimed_by"}
    )
)
public class Claim extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private LostItem item;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "claimed_by", nullable = false)
    private User claimedBy;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "handled_by")
    private User handledBy;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }

    public Claim() {
    }

    public Claim(LostItem item, User claimedBy, String message) {
        this.item = item;
        this.claimedBy = claimedBy;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public LostItem getItem() {
        return item;
    }

    public User getClaimedBy() {
        return claimedBy;
    }

    public String getMessage() {
        return message;
    }

    public Status getStatus() {
        return status;
    }

    public User getHandledBy() {
        return handledBy;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setItem(LostItem item) {
        this.item = item;
    }

    public void setClaimedBy(User claimedBy) {
        this.claimedBy = claimedBy;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setHandledBy(User handledBy) {
        this.handledBy = handledBy;
    }
}
