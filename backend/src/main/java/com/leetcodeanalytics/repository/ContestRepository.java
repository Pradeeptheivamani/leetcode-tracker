package com.leetcodeanalytics.repository;

import com.leetcodeanalytics.domain.Contest;
import com.leetcodeanalytics.domain.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestRepository extends JpaRepository<Contest, Long> {
  List<Contest> findByUserOrderByContestDateAsc(User user);
}
