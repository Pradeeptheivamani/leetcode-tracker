package com.leetcodeanalytics.repository;

import com.leetcodeanalytics.domain.BulkExportJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BulkExportJobRepository extends JpaRepository<BulkExportJob, Long> {
}
