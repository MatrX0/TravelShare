package com.proje.maps.service;

import com.proje.maps.dto.*;
import com.proje.maps.repo.*;
import com.proje.maps.resource.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupBlogService {
    
    private final GroupBlogRepository blogRepository;
    private final ActivityGroupRepository groupRepository;
    private final UserJpaRepository userRepository;
    
    public GroupBlogService(GroupBlogRepository blogRepository,
                           ActivityGroupRepository groupRepository,
                           UserJpaRepository userRepository) {
        this.blogRepository = blogRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }
    
    // Create blog
    @Transactional
    public GroupBlogDTO createBlog(Long groupId, Long userId, CreateBlogRequest request) {
        // Check if group exists
        ActivityGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        
        // Check if user is member
        if (!groupRepository.isUserMember(groupId, userId)) {
            throw new RuntimeException("User must be a member of the group to create blogs");
        }
        
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Create blog
        GroupBlog blog = new GroupBlog(group, user, request.getTitle(), request.getContent());
        blog.setImageUrl(request.getImageUrl());
        
        GroupBlog savedBlog = blogRepository.save(blog);
        return toBlogDTO(savedBlog);
    }
    
    // Get group blogs
    public List<GroupBlogDTO> getGroupBlogs(Long groupId) {
        List<GroupBlog> blogs = blogRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
        return blogs.stream()
                .map(this::toBlogDTO)
                .collect(Collectors.toList());
    }
    
    // Get group blogs (paginated)
    public Page<GroupBlogDTO> getGroupBlogsPaginated(Long groupId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<GroupBlog> blogs = blogRepository.findByGroupId(groupId, pageable);
        return blogs.map(this::toBlogDTO);
    }
    
    // Get blog by ID
    public GroupBlogDTO getBlogById(Long blogId) {
        GroupBlog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        return toBlogDTO(blog);
    }
    
    // Get user's blogs
    public List<GroupBlogDTO> getUserBlogs(Long userId) {
        List<GroupBlog> blogs = blogRepository.findByAuthorId(userId);
        return blogs.stream()
                .map(this::toBlogDTO)
                .collect(Collectors.toList());
    }
    
    // Update blog (only author can update)
    @Transactional
    public GroupBlogDTO updateBlog(Long blogId, Long userId, CreateBlogRequest request) {
        GroupBlog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        // Check if user is the author
        if (!blog.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Only the blog author can update this blog");
        }
        
        // Update blog
        blog.setTitle(request.getTitle());
        blog.setContent(request.getContent());
        blog.setImageUrl(request.getImageUrl());
        
        GroupBlog updatedBlog = blogRepository.save(blog);
        return toBlogDTO(updatedBlog);
    }
    
    // Delete blog (only author can delete)
    @Transactional
    public void deleteBlog(Long blogId, Long userId) {
        GroupBlog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        
        // Check if user is the author
        if (!blog.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Only the blog author can delete this blog");
        }
        
        blogRepository.delete(blog);
    }
    
    // Search blogs by title
    public List<GroupBlogDTO> searchBlogs(Long groupId, String keyword) {
        List<GroupBlog> blogs = blogRepository.searchByTitle(groupId, keyword);
        return blogs.stream()
                .map(this::toBlogDTO)
                .collect(Collectors.toList());
    }
    
    // ==================== HELPER METHODS ====================
    
    private GroupBlogDTO toBlogDTO(GroupBlog blog) {
        GroupBlogDTO dto = new GroupBlogDTO();
        dto.setId(blog.getId());
        dto.setGroupId(blog.getGroup().getId());
        dto.setGroupName(blog.getGroup().getName());
        dto.setAuthorId(blog.getAuthor().getId());
        dto.setAuthorName(blog.getAuthor().getName());
        dto.setAuthorAvatar(blog.getAuthor().getAvatarUrl());
        dto.setTitle(blog.getTitle());
        dto.setContent(blog.getContent());
        dto.setImageUrl(blog.getImageUrl());
        dto.setCreatedAt(blog.getCreatedAt());
        dto.setUpdatedAt(blog.getUpdatedAt());
        return dto;
    }
}
