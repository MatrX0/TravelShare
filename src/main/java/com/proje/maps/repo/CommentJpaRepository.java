package com.proje.maps.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proje.maps.resource.Blog;
import com.proje.maps.resource.Comment;

public interface CommentJpaRepository extends JpaRepository<Comment, Integer>{
    
    public List<Comment> findByBlog(Blog blog);
}
