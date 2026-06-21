package com.leetcodeanalytics.service;

import com.leetcodeanalytics.domain.Difficulty;
import com.leetcodeanalytics.domain.ProblemStatus;
import com.leetcodeanalytics.domain.User;
import com.leetcodeanalytics.dto.AnalyticsDtos.AiHintResponse;
import com.leetcodeanalytics.dto.AnalyticsDtos.ChartPoint;
import com.leetcodeanalytics.dto.AnalyticsDtos.DashboardStats;
import com.leetcodeanalytics.repository.ContestRepository;
import com.leetcodeanalytics.repository.ProblemRepository;
import java.time.YearMonth;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
  private static final List<String> TOPICS = List.of("Arrays", "Strings", "Linked List", "Stack", "Queue", "Trees", "Graphs", "Dynamic Programming", "Backtracking");
  private static final List<String> COMPANIES = List.of("Google", "Amazon", "Microsoft", "Meta", "Apple", "TCS", "Infosys", "Wipro");
  private final ProblemRepository problems;
  private final ContestRepository contests;

  public AnalyticsService(ProblemRepository problems, ContestRepository contests) {
    this.problems = problems;
    this.contests = contests;
  }

  public DashboardStats dashboard(User user) {
    var all = problems.findByUser(user);
    long solved = all.stream().filter(p -> p.getStatus() == ProblemStatus.SOLVED).count();
    long easy = all.stream().filter(p -> p.getStatus() == ProblemStatus.SOLVED && p.getDifficulty() == Difficulty.EASY).count();
    long medium = all.stream().filter(p -> p.getStatus() == ProblemStatus.SOLVED && p.getDifficulty() == Difficulty.MEDIUM).count();
    long hard = all.stream().filter(p -> p.getStatus() == ProblemStatus.SOLVED && p.getDifficulty() == Difficulty.HARD).count();
    Map<String, Integer> topics = masteryByTags(user, TOPICS);
    int coverage = (int) topics.values().stream().filter(v -> v >= 50).count() * 100 / TOPICS.size();
    int contestsScore = Math.min(100, contests.findByUserOrderByContestDateAsc(user).size() * 12);
    int score = (int) Math.min(100, solved * 0.35 + coverage * 0.25 + contestsScore * 0.2 + user.getCurrentStreak() * 4);
    return new DashboardStats(
        solved,
        easy,
        medium,
        hard,
        user.getCurrentStreak(),
        score,
        classify(score),
        List.of(new ChartPoint("Mon", 2), new ChartPoint("Tue", 4), new ChartPoint("Wed", 1), new ChartPoint("Thu", 5), new ChartPoint("Fri", 3)),
        monthly(all),
        topics,
        masteryByTags(user, COMPANIES));
  }

  public AiHintResponse hints(String statement) {
    String lower = statement == null ? "" : statement.toLowerCase();
    String pattern = lower.contains("tree") ? "Think recursively about subtrees." :
        lower.contains("graph") ? "Model states as nodes and transitions as edges." :
        lower.contains("substring") ? "A sliding window may help maintain a valid range." :
        lower.contains("minimum") || lower.contains("maximum") ? "Identify what optimal substructure or ordering can be reused." :
        "Start by restating inputs, outputs, constraints, and edge cases.";
    return new AiHintResponse(
        pattern,
        "Look for the brute force state first, then name the repeated work or invariant.",
        "Choose the data structure that lets you update that invariant in constant or logarithmic time.",
        "Write pseudocode for only the decision points. Stop before converting it into a full solution.");
  }

  private Map<String, Integer> masteryByTags(User user, List<String> labels) {
    var all = problems.findByUser(user);
    Map<String, Integer> result = new LinkedHashMap<>();
    for (String label : labels) {
      long total = all.stream().filter(p -> p.getTags().contains(label) || p.getCompanies().contains(label)).count();
      long solved = all.stream().filter(p -> p.getStatus() == ProblemStatus.SOLVED && (p.getTags().contains(label) || p.getCompanies().contains(label))).count();
      result.put(label, total == 0 ? 0 : (int) (solved * 100 / total));
    }
    return result;
  }

  private List<ChartPoint> monthly(List<com.leetcodeanalytics.domain.Problem> all) {
    return all.stream()
        .filter(p -> p.getDateSolved() != null && p.getStatus() == ProblemStatus.SOLVED)
        .collect(Collectors.groupingBy(p -> YearMonth.from(p.getDateSolved()).toString(), LinkedHashMap::new, Collectors.counting()))
        .entrySet().stream()
        .map(e -> new ChartPoint(e.getKey(), e.getValue()))
        .toList();
  }

  private String classify(int score) {
    if (score <= 40) return "Beginner";
    if (score <= 60) return "Intermediate";
    if (score <= 80) return "Interview Ready";
    return "FAANG Ready";
  }
}
