package com.proje.maps.service;

import com.proje.maps.dto.SiteBlogDTO;
import com.proje.maps.dto.CreateSiteBlogRequest;
import com.proje.maps.repo.SiteBlogRepository;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.SiteBlog;
import com.proje.maps.resource.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SiteBlogService {
    
    private final SiteBlogRepository siteBlogRepository;
    private final UserJpaRepository userRepository;
    
    public SiteBlogService(SiteBlogRepository siteBlogRepository, UserJpaRepository userRepository) {
        this.siteBlogRepository = siteBlogRepository;
        this.userRepository = userRepository;
    }
    
    public List<SiteBlogDTO> getAllBlogs() {
        List<SiteBlog> blogs = siteBlogRepository.findAllByOrderByCreatedAtDesc();
        return blogs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<SiteBlogDTO> getBlogsByCategory(String category) {
        List<SiteBlog> blogs = siteBlogRepository.findByCategoryOrderByCreatedAtDesc(category);
        return blogs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<SiteBlogDTO> getBlogsByAuthor(Long authorId) {
        List<SiteBlog> blogs = siteBlogRepository.findByAuthorIdOrderByCreatedAtDesc(authorId);
        return blogs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public SiteBlogDTO getBlogById(Long id) {
        SiteBlog blog = siteBlogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        return convertToDTO(blog);
    }
    
    @Transactional
    public SiteBlogDTO createBlog(CreateSiteBlogRequest request, String userEmail) {
        User author = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is admin
        if (!"ADMIN".equals(author.getRole())) {
            throw new RuntimeException("Only admins can create site blogs");
        }
        
        SiteBlog blog = new SiteBlog();
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setImageUrl(request.getImageUrl());
        blog.setCategory(request.getCategory());
        blog.setAuthor(author);
        
        SiteBlog savedBlog = siteBlogRepository.save(blog);
        return convertToDTO(savedBlog);
    }
    
    @Transactional
    public SiteBlogDTO updateBlog(Long id, CreateSiteBlogRequest request, String userEmail) {
        SiteBlog blog = siteBlogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is admin or the author
        if (!"ADMIN".equals(user.getRole()) && !blog.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to update this blog");
        }
        
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setImageUrl(request.getImageUrl());
        blog.setCategory(request.getCategory());
        
        SiteBlog updatedBlog = siteBlogRepository.save(blog);
        return convertToDTO(updatedBlog);
    }
    
    @Transactional
    public void deleteBlog(Long id, String userEmail) {
        SiteBlog blog = siteBlogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + id));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is admin or the author
        if (!"ADMIN".equals(user.getRole()) && !blog.getAuthor().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to delete this blog");
        }
        
        siteBlogRepository.delete(blog);
    }
    
    private SiteBlogDTO convertToDTO(SiteBlog blog) {
        return new SiteBlogDTO(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getImageUrl(),
                blog.getCategory(),
                blog.getCreatedAt(),
                blog.getAuthor().getId(),
                blog.getAuthor().getName(),
                blog.getAuthor().getEmail()
        );
    }
}
