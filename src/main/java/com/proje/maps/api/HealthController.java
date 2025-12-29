package com.proje.maps.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
public class HealthController {
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "TravelShare API");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}
