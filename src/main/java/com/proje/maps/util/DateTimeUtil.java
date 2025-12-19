package com.proje.maps.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

/**
 * Utility class for date and time operations
 */
public class DateTimeUtil {
    
    private static final DateTimeFormatter DEFAULT_FORMATTER = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    private static final DateTimeFormatter ISO_FORMATTER = 
        DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    
    /**
     * Get current date time
     */
    public static LocalDateTime now() {
        return LocalDateTime.now();
    }
    
    /**
     * Format date time to default format
     */
    public static String format(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DEFAULT_FORMATTER);
    }
    
    /**
     * Format date time to ISO format
     */
    public static String formatISO(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(ISO_FORMATTER);
    }
    
    /**
     * Parse date time from string
     */
    public static LocalDateTime parse(String dateTimeStr) {
        if (dateTimeStr == null) return null;
        return LocalDateTime.parse(dateTimeStr, DEFAULT_FORMATTER);
    }
    
    /**
     * Check if date time is in the past
     */
    public static boolean isPast(LocalDateTime dateTime) {
        return dateTime != null && dateTime.isBefore(LocalDateTime.now());
    }
    
    /**
     * Check if date time is in the future
     */
    public static boolean isFuture(LocalDateTime dateTime) {
        return dateTime != null && dateTime.isAfter(LocalDateTime.now());
    }
    
    /**
     * Calculate difference in minutes
     */
    public static long minutesBetween(LocalDateTime start, LocalDateTime end) {
        return ChronoUnit.MINUTES.between(start, end);
    }
    
    /**
     * Calculate difference in hours
     */
    public static long hoursBetween(LocalDateTime start, LocalDateTime end) {
        return ChronoUnit.HOURS.between(start, end);
    }
    
    /**
     * Calculate difference in days
     */
    public static long daysBetween(LocalDateTime start, LocalDateTime end) {
        return ChronoUnit.DAYS.between(start, end);
    }
    
    /**
     * Get time ago string (e.g., "5 minutes ago", "2 hours ago")
     */
    public static String getTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "Unknown";
        
        LocalDateTime now = LocalDateTime.now();
        long minutes = minutesBetween(dateTime, now);
        
        if (minutes < 1) {
            return "Just now";
        } else if (minutes < 60) {
            return minutes + (minutes == 1 ? " minute ago" : " minutes ago");
        }
        
        long hours = hoursBetween(dateTime, now);
        if (hours < 24) {
            return hours + (hours == 1 ? " hour ago" : " hours ago");
        }
        
        long days = daysBetween(dateTime, now);
        if (days < 7) {
            return days + (days == 1 ? " day ago" : " days ago");
        }
        
        long weeks = days / 7;
        if (weeks < 4) {
            return weeks + (weeks == 1 ? " week ago" : " weeks ago");
        }
        
        long months = days / 30;
        if (months < 12) {
            return months + (months == 1 ? " month ago" : " months ago");
        }
        
        long years = days / 365;
        return years + (years == 1 ? " year ago" : " years ago");
    }
    
    /**
     * Add minutes to date time
     */
    public static LocalDateTime addMinutes(LocalDateTime dateTime, long minutes) {
        return dateTime.plusMinutes(minutes);
    }
    
    /**
     * Add hours to date time
     */
    public static LocalDateTime addHours(LocalDateTime dateTime, long hours) {
        return dateTime.plusHours(hours);
    }
    
    /**
     * Add days to date time
     */
    public static LocalDateTime addDays(LocalDateTime dateTime, long days) {
        return dateTime.plusDays(days);
    }
}
