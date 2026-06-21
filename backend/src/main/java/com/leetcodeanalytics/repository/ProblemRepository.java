package com.leetcodeanalytics.repository;

import com.leetcodeanalytics.domain.Problem;
import com.leetcodeanalytics.domain.ProblemStatus;
import com.leetcodeanalytics.domain.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
  Page<Problem> findByUserAndNameContainingIgnoreCase(User user, String name, Pageable pageable);
  List<Problem> findByUser(User user);
  long countByUserAndStatus(User user, ProblemStatus status);

  @Query("select p from Problem p where p.user = :user and (:q = '' or lower(p.name) like lower(concat('%', :q, '%')))")
  Page<Problem> search(@Param("user") User user, @Param("q") String query, Pageable pageable);
}
