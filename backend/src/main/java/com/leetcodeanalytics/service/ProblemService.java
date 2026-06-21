package com.leetcodeanalytics.service;

import com.leetcodeanalytics.domain.Problem;
import com.leetcodeanalytics.domain.ProblemStatus;
import com.leetcodeanalytics.domain.User;
import com.leetcodeanalytics.dto.ProblemDtos.ProblemRequest;
import com.leetcodeanalytics.dto.ProblemDtos.ProblemResponse;
import com.leetcodeanalytics.repository.ProblemRepository;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProblemService {
  private final ProblemRepository problems;

  public ProblemService(ProblemRepository problems) {
    this.problems = problems;
  }

  public Page<ProblemResponse> search(User user, String query, Pageable pageable) {
    return problems.search(user, query == null ? "" : query, pageable).map(this::toResponse);
  }

  public ProblemResponse create(User user, ProblemRequest request) {
    Problem problem = new Problem();
    problem.setUser(user);
    apply(problem, request);
    updateStreak(user, request);
    return toResponse(problems.save(problem));
  }

  public ProblemResponse update(User user, Long id, ProblemRequest request) {
    Problem problem = problems.findById(id).filter(p -> p.getUser().getId().equals(user.getId()))
        .orElseThrow(() -> new IllegalArgumentException("Problem not found"));
    apply(problem, request);
    return toResponse(problems.save(problem));
  }

  public void delete(User user, Long id) {
    Problem problem = problems.findById(id).filter(p -> p.getUser().getId().equals(user.getId()))
        .orElseThrow(() -> new IllegalArgumentException("Problem not found"));
    problems.delete(problem);
  }

  private void apply(Problem problem, ProblemRequest request) {
    problem.setName(request.name());
    problem.setLeetcodeUrl(request.leetcodeUrl());
    problem.setDifficulty(request.difficulty());
    problem.setStatus(request.status());
    problem.setDateSolved(request.dateSolved());
    problem.setNotes(request.notes());
    problem.setTags(request.tags() == null ? java.util.Set.of() : request.tags());
    problem.setCompanies(request.companies() == null ? java.util.Set.of() : request.companies());
  }

  private void updateStreak(User user, ProblemRequest request) {
    if (request.status() != ProblemStatus.SOLVED || request.dateSolved() == null) return;
    LocalDate solved = request.dateSolved();
    if (user.getLastSolvedDate() == null || ChronoUnit.DAYS.between(user.getLastSolvedDate(), solved) == 1) {
      user.setCurrentStreak(user.getCurrentStreak() + 1);
    } else if (!solved.equals(user.getLastSolvedDate())) {
      user.setCurrentStreak(1);
    }
    user.setLongestStreak(Math.max(user.getLongestStreak(), user.getCurrentStreak()));
    user.setLastSolvedDate(solved);
  }

  public ProblemResponse toResponse(Problem p) {
    return new ProblemResponse(p.getId(), p.getName(), p.getLeetcodeUrl(), p.getDifficulty(), p.getTags(),
        p.getCompanies(), p.getDateSolved(), p.getStatus(), p.getNotes());
  }
}
