package com.proje.maps.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proje.maps.resource.Message;

public interface MessageJpaRepository extends JpaRepository<Message, Integer>{
    
    


}
