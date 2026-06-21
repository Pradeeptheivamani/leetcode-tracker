package com.leetcodeanalytics.web;

import com.leetcodeanalytics.dto.ProblemDtos.ProblemRequest;
import com.leetcodeanalytics.dto.ProblemDtos.ProblemResponse;
import com.leetcodeanalytics.service.CurrentUserService;
import com.leetcodeanalytics.service.ProblemService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {
  private final ProblemService problems;
  private final CurrentUserService currentUser;

  public ProblemController(ProblemService problems, CurrentUserService currentUser) {
    this.problems = problems;
    this.currentUser = currentUser;
  }

  @GetMapping
  Page<ProblemResponse> list(@RequestParam(defaultValue = "") String q, Pageable pageable) {
    return problems.search(currentUser.get(), q, pageable);
  }

  @PostMapping
  ProblemResponse create(@Valid @RequestBody ProblemRequest request) {
    return problems.create(currentUser.get(), request);
  }

  @PutMapping("/{id}")
  ProblemResponse update(@PathVariable Long id, @Valid @RequestBody ProblemRequest request) {
    return problems.update(currentUser.get(), id, request);
  }

  @DeleteMapping("/{id}")
  void delete(@PathVariable Long id) {
    problems.delete(currentUser.get(), id);
  }
}
