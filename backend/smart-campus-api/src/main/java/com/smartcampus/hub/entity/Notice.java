package com.smartcampus.hub.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notices")
public class Notice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Category category = Category.GENERAL;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "posted_by", nullable = false)
    private User postedBy;

    @Column(name = "is_pinned", nullable = false)
    private boolean pinned = false;

    public enum Category {
        GENERAL, ACADEMIC, EVENT, URGENT
    }

    public Notice() {
    }

    public Notice(String title, String body, Category category, User postedBy) {
        this.title = title;
        this.body = body;
        this.category = category;
        this.postedBy = postedBy;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getBody() {
        return body;
    }

    public Category getCategory() {
        return category;
    }

    public User getPostedBy() {
        return postedBy;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }
}
