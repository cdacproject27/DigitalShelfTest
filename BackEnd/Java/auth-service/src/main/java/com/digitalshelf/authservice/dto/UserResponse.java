package com.digitalshelf.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String userAddress;
    private String token;
    private String role;
}