package com.proje.maps.service;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.stereotype.Service;

// @Service
public class RegisterUserService {
    

    private JdbcTemplate jdbcTemplate;
    private  BCryptPasswordEncoder encoder;


    public RegisterUserService(JdbcTemplate jdbcTemplate, BCryptPasswordEncoder encoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.encoder = encoder;
    }

    @Bean
    public UserDetailsService registerUser(String username, String password, DataSource dataSource) {

        JdbcUserDetailsManager userManager = new JdbcUserDetailsManager(dataSource);

        if(!userManager.userExists(username)) {

            var admin = User.withUsername(username)
                .password(password)
                .passwordEncoder(str -> encoder.encode(str))
                .roles("USER")
                .build();
            userManager.createUser(admin);
        }

        return userManager;
    }

    
}
