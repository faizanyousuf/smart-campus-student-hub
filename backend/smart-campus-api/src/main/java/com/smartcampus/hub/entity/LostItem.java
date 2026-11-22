package com.smartcampus.hub.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "lost_items")
public class LostItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reference_code", nullable = false, unique = true, length = 20)
    private String referenceCode;

    @Column(name = "item_name", nullable = false, length = 200)
    private String itemName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "lost_or_found", nullable = false, length = 20)
    private LostOrFound lostOrFound;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.OPEN;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    public enum LostOrFound {
        LOST, FOUND
    }

    public enum Status {
        OPEN, MATCHED, CLAIMED, RETURNED
    }

    public LostItem() {
    }

    public LostItem(String referenceCode, String itemName, String description,
                    String category, String location, LostOrFound lostOrFound,
                    User createdBy) {
        this.referenceCode = referenceCode;
        this.itemName = itemName;
        this.description = description;
        this.category = category;
        this.location = location;
        this.lostOrFound = lostOrFound;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public String getItemName() {
        return itemName;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getLocation() {
        return location;
    }

    public LostOrFound getLostOrFound() {
        return lostOrFound;
    }

    public Status getStatus() {
        return status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setLostOrFound(LostOrFound lostOrFound) {
        this.lostOrFound = lostOrFound;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}
