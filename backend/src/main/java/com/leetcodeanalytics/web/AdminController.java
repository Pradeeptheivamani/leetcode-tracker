package com.leetcodeanalytics.web;

import com.leetcodeanalytics.repository.ProblemRepository;
import com.leetcodeanalytics.repository.UserRepository;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final UserRepository users;
  private final ProblemRepository problems;

  public AdminController(UserRepository users, ProblemRepository problems) {
    this.users = users;
    this.problems = problems;
  }

  @GetMapping("/analytics")
  Map<String, Object> analytics() {
    return Map.of(
        "totalUsers", users.count(),
        "activeUsers", users.count(),
        "trackedProblems", problems.count(),
        "exportsGenerated", 0);
  }
}
