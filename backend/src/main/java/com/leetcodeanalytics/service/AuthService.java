package com.leetcodeanalytics.service;

import com.leetcodeanalytics.domain.User;
import com.leetcodeanalytics.dto.AuthDtos.AuthResponse;
import com.leetcodeanalytics.dto.AuthDtos.LoginRequest;
import com.leetcodeanalytics.dto.AuthDtos.PasswordUpdateRequest;
import com.leetcodeanalytics.dto.AuthDtos.ProfileUpdateRequest;
import com.leetcodeanalytics.dto.AuthDtos.RegisterRequest;
import com.leetcodeanalytics.dto.AuthDtos.UserResponse;
import com.leetcodeanalytics.repository.UserRepository;
import com.leetcodeanalytics.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;
  private final AuthenticationManager authManager;

  public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt, AuthenticationManager authManager) {
    this.users = users;
    this.encoder = encoder;
    this.jwt = jwt;
    this.authManager = authManager;
  }

  public AuthResponse register(RegisterRequest request) {
    if (users.existsByEmail(request.email())) throw new IllegalArgumentException("Email already registered");
    if (users.existsByUsername(request.username())) throw new IllegalArgumentException("Username already taken");
    User user = new User();
    user.setUsername(request.username());
    user.setEmail(request.email());
    user.setPasswordHash(encoder.encode(request.password()));
    users.save(user);
    return new AuthResponse(jwt.generate(user.getEmail()), toResponse(user));
  }

  public AuthResponse login(LoginRequest request) {
    authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
    User user = users.findByEmail(request.email()).orElseThrow();
    return new AuthResponse(jwt.generate(user.getEmail()), toResponse(user));
  }

  public UserResponse updateProfile(User user, ProfileUpdateRequest request) {
    if (request.username() != null && !request.username().isBlank()) user.setUsername(request.username());
    if (request.leetcodeUsername() != null) user.setLeetcodeUsername(request.leetcodeUsername().isBlank() ? null : request.leetcodeUsername());
    return toResponse(users.save(user));
  }

  public void updatePassword(User user, PasswordUpdateRequest request) {
    if (!encoder.matches(request.currentPassword(), user.getPasswordHash())) {
      throw new IllegalArgumentException("Current password is incorrect");
    }
    user.setPasswordHash(encoder.encode(request.newPassword()));
    users.save(user);
  }

  public UserResponse toResponse(User user) {
    return new UserResponse(
        user.getId(),
        user.getUsername(),
        user.getEmail(),
        user.getLeetcodeUsername(),
        user.getRole(),
        user.getCurrentStreak(),
        user.getLongestStreak(),
        user.getTrackedUsers());
  }
}
