package com.authservice.authservice.controllers;
import com.authservice.authservice.dto.LoginRequest;
import com.authservice.authservice.dto.LoginResponse;
import com.authservice.authservice.dto.RegisterRequest;
import com.authservice.authservice.entity.User;
import com.authservice.authservice.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ✅ Register: returns saved user (with hashed password stored in DB)
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // ✅ Login: returns JWT token + userid + role
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ✅ Optional: test endpoint (requires JWT because not in permitAll list)

    @GetMapping("/me")
    public ResponseEntity<String> me(Authentication authentication) {
        return ResponseEntity.ok(authentication.getName());
    }


}
