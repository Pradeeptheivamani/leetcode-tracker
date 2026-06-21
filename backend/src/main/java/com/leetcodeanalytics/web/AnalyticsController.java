package com.leetcodeanalytics.web;

import com.leetcodeanalytics.dto.AnalyticsDtos.AiHintRequest;
import com.leetcodeanalytics.dto.AnalyticsDtos.AiHintResponse;
import com.leetcodeanalytics.dto.AnalyticsDtos.BulkExportRequest;
import com.leetcodeanalytics.dto.AnalyticsDtos.BulkExportSummary;
import com.leetcodeanalytics.dto.AnalyticsDtos.DashboardStats;
import com.leetcodeanalytics.service.AnalyticsService;
import com.leetcodeanalytics.service.CurrentUserService;
import com.leetcodeanalytics.service.LeetCodeExportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AnalyticsController {
  private final AnalyticsService analytics;
  private final CurrentUserService currentUser;
  private final LeetCodeExportService exports;

  public AnalyticsController(AnalyticsService analytics, CurrentUserService currentUser, LeetCodeExportService exports) {
    this.analytics = analytics;
    this.currentUser = currentUser;
    this.exports = exports;
  }

  @GetMapping("/dashboard")
  DashboardStats dashboard() {
    return analytics.dashboard(currentUser.get());
  }

  @PostMapping("/ai/hints")
  AiHintResponse hints(@RequestBody AiHintRequest request) {
    return analytics.hints(request.problemStatement());
  }

  @PostMapping("/exports/bulk-summary")
  BulkExportSummary bulk(@RequestBody BulkExportRequest request) {
    return exports.summarize(request.usernames());
  }
}
