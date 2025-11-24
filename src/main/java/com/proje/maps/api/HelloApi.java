package com.proje.maps.api;

import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.proje.maps.repo.BlogJpaRepository;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.Blog;
import com.proje.maps.resource.User;

@RestController
public class HelloApi {

    // remove username1's but keep in mind u have to create a user first to be able to see its contents. 

    private BlogJpaRepository blogRepo;
    private UserJpaRepository userRepo;
    
    public HelloApi(BlogJpaRepository blogRepo, UserJpaRepository userRepo) {
        this.blogRepo = blogRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/getUsers")
    public List<User> getUsers() {
    
        return userRepo.findAll();
    }

    @GetMapping("/getUser")
    public User getUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByEmail(username).orElse(null);
    }

    @GetMapping("/getBlogs/{username1}")
    public List<Blog> getBlogs(@PathVariable String username1) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        
        User user = userRepo.findByEmail(username1).orElse(null);
        if(user!=null) {
            return blogRepo.findByUser(user);
        }
        return null;
    }

    @PostMapping("/postUser/{username1}")
    public void postUser(@PathVariable String username1) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        if(userRepo.findByEmail(username).orElse(null) == null) {
            User user = new User();
            user.setId(null);
            user.setName(username);
            user.setBio(null);
            userRepo.save(user);
        }    
    }

    @PostMapping("/postBlog/{username1}")
    public void postBlog(@PathVariable String username1, @RequestBody Blog blog) {
        
        String name = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByEmail(username1).orElse(null);
        if(user != null) {


            blog.setId(null);
            blog.setUser(user);
            blogRepo.save(blog);
        }
    }

    @DeleteMapping("/deleteUser/{id}")
    public void deleteUser(@PathVariable Long id) {

        User user = userRepo.findById(id).orElse(null);
        userRepo.delete(user);
    }

    @DeleteMapping("/deleteBlog/{id}")
    public void deleteBlog(@PathVariable Integer id) {

        Blog blog = blogRepo.findById(id).orElse(null);
        if(blog!=null) {
            blogRepo.delete(blog);
        }    
    }   

        // @PutMapping("/changeID/{username}")
    // public void changeId(@PathVariable String username) {

    //     if(userRepo.findByUsername(username).orElse(null) != null) {
    //         User user = new User();
    //         user.setId(null);
    //         user.setUsername(username);
    //         user.setBlogs(null);
    //         userRepo.save(user);
    //     }    
    // }
}
