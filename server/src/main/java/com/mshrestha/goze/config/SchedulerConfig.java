package com.mshrestha.goze.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration class to enable Spring's scheduling capabilities.
 * This allows the use of @Scheduled annotations for periodic tasks.
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Configuration is handled by @EnableScheduling annotation
    // Additional scheduler configuration can be added here if needed
}