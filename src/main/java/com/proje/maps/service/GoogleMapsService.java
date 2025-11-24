package com.proje.maps.service;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GoogleMapsService {
    
    private final GoogleMapsConfig config;
    private RestTemplate restTemplate = new RestTemplate();


    public GoogleMapsService(GoogleMapsConfig config) {
        this.config = config;
    }

    public String geocodeAddress(String address) {
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={key}";
    
        return restTemplate.getForObject(url, String.class, address, config.getApiKey());
    }
    
    public String reverseGeocode(double lat, double lng) {
        String url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={key}";
        return restTemplate.getForObject(url, String.class, lat, lng, config.getApiKey());
    }

    public String getDistanceMatrix(String origins, String destinations) {
        String url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins={origins}&destinations={destinations}&key={key}";
        return restTemplate.getForObject(url, String.class, origins, destinations, config.getApiKey());
    }

    // 3️⃣ Directions: Get route from origin -> destination
    public String getDirections(String origin, String destination) {
        
        String url = "https://maps.googleapis.com/maps/api/directions/json?origin={origin}&destination={destination}&key={key}";
        String response =  restTemplate.getForObject(url, String.class, origin, destination, config.getApiKey());

        try {
            JSONObject json = new JSONObject(response);
            JSONArray routes = json.getJSONArray("routes");
            if (routes.length() == 0) {
                return "{\"error\": \"No route found\"}";
            }

            JSONObject route = routes.getJSONObject(0);
            JSONObject leg = route.getJSONArray("legs").getJSONObject(0);

            JSONObject clean = new JSONObject();
            clean.put("distance", leg.getJSONObject("distance").getString("text"));
            clean.put("duration", leg.getJSONObject("duration").getString("text"));
            clean.put("start_address", leg.getString("start_address"));
            clean.put("end_address", leg.getString("end_address"));
            clean.put("start_location", leg.getJSONObject("start_location"));
            clean.put("end_location", leg.getJSONObject("end_location"));
            clean.put("overview_polyline", route.getJSONObject("overview_polyline").getString("points"));

            return clean.toString(2); // 2 = pretty print JSON
        } catch (JSONException e) {
            e.printStackTrace();
            return "{\"error\": \"Failed to parse Directions API response\"}";
        }
    }

    // 5️⃣ Places Nearby Search: Find places around a location
    public String searchNearby(String location, int radius, String type) {
        
        String url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={loc}&radius={rad}&type={type}&key={key}";
        String response =  restTemplate.getForObject(url, String.class, location, radius, type, config.getApiKey());

        JSONObject json = new JSONObject(response);
        JSONArray results = json.getJSONArray("results");

        JSONArray cleanedResults = new JSONArray();

        for (int i = 0; i < results.length(); i++) {
            JSONObject place = results.getJSONObject(i);
            JSONObject clean = new JSONObject();

            clean.put("name", place.optString("name", ""));
            clean.put("place_id", place.optString("place_id", ""));
            clean.put("vicinity", place.optString("vicinity", ""));
            clean.put("rating", place.optDouble("rating", 0));
            clean.put("user_ratings_total", place.optInt("user_ratings_total", 0));
            clean.put("types", place.optJSONArray("types"));

            // Get location
            if (place.has("geometry")) {
                JSONObject loc = place.getJSONObject("geometry").getJSONObject("location");
                clean.put("lat", loc.getDouble("lat"));
                clean.put("lng", loc.getDouble("lng"));
            }

            // Opening hours (if available)
            if (place.has("opening_hours")) {
                clean.put("open_now", place.getJSONObject("opening_hours").optBoolean("open_now"));
            }

            cleanedResults.put(clean);
        }

        JSONObject output = new JSONObject();
        output.put("results", cleanedResults);
        return output.toString(2);

    }

    // 6️⃣ Place Details: Get detailed info about a place by place_id
    public String getPlaceDetails(String placeId) {

        String url = "https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={key}";
        String response = restTemplate.getForObject(url, String.class, placeId, config.getApiKey());


        JSONObject json = new JSONObject(response);
        JSONObject result = json.getJSONObject("result");

        JSONObject clean = new JSONObject();
        clean.put("name", result.optString("name", ""));
        clean.put("address", result.optString("formatted_address", ""));
        clean.put("rating", result.optDouble("rating", 0));
        clean.put("user_ratings_total", result.optInt("user_ratings_total", 0));
        clean.put("phone", result.optString("international_phone_number", ""));
        clean.put("website", result.optString("website", ""));

        // Add coordinates
        if (result.has("geometry")) {
            JSONObject location = result.getJSONObject("geometry").getJSONObject("location");
            clean.put("lat", location.getDouble("lat"));
            clean.put("lng", location.getDouble("lng"));
        }

        // Add opening hours if available
        if (result.has("opening_hours")) {
            clean.put("opening_hours", result.getJSONObject("opening_hours").optJSONArray("weekday_text"));
        }

        return clean.toString(2); // Pretty JSON
    }

    // 7️⃣ Autocomplete: Suggest addresses or places as user types
    public String getAutocomplete(String input, String location, int radius) {
        String url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input={input}&location={loc}&radius={rad}&key={key}";
        return restTemplate.getForObject(url, String.class, input, location, radius, config.getApiKey());
    }
}
