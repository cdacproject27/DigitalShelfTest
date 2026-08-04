package com.digitalshelf.authservice.controller;

import com.digitalshelf.authservice.dto.LoginRequest;
import com.digitalshelf.authservice.dto.RegisterRequest;
import com.digitalshelf.authservice.dto.UserResponse;
import com.digitalshelf.authservice.security.JwtUtil;
import com.digitalshelf.authservice.service.UserService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;   // <-- new field

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.ok("Registration Successful");
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // NEW ENDPOINT — admin only
    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");

        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        Claims claims = jwtUtil.extractAllClaims(token);
        String role = claims.get("role", String.class);

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin access required");
        }

        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}