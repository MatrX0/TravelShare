package com.proje.maps.util;

import com.proje.maps.exception.BadRequestException;

import java.util.regex.Pattern;

/**
 * Utility class for common validation operations
 */
public class ValidationUtil {
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );
    
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$"
    );
    
    /**
     * Validate email format
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Validate password strength
     * Must contain: 1 digit, 1 lowercase, 1 uppercase, 1 special char, min 8 chars
     */
    public static boolean isStrongPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }
    
    /**
     * Validate string is not null or empty
     */
    public static boolean isNotEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }
    
    /**
     * Validate string length
     */
    public static boolean isValidLength(String str, int min, int max) {
        if (str == null) return false;
        int length = str.length();
        return length >= min && length <= max;
    }
    
    /**
     * Validate positive number
     */
    public static boolean isPositive(Long number) {
        return number != null && number > 0;
    }
    
    /**
     * Require non-null object
     */
    public static <T> T requireNonNull(T obj, String message) {
        if (obj == null) {
            throw new BadRequestException(message);
        }
        return obj;
    }
    
    /**
     * Require valid email
     */
    public static String requireValidEmail(String email) {
        if (!isValidEmail(email)) {
            throw new BadRequestException("Invalid email format");
        }
        return email;
    }
    
    /**
     * Require strong password
     */
    public static String requireStrongPassword(String password) {
        if (!isStrongPassword(password)) {
            throw new BadRequestException(
                "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
            );
        }
        return password;
    }
    
    /**
     * Sanitize string input (remove potential XSS)
     */
    public static String sanitize(String input) {
        if (input == null) return null;
        
        return input
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");
    }
}
