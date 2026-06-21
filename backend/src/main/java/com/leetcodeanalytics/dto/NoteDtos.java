package com.leetcodeanalytics.dto;

import com.leetcodeanalytics.domain.NoteCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class NoteDtos {
  private NoteDtos() {}

  public record NoteRequest(@NotBlank String title, @NotNull NoteCategory category, @NotBlank String contentHtml) {}
  public record NoteResponse(Long id, String title, NoteCategory category, String contentHtml) {}
}
