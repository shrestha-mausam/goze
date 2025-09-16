package com.mshrestha.goze.utils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;

/**
 * Utility service for JSON serialization and deserialization using Google Gson.
 * 
 * This service provides convenient methods for converting between Java objects and JSON strings
 * using the configured Gson instance.
 */
@Component
public class GsonUtility {

    @Autowired
    private Gson gson;

    /**
     * Serializes an object to JSON string.
     * 
     * @param object The object to serialize
     * @return JSON string representation of the object
     */
    public String toJson(Object object) {
        if (object == null) {
            return null;
        }
        return gson.toJson(object);
    }

    /**
     * Serializes an object to JSON string with pretty printing.
     * 
     * @param object The object to serialize
     * @return Pretty-printed JSON string representation of the object
     */
    public String toPrettyJson(Object object) {
        if (object == null) {
            return null;
        }
        Gson prettyGson = new GsonBuilder()
                .setPrettyPrinting()
                .serializeNulls()
                .create();
        return prettyGson.toJson(object);
    }

    /**
     * Deserializes JSON string to an object of the specified class.
     * 
     * @param json The JSON string to deserialize
     * @param classOfT The class of the object to deserialize to
     * @param <T> The type of the object
     * @return Deserialized object
     * @throws JsonSyntaxException if the JSON string is malformed
     */
    public <T> T fromJson(String json, Class<T> classOfT) throws JsonSyntaxException {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        return gson.fromJson(json, classOfT);
    }

    /**
     * Deserializes JSON string to an object of the specified type.
     * 
     * @param json The JSON string to deserialize
     * @param typeOfT The type of the object to deserialize to
     * @param <T> The type of the object
     * @return Deserialized object
     * @throws JsonSyntaxException if the JSON string is malformed
     */
    public <T> T fromJson(String json, Type typeOfT) throws JsonSyntaxException {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        return gson.fromJson(json, typeOfT);
    }

    /**
     * Safely deserializes JSON string to an object, returning null if parsing fails.
     * 
     * @param json The JSON string to deserialize
     * @param classOfT The class of the object to deserialize to
     * @param <T> The type of the object
     * @return Deserialized object or null if parsing fails
     */
    public <T> T fromJsonSafe(String json, Class<T> classOfT) {
        try {
            return fromJson(json, classOfT);
        } catch (JsonSyntaxException e) {
            return null;
        }
    }

    /**
     * Safely deserializes JSON string to an object, returning null if parsing fails.
     * 
     * @param json The JSON string to deserialize
     * @param typeOfT The type of the object to deserialize to
     * @param <T> The type of the object
     * @return Deserialized object or null if parsing fails
     */
    public <T> T fromJsonSafe(String json, Type typeOfT) {
        try {
            return fromJson(json, typeOfT);
        } catch (JsonSyntaxException e) {
            return null;
        }
    }

    /**
     * Gets the configured Gson instance.
     * 
     * @return The configured Gson instance
     */
    public Gson getGson() {
        return gson;
    }
}