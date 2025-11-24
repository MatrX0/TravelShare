package com.proje.maps.api;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.proje.maps.repo.BlogJpaRepository;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.Blog;
import com.proje.maps.resource.User;
import com.proje.maps.service.GoogleMapsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/google")
public class GoogleApi {

    private GoogleMapsService service;
    private BlogJpaRepository blogRepo;
    private UserJpaRepository userRepo;


    public GoogleApi(GoogleMapsService service, BlogJpaRepository blogRepo, UserJpaRepository userRepo) {
        this.service = service;
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/distance/{origins}/{destinations}")
    public String getDistance(@PathVariable String origins, @PathVariable String destinations) {
        return service.getDistanceMatrix(origins, destinations);
    }

    @GetMapping("/direction/{origins}/{destination}")
    public String getDirections(@PathVariable String origins, @PathVariable String destination) {
        return service.getDirections(origins,  destination);
    }

    @GetMapping("/details/{placeId}") 
    public String getDetails(@PathVariable String placeId) {
        return service.getPlaceDetails(placeId);
    }

    @GetMapping("/recommendations/{address}/{radius}/{type}")
    public String getRecommends( @PathVariable String address, @PathVariable int radius, @PathVariable String type) {
        
        String location = getCoordinates(address);
        return service.searchNearby(location, radius,type);
    }
    
    @GetMapping("/geo/{address}")
    public String getCoordinates(@PathVariable String address) {

        String json = service.geocodeAddress(address); 
        try {
            JSONObject obj = new JSONObject(json);
            JSONArray results = obj.getJSONArray("results");
            if (results.length() > 0) {
                JSONObject location = results.getJSONObject(0)
                                            .getJSONObject("geometry")
                                            .getJSONObject("location");
                double lat = location.getDouble("lat");
                double lng = location.getDouble("lng");
                return lat + "," + lng;
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("/postBlog/{username}/{address}")
    public void postBlog(@PathVariable String username, @PathVariable String address, @RequestBody Blog blog) {

        User user = userRepo.findByEmail(username).orElse(null);
        if(user != null) {

            String coordinate = getCoordinates(address);

            blog.setId(null);
            blog.setUser(user);
            blog.setCoordinate(coordinate);
            blogRepo.save(blog);
        }
    }


    // connect the blogs with locations Map<Coordinates, List<Blogs>>
    // create another service to connect the getmapping json to blogs variables

    // merge the 2 users
}
