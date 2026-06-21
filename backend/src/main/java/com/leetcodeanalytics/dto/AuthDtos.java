package com.leetcodeanalytics.dto;

import com.leetcodeanalytics.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

public final class AuthDtos {
  private AuthDtos() {}

  public record RegisterRequest(
      @NotBlank @Size(min = 3, max = 80) String username,
      @NotBlank @Email String email,
      @NotBlank @Size(min = 8, max = 120) String password) {}

  public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

  public record UserResponse(
      Long id,
      String username,
      String email,
      String leetcodeUsername,
      Role role,
      int currentStreak,
      int longestStreak,
      Set<String> trackedUsers) {}

  public record AuthResponse(String token, UserResponse user) {}

  public record ProfileUpdateRequest(String username, String leetcodeUsername) {}

  public record PasswordUpdateRequest(@NotBlank String currentPassword, @NotBlank @Size(min = 8) String newPassword) {}
}
