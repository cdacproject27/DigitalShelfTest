package com.digitalshelf.authservice.service;

import com.digitalshelf.authservice.dto.LoginRequest;
import com.digitalshelf.authservice.dto.RegisterRequest;
import com.digitalshelf.authservice.dto.UserResponse;
import com.digitalshelf.authservice.entity.User;
import com.digitalshelf.authservice.repository.UserRepository;
import com.digitalshelf.authservice.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;   // <-- new field, Lombok's constructor picks this up automatically

    public void register(RegisterRequest request) {
        if (userRepository.existsByUserEmail(request.getUserEmail())) {
            throw new RuntimeException("Email already registered.");
        }

        User user = new User();
        user.setUserName(request.getUserName());
        user.setUserEmail(request.getUserEmail());
        user.setUserPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserPhone(request.getUserPhone());
        user.setUserAddress(request.getUserAddress());
        user.setJoinDate(LocalDate.now());
        user.setIsAdmin(false);

        userRepository.save(user);
    }

    // NEW METHOD
    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUserEmail(request.getUserEmail())
                .orElseThrow(() -> new RuntimeException("No account found with that email."));

        if (!passwordEncoder.matches(request.getPassword(), user.getUserPassword())) {
            throw new RuntimeException("Incorrect email or password.");
        }

        String role = Boolean.TRUE.equals(user.getIsAdmin()) ? "ADMIN" : "USER";

        String token = jwtUtil.generateToken(
                user.getUserId(), user.getUserEmail(), user.getUserName(), role);

        return UserResponse.builder()
                .userId(user.getUserId())
                .userName(user.getUserName())
                .userEmail(user.getUserEmail())
                .userPhone(user.getUserPhone())
                .userAddress(user.getUserAddress())
                .token(token)
                .role(role)
                .build();
    }
    
    public java.util.List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> UserResponse.builder()
                        .userId(u.getUserId())
                        .userName(u.getUserName())
                        .userEmail(u.getUserEmail())
                        .userPhone(u.getUserPhone())
                        .userAddress(u.getUserAddress())
                        .build())
                .toList();
    }
}