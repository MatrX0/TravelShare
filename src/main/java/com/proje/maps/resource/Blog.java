package com.proje.maps.resource;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
public class Blog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String coordinate;
    private String title;          
    private String content;   
    
    // private LocalDateTime createdAt;

    private String placeId;
    private String placeName;
    private String address;
    private Double rating;
    private Integer reviewCount;
    private Boolean openNow;
    private String phoneNumber;
    private String websiteUrl;
    private String routePolyline;

    @ManyToOne
    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "blog")
    private List<Comment> comments;
    
    public Blog(Long id,String coordinate, String title, String content, String placeId, String placeName, String address,
                Double rating, Integer reviewCount, Boolean openNow, String phoneNumber,
                String websiteUrl, String routePolyline, User user, List<Comment> comments) {

        this.id = id;
        this.coordinate = coordinate;
        this.title = title;
        this.content = content;
        this.placeId = placeId;
        this.placeName = placeName;
        this.address = address;
        // this.latitude = latitude;
        // this.longitude = longitude;
        this.comments= comments;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.openNow = openNow;
        this.phoneNumber = phoneNumber;
        this.websiteUrl = websiteUrl;
        this.routePolyline = routePolyline;
        this.user = user;
    }

    public Blog() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPlaceId() {
        return placeId;
    }

    public void setPlaceId(String placeId) {
        this.placeId = placeId;
    }

    public String getPlaceName() {
        return placeName;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    // public Double getLatitude() {
    //     return latitude;
    // }

    // public void setLatitude(Double latitude) {
    //     this.latitude = latitude;
    // }

    // public Double getLongitude() {
    //     return longitude;
    // }
    
    // public void setLongitude(Double longitude) {
    //     this.longitude = longitude;
    // }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Boolean getOpenNow() {
        return openNow;
    }

    public void setOpenNow(Boolean openNow) {
        this.openNow = openNow;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getRoutePolyline() {
        return routePolyline;
    }

    public void setRoutePolyline(String routePolyline) {
        this.routePolyline = routePolyline;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCoordinate() {
        return coordinate;
    }

    public void setCoordinate(String coordinate) {
        this.coordinate = coordinate;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    } 
}
