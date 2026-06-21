package com.leetcodeanalytics.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity {
  @Column(nullable = false, unique = true, length = 80)
  private String username;

  @Column(nullable = false, unique = true, length = 160)
  private String email;

  @Column(nullable = false)
  private String passwordHash;

  @Column(length = 80)
  private String leetcodeUsername;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private Role role = Role.USER;

  private int currentStreak;
  private int longestStreak;
  private LocalDate lastSolvedDate;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_friends", joinColumns = @JoinColumn(name = "user_id"))
  @Column(name = "leetcode_username", length = 80)
  private Set<String> trackedUsers = new HashSet<>();
}
