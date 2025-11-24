package com.proje.maps.api;

import java.time.LocalDateTime;
import java.util.List;

import javax.sql.DataSource;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import com.proje.maps.repo.BlogJpaRepository;
import com.proje.maps.repo.CommentJpaRepository;
import com.proje.maps.repo.UserJpaRepository;
import com.proje.maps.resource.Blog;
import com.proje.maps.resource.User;
import com.proje.maps.resource.Comment;






@Controller
public class CommentController {
    
    private UserJpaRepository userRepo;
    private CommentJpaRepository commentRepo;
    private BlogJpaRepository blogRepo;
    

    public CommentController(UserJpaRepository userRepo, CommentJpaRepository commentRepo, BlogJpaRepository blogRepo) {
        this.userRepo = userRepo;
        this.commentRepo = commentRepo;
        this.blogRepo = blogRepo;
    }




    @PostMapping("/postComment/{blogId}/{username}")
    public void postMethodName(@PathVariable Integer blogId, @PathVariable String username, @RequestBody Comment comment) throws NoResourceFoundException {
        
        
        Blog blog = blogRepo.findById(blogId).orElseThrow();
        User user = userRepo.findByEmail(username).orElseThrow();
      
        comment.setId(null);
        comment.setBlog(blog);
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        commentRepo.save(comment);

        // works but throws a 404 and i cant see the comments on blogs from blogs    
    }

    @GetMapping("/getComments/{blogId}")
    public List<Comment> getComments(@PathVariable Integer blogId) {
        Blog blog = blogRepo.findById(blogId).orElseThrow();
        return commentRepo.findByBlog(blog);
    }

    // @GetMapping("/getComment/{username}")
    // public List<Comment> getComments(@RequestParam String username) {
        
    //     User user = userRepo.findByUsername(username).orElse(null);

    //     if(user!=null) {

    //         List<Blog> blogs = blogRepo.findByUser(user);
    //         Comment comment;

    //         for(Blog bb: blogs) {

    //             comment =  commentRepo.findByBlog(bb);

    //         }
    //         List<Comment> comments =


    //     }
    // }
    
    
}
