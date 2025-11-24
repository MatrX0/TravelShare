package com.proje.maps.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proje.maps.resource.ChatGroup;


public interface ChatGroupJpaRepository extends JpaRepository<ChatGroup, Integer> {
    
}
