package com.leetcodeanalytics.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "problems")
public class Problem extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false, length = 180)
  private String name;

  @Column(nullable = false, length = 500)
  private String leetcodeUrl;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Difficulty difficulty;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private ProblemStatus status = ProblemStatus.UNSOLVED;

  private LocalDate dateSolved;

  @ElementCollection
  @CollectionTable(name = "problem_tags", joinColumns = @JoinColumn(name = "problem_id"))
  @Column(name = "tag", length = 80)
  private Set<String> tags = new HashSet<>();

  @ElementCollection
  @CollectionTable(name = "problem_companies", joinColumns = @JoinColumn(name = "problem_id"))
  @Column(name = "company", length = 80)
  private Set<String> companies = new HashSet<>();

  @Lob
  private String notes;
}
