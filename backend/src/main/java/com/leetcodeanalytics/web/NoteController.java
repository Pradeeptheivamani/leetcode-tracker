package com.leetcodeanalytics.web;

import com.leetcodeanalytics.domain.Note;
import com.leetcodeanalytics.dto.NoteDtos.NoteRequest;
import com.leetcodeanalytics.dto.NoteDtos.NoteResponse;
import com.leetcodeanalytics.repository.NoteRepository;
import com.leetcodeanalytics.service.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
  private final NoteRepository notes;
  private final CurrentUserService currentUser;

  public NoteController(NoteRepository notes, CurrentUserService currentUser) {
    this.notes = notes;
    this.currentUser = currentUser;
  }

  @GetMapping
  Page<NoteResponse> list(@RequestParam(defaultValue = "") String q, Pageable pageable) {
    return notes.findByUserAndTitleContainingIgnoreCase(currentUser.get(), q, pageable).map(this::toResponse);
  }

  @PostMapping
  NoteResponse create(@Valid @RequestBody NoteRequest request) {
    Note note = new Note();
    note.setUser(currentUser.get());
    apply(note, request);
    return toResponse(notes.save(note));
  }

  @PutMapping("/{id}")
  NoteResponse update(@PathVariable Long id, @Valid @RequestBody NoteRequest request) {
    var user = currentUser.get();
    Note note = notes.findById(id).filter(n -> n.getUser().getId().equals(user.getId()))
        .orElseThrow(() -> new IllegalArgumentException("Note not found"));
    apply(note, request);
    return toResponse(notes.save(note));
  }

  @DeleteMapping("/{id}")
  void delete(@PathVariable Long id) {
    var user = currentUser.get();
    Note note = notes.findById(id).filter(n -> n.getUser().getId().equals(user.getId()))
        .orElseThrow(() -> new IllegalArgumentException("Note not found"));
    notes.delete(note);
  }

  private void apply(Note note, NoteRequest request) {
    note.setTitle(request.title());
    note.setCategory(request.category());
    note.setContentHtml(request.contentHtml());
  }

  private NoteResponse toResponse(Note note) {
    return new NoteResponse(note.getId(), note.getTitle(), note.getCategory(), note.getContentHtml());
  }
}
