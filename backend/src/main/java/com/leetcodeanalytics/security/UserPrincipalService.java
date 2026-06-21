package com.leetcodeanalytics.security;

import com.leetcodeanalytics.repository.UserRepository;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserPrincipalService implements UserDetailsService {
  private final UserRepository users;

  public UserPrincipalService(UserRepository users) {
    this.users = users;
  }

  @Override
  public UserDetails loadUserByUsername(String email) {
    var user = users.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return new org.springframework.security.core.userdetails.User(
        user.getEmail(),
        user.getPasswordHash(),
        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
  }
}
