package com.leetcodeanalytics.repository;

import com.leetcodeanalytics.domain.Note;
import com.leetcodeanalytics.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
  Page<Note> findByUserAndTitleContainingIgnoreCase(User user, String title, Pageable pageable);
}
