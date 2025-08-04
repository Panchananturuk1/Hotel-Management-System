package com.example.hotel_management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        
        // Enable credentials support
        config.setAllowCredentials(true);
        
        // Set specific allowed origins (not patterns) when using credentials
        // S3 website URLs use http, not https
        config.setAllowedOrigins(Arrays.asList(
          "http://localhost:4200",
          "http://localhost:3000",
          "http://localhost:58608",
          "http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com",
          "http://52.66.135.123:8080"
        ));
        
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setExposedHeaders(Arrays.asList("Authorization"));
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOriginPatterns(
                "http://localhost:3000",
                "http://localhost:4200",
                "http://localhost:8080",
                "http://localhost:8081",
                "http://localhost:58608",
                "http://hotel-management-ui.s3-website.ap-south-1.amazonaws.com",
                "http://52.66.135.123:8080"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With")
            .exposedHeaders("Authorization")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
