package com.leetcodeanalytics.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "bulk_export_jobs")
public class BulkExportJob extends BaseEntity {
  @ManyToOne(optional = false)
  @JoinColumn(name = "requested_by")
  private User requestedBy;

  @Column(nullable = false)
  private int usernameCount;

  @Column(nullable = false, length = 20)
  private String status = "COMPLETED";

  @Lob
  private String summaryJson;
}
