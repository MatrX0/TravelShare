package com.proje.maps.api;

import com.proje.maps.dto.ApiResponse;
import com.proje.maps.dto.CreateSiteBlogRequest;
import com.proje.maps.dto.SiteBlogDTO;
import com.proje.maps.service.SiteBlogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/site-blogs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
public class SiteBlogController {
    
    private final SiteBlogService siteBlogService;
    
    public SiteBlogController(SiteBlogService siteBlogService) {
        this.siteBlogService = siteBlogService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<SiteBlogDTO>>> getAllBlogs() {
        try {
            List<SiteBlogDTO> blogs = siteBlogService.getAllBlogs();
            return ResponseEntity.ok(ApiResponse.success("Blogs retrieved successfully", blogs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve blogs: " + e.getMessage()));
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<SiteBlogDTO>>> getBlogsByCategory(@PathVariable String category) {
        try {
            List<SiteBlogDTO> blogs = siteBlogService.getBlogsByCategory(category);
            return ResponseEntity.ok(ApiResponse.success("Blogs retrieved successfully", blogs));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve blogs: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SiteBlogDTO>> getBlogById(@PathVariable Long id) {
        try {
            SiteBlogDTO blog = siteBlogService.getBlogById(id);
            return ResponseEntity.ok(ApiResponse.success("Blog retrieved successfully", blog));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve blog: " + e.getMessage()));
        }
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<SiteBlogDTO>> createBlog(
            @RequestBody CreateSiteBlogRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(401)
                        .body(ApiResponse.error("Authentication required"));
            }
            
            SiteBlogDTO blog = siteBlogService.createBlog(request, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Blog created successfully", blog));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create blog: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SiteBlogDTO>> updateBlog(
            @PathVariable Long id,
            @RequestBody CreateSiteBlogRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(401)
                        .body(ApiResponse.error("Authentication required"));
            }
            
            SiteBlogDTO blog = siteBlogService.updateBlog(id, request, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Blog updated successfully", blog));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update blog: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBlog(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(401)
                        .body(ApiResponse.error("Authentication required"));
            }
            
            siteBlogService.deleteBlog(id, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.success("Blog deleted successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete blog: " + e.getMessage()));
        }
    }
}
