package com.leetcodeanalytics.web;

import com.leetcodeanalytics.dto.AuthDtos.AuthResponse;
import com.leetcodeanalytics.dto.AuthDtos.LoginRequest;
import com.leetcodeanalytics.dto.AuthDtos.PasswordUpdateRequest;
import com.leetcodeanalytics.dto.AuthDtos.ProfileUpdateRequest;
import com.leetcodeanalytics.dto.AuthDtos.RegisterRequest;
import com.leetcodeanalytics.dto.AuthDtos.UserResponse;
import com.leetcodeanalytics.service.AuthService;
import com.leetcodeanalytics.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService auth;
  private final CurrentUserService currentUser;

  public AuthController(AuthService auth, CurrentUserService currentUser) {
    this.auth = auth;
    this.currentUser = currentUser;
  }

  @PostMapping("/register")
  AuthResponse register(@Valid @RequestBody RegisterRequest request) {
    return auth.register(request);
  }

  @PostMapping("/login")
  AuthResponse login(@Valid @RequestBody LoginRequest request) {
    return auth.login(request);
  }

  @GetMapping("/me")
  ResponseEntity<?> me() {
    return ResponseEntity.ok(java.util.Map.of("user", auth.toResponse(currentUser.get())));
  }

  @PutMapping("/profile")
  UserResponse profile(@RequestBody ProfileUpdateRequest request) {
    return auth.updateProfile(currentUser.get(), request);
  }

  @PutMapping("/password")
  ResponseEntity<?> password(@Valid @RequestBody PasswordUpdateRequest request) {
    auth.updatePassword(currentUser.get(), request);
    return ResponseEntity.ok(java.util.Map.of("message", "Password updated"));
  }
}
