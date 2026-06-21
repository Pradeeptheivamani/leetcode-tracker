package com.leetcodeanalytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public final class ContestDtos {
  private ContestDtos() {}

  public record ContestRequest(@NotBlank String contestName, @NotNull LocalDate contestDate, Integer rankValue, Integer rating) {}
  public record ContestResponse(Long id, String contestName, LocalDate contestDate, Integer rankValue, Integer rating) {}
}
