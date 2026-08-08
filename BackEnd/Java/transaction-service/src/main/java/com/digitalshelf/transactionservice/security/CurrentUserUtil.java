package com.digitalshelf.transactionservice.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserUtil {

    // The JwtAuthFilter set the authenticated "principal" to be the userId string (extracted from
    // the JWT's "sub" claim) -- so any controller can call this to get the current logged-in user's id.
    public Integer getCurrentUserId() {
        String userIdStr = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return Integer.parseInt(userIdStr);
    }
}