package com.leetcodeanalytics.web;

import com.leetcodeanalytics.domain.Contest;
import com.leetcodeanalytics.dto.ContestDtos.ContestRequest;
import com.leetcodeanalytics.dto.ContestDtos.ContestResponse;
import com.leetcodeanalytics.repository.ContestRepository;
import com.leetcodeanalytics.service.CurrentUserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contests")
public class ContestController {
  private final ContestRepository contests;
  private final CurrentUserService currentUser;

  public ContestController(ContestRepository contests, CurrentUserService currentUser) {
    this.contests = contests;
    this.currentUser = currentUser;
  }

  @GetMapping
  List<ContestResponse> list() {
    return contests.findByUserOrderByContestDateAsc(currentUser.get()).stream().map(this::toResponse).toList();
  }

  @PostMapping
  ContestResponse create(@Valid @RequestBody ContestRequest request) {
    Contest contest = new Contest();
    contest.setUser(currentUser.get());
    apply(contest, request);
    return toResponse(contests.save(contest));
  }

  @PutMapping("/{id}")
  ContestResponse update(@PathVariable Long id, @Valid @RequestBody ContestRequest request) {
    var user = currentUser.get();
    Contest contest = contests.findById(id).filter(c -> c.getUser().getId().equals(user.getId()))
        .orElseThrow(() -> new IllegalArgumentException("Contest not found"));
    apply(contest, request);
    return toResponse(contests.save(contest));
  }

  @DeleteMapping("/{id}")
  void delete(@PathVariable Long id) {
    var user = currentUser.get();
    Contest contest = contests.findById(id).filter(c -> c.getUser().getId().equals(user.getId()))
        .orElseThrow(() -> new IllegalArgumentException("Contest not found"));
    contests.delete(contest);
  }

  private void apply(Contest contest, ContestRequest request) {
    contest.setContestName(request.contestName());
    contest.setContestDate(request.contestDate());
    contest.setRankValue(request.rankValue());
    contest.setRating(request.rating());
  }

  private ContestResponse toResponse(Contest contest) {
    return new ContestResponse(contest.getId(), contest.getContestName(), contest.getContestDate(), contest.getRankValue(), contest.getRating());
  }
}
