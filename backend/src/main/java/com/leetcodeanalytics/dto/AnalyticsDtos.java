package com.leetcodeanalytics.dto;

import java.util.List;
import java.util.Map;

public final class AnalyticsDtos {
  private AnalyticsDtos() {}

  public record DashboardStats(
      long totalSolved,
      long easyCount,
      long mediumCount,
      long hardCount,
      int dailyStreak,
      int readinessScore,
      String readinessClass,
      List<ChartPoint> weeklyProgress,
      List<ChartPoint> monthlyProgress,
      Map<String, Integer> topicMastery,
      Map<String, Integer> companyReadiness) {}

  public record ChartPoint(String label, Number value) {}

  public record AiHintRequest(String problemStatement) {}

  public record AiHintResponse(String level1, String level2, String level3, String approachSuggestion) {}

  public record BulkExportRequest(List<String> usernames) {}

  public record LeetCodeUserStats(
      String username,
      int totalSolved,
      int easy,
      int medium,
      int hard,
      int contestRating,
      int streak) {}

  public record BulkExportSummary(
      List<LeetCodeUserStats> users,
      String topPerformer,
      double averageSolvedCount,
      int teamSolvedCount,
      String reportLabel) {}
}
