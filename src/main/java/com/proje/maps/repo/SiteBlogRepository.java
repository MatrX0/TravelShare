package com.proje.maps.repo;

import com.proje.maps.resource.SiteBlog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteBlogRepository extends JpaRepository<SiteBlog, Long> {
    
    List<SiteBlog> findAllByOrderByCreatedAtDesc();
    
    List<SiteBlog> findByCategoryOrderByCreatedAtDesc(String category);
    
    List<SiteBlog> findByAuthorIdOrderByCreatedAtDesc(Long authorId);
}
