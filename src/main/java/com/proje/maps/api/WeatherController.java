package com.proje.maps.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://shareway.com.tr", "https://shareway.com.tr", "http://77.245.156.161", "https://77.245.156.161"})
public class WeatherController {
    
    // OpenWeather API Key - Replace with your own key
    private static final String OPENWEATHER_API_KEY = "723f3404a3ac4895e22626a0571de053";
    private static final String OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
    
    private final RestTemplate restTemplate;
    
    public WeatherController() {
        this.restTemplate = new RestTemplate();
    }
    
    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentWeather(
            @RequestParam double lat,
            @RequestParam double lon) {
        
        try {
            String url = String.format(
                "%s?lat=%f&lon=%f&appid=%s&units=metric&lang=en",
                OPENWEATHER_API_URL, lat, lon, OPENWEATHER_API_KEY
            );
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            
            return ResponseEntity.ok(result);
            
        } catch (HttpClientErrorException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to fetch weather data: " + e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(error);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching weather: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/by-city")
    public ResponseEntity<Map<String, Object>> getWeatherByCity(
            @RequestParam String city) {
        
        try {
            String url = String.format(
                "%s?q=%s&appid=%s&units=metric&lang=en",
                OPENWEATHER_API_URL, city, OPENWEATHER_API_KEY
            );
            
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("data", response);
            
            return ResponseEntity.ok(result);
            
        } catch (HttpClientErrorException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "City not found or API error: " + e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body(error);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error fetching weather: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
