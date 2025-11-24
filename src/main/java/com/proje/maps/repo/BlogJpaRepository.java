package com.proje.maps.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.proje.maps.resource.Blog;
import com.proje.maps.resource.User;

public interface BlogJpaRepository extends JpaRepository<Blog, Integer>{
    
    public List<Blog> findByUser(User user);
}
