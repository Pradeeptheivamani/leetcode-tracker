package com.leetcodeanalytics.service;

import com.leetcodeanalytics.dto.AnalyticsDtos.BulkExportSummary;
import com.leetcodeanalytics.dto.AnalyticsDtos.LeetCodeUserStats;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class LeetCodeExportService {
  public BulkExportSummary summarize(List<String> usernames) {
    List<LeetCodeUserStats> users = usernames.stream()
        .filter(name -> name != null && !name.isBlank())
        .map(name -> new LeetCodeUserStats(name.trim(), 0, 0, 0, 0, 0, 0))
        .toList();
    int teamSolved = users.stream().mapToInt(LeetCodeUserStats::totalSolved).sum();
    String top = users.stream().max(Comparator.comparingInt(LeetCodeUserStats::totalSolved)).map(LeetCodeUserStats::username).orElse("N/A");
    double average = users.isEmpty() ? 0 : (double) teamSolved / users.size();
    return new BulkExportSummary(users, top, average, teamSolved, "Coding Club Report");
  }
}
