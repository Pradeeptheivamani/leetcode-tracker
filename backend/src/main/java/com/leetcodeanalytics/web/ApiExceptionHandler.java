package com.leetcodeanalytics.web;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
  ResponseEntity<?> badRequest(RuntimeException ex) {
    return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<?> validation(MethodArgumentNotValidException ex) {
    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(Map.of("message", "Validation failed"));
  }
}
