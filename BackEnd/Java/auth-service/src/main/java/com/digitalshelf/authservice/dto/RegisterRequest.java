package com.digitalshelf.authservice.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String userName;
    private String userEmail;
    private String password;
    private String userPhone;
    private String userAddress;
}