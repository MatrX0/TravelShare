package com.proje.maps.api;

import com.proje.maps.dto.*;
import com.proje.maps.service.GroupBlogService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/blogs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class GroupBlogController {
    
    private final GroupBlogService blogService;
    
    public GroupBlogController(GroupBlogService blogService) {
        this.blogService = blogService;
    }
    
    // Get group blogs
    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupBlogDTO>>> getBlogs(
            @PathVariable Long groupId) {
        List<GroupBlogDTO> blogs = blogService.getGroupBlogs(groupId);
        return ResponseEntity.ok(ApiResponse.success(blogs));
    }
    
    // Get group blogs (paginated)
    @GetMapping("/paginated")
    public ResponseEntity<ApiResponse<Page<GroupBlogDTO>>> getBlogsPaginated(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<GroupBlogDTO> blogs = blogService.getGroupBlogsPaginated(groupId, page, size);
        return ResponseEntity.ok(ApiResponse.success(blogs));
    }
    
    // Create blog
    @PostMapping
    public ResponseEntity<ApiResponse<GroupBlogDTO>> createBlog(
            @PathVariable Long groupId,
            @Valid @RequestBody CreateBlogRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            GroupBlogDTO blog = blogService.createBlog(groupId, userId, request);
            return ResponseEntity.ok(ApiResponse.success("Blog created successfully", blog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Get blog by ID
    @GetMapping("/{blogId}")
    public ResponseEntity<ApiResponse<GroupBlogDTO>> getBlog(
            @PathVariable Long groupId,
            @PathVariable Long blogId) {
        GroupBlogDTO blog = blogService.getBlogById(blogId);
        return ResponseEntity.ok(ApiResponse.success(blog));
    }
    
    // Update blog
    @PutMapping("/{blogId}")
    public ResponseEntity<ApiResponse<GroupBlogDTO>> updateBlog(
            @PathVariable Long groupId,
            @PathVariable Long blogId,
            @Valid @RequestBody CreateBlogRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            GroupBlogDTO blog = blogService.updateBlog(blogId, userId, request);
            return ResponseEntity.ok(ApiResponse.success("Blog updated successfully", blog));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Delete blog
    @DeleteMapping("/{blogId}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(
            @PathVariable Long groupId,
            @PathVariable Long blogId,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Long userId = getCurrentUserId(userDetails);
            blogService.deleteBlog(blogId, userId);
            return ResponseEntity.ok(ApiResponse.success("Blog deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    // Search blogs
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<GroupBlogDTO>>> searchBlogs(
            @PathVariable Long groupId,
            @RequestParam String keyword) {
        List<GroupBlogDTO> blogs = blogService.searchBlogs(groupId, keyword);
        return ResponseEntity.ok(ApiResponse.success(blogs));
    }
    
    private Long getCurrentUserId(UserDetails userDetails) {
        return 1L; // TODO: Get from UserDetails
    }
}
