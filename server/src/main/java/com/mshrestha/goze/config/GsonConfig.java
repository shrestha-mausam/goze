package com.mshrestha.goze.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Configuration class for Google Gson JSON serialization/deserialization.
 * 
 * This configuration provides a customized Gson instance with:
 * - Pretty printing for better readability
 * - Custom serializers/deserializers for LocalDateTime
 * - Null handling
 * - Date formatting
 */
@Configuration
public class GsonConfig {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    /**
     * Creates and configures a Gson bean for JSON serialization/deserialization.
     * 
     * @return Configured Gson instance
     */
    @Bean
    @Primary
    public Gson gson() {
        return new GsonBuilder()
                .setPrettyPrinting()
                .serializeNulls()
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeSerializer())
                .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeDeserializer())
                .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .create();
    }

    /**
     * Custom serializer for LocalDateTime objects.
     */
    private static class LocalDateTimeSerializer implements JsonSerializer<LocalDateTime> {
        @Override
        public JsonPrimitive serialize(LocalDateTime localDateTime, java.lang.reflect.Type type, com.google.gson.JsonSerializationContext context) {
            return new JsonPrimitive(localDateTime.format(DATE_TIME_FORMATTER));
        }
    }

    /**
     * Custom deserializer for LocalDateTime objects.
     */
    private static class LocalDateTimeDeserializer implements JsonDeserializer<LocalDateTime> {
        @Override
        public LocalDateTime deserialize(com.google.gson.JsonElement json, java.lang.reflect.Type type, com.google.gson.JsonDeserializationContext context) {
            return LocalDateTime.parse(json.getAsString(), DATE_TIME_FORMATTER);
        }
    }
}