package com.proje.maps.api;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

/**
 * Wrapper for Spring's UserDetails that adds User ID
 */
public class CustomUserDetails implements UserDetails {
    
    private final UserDetails delegate;
    private final Long id;
    
    /**
     * Constructor that wraps Spring's default UserDetails and adds ID
     */
    public CustomUserDetails(UserDetails userDetails, Long userId) {
        this.delegate = userDetails;
        this.id = userId;
    }
    
    // Custom getter for User ID
    public Long getId() {
        return id;
    }
    
    // Delegate all UserDetails methods to the wrapped object
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return delegate.getAuthorities();
    }
    
    @Override
    public String getPassword() {
        return delegate.getPassword();
    }
    
    @Override
    public String getUsername() {
        return delegate.getUsername();
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return delegate.isAccountNonExpired();
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return delegate.isAccountNonLocked();
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return delegate.isCredentialsNonExpired();
    }
    
    @Override
    public boolean isEnabled() {
        return delegate.isEnabled();
    }
}