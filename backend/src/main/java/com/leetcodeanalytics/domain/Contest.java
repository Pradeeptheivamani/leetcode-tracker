package com.leetcodeanalytics.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "contests")
public class Contest extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false, length = 160)
  private String contestName;

  @Column(nullable = false)
  private LocalDate contestDate;

  private Integer rankValue;
  private Integer rating;
}
