package com.digitalshelf.authservice.repository;

import com.digitalshelf.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByUserEmail(String userEmail);
    Optional<User> findByUserEmail(String userEmail);  // <-- add this line
}