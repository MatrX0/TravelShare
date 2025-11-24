package com.proje.maps.repo;

import com.proje.maps.resource.GroupBlog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupBlogRepository extends JpaRepository<GroupBlog, Long> {
    
    // Get all blogs for a group (paginated)
    @Query("SELECT gb FROM GroupBlog gb WHERE gb.group.id = :groupId ORDER BY gb.createdAt DESC")
    Page<GroupBlog> findByGroupId(@Param("groupId") Long groupId, Pageable pageable);
    
    // Get all blogs for a group (list)
    @Query("SELECT gb FROM GroupBlog gb WHERE gb.group.id = :groupId ORDER BY gb.createdAt DESC")
    List<GroupBlog> findByGroupIdOrderByCreatedAtDesc(@Param("groupId") Long groupId);
    
    // Get all blogs by a user
    @Query("SELECT gb FROM GroupBlog gb WHERE gb.author.id = :userId ORDER BY gb.createdAt DESC")
    List<GroupBlog> findByAuthorId(@Param("userId") Long userId);
    
    // Get all blogs by a user in a specific group
    @Query("SELECT gb FROM GroupBlog gb WHERE gb.group.id = :groupId AND gb.author.id = :userId ORDER BY gb.createdAt DESC")
    List<GroupBlog> findByGroupIdAndAuthorId(@Param("groupId") Long groupId, @Param("userId") Long userId);
    
    // Search blogs by title (case-insensitive)
    @Query("SELECT gb FROM GroupBlog gb WHERE gb.group.id = :groupId AND LOWER(gb.title) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY gb.createdAt DESC")
    List<GroupBlog> searchByTitle(@Param("groupId") Long groupId, @Param("keyword") String keyword);
    
    // Get blog count for a group
    @Query("SELECT COUNT(gb) FROM GroupBlog gb WHERE gb.group.id = :groupId")
    Long countByGroupId(@Param("groupId") Long groupId);
    
    // Get blog count for a user
    @Query("SELECT COUNT(gb) FROM GroupBlog gb WHERE gb.author.id = :userId")
    Long countByAuthorId(@Param("userId") Long userId);
    
    // Delete all blogs for a group
    void deleteByGroupId(Long groupId);
}
