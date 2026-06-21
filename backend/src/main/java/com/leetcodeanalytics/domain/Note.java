package com.leetcodeanalytics.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "notes")
public class Note extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false, length = 180)
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 40)
  private NoteCategory category;

  @Lob
  @Column(nullable = false)
  private String contentHtml;
}
