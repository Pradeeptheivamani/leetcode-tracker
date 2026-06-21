package com.leetcodeanalytics.web;

import com.leetcodeanalytics.repository.UserRepository;
import com.leetcodeanalytics.service.AuthService;
import com.leetcodeanalytics.service.CurrentUserService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/friends")
public class FriendController {
  private final CurrentUserService currentUser;
  private final UserRepository users;
  private final AuthService auth;

  public FriendController(CurrentUserService currentUser, UserRepository users, AuthService auth) {
    this.currentUser = currentUser;
    this.users = users;
    this.auth = auth;
  }

  public record FriendRequest(String username) {}

  @PostMapping
  Object add(@RequestBody FriendRequest request) {
    var user = currentUser.get();
    user.getTrackedUsers().add(request.username());
    return auth.toResponse(users.save(user));
  }

  @DeleteMapping("/{username}")
  Object remove(@PathVariable String username) {
    var user = currentUser.get();
    user.getTrackedUsers().remove(username);
    return auth.toResponse(users.save(user));
  }
}
