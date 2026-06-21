package com.leetcodeanalytics.dto;

import com.leetcodeanalytics.domain.Difficulty;
import com.leetcodeanalytics.domain.ProblemStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Set;

public final class ProblemDtos {
  private ProblemDtos() {}

  public record ProblemRequest(
      @NotBlank String name,
      @NotBlank String leetcodeUrl,
      @NotNull Difficulty difficulty,
      Set<String> tags,
      Set<String> companies,
      LocalDate dateSolved,
      @NotNull ProblemStatus status,
      String notes) {}

  public record ProblemResponse(
      Long id,
      String name,
      String leetcodeUrl,
      Difficulty difficulty,
      Set<String> tags,
      Set<String> companies,
      LocalDate dateSolved,
      ProblemStatus status,
      String notes) {}
}
