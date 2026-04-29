package com.authservice.authservice.service;

import com.authservice.authservice.dto.LoginRequest;
import com.authservice.authservice.dto.LoginResponse;
import com.authservice.authservice.dto.RegisterRequest;
import com.authservice.authservice.entity.Role;
import com.authservice.authservice.entity.Status;
import com.authservice.authservice.entity.User;
import com.authservice.authservice.exceptions.AuthenticationFailedException;
import com.authservice.authservice.exceptions.ResourceAlreadyExistsException;
import com.authservice.authservice.exceptions.ResourceNotFoundException;
import com.authservice.authservice.repository.UserRepository;
import com.authservice.authservice.security.JwtUtil;
import com.authservice.authservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public User register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("User already exists with username: " + request.getUsername());
        }

        User user = new User();
        user.setUsername(request.getUsername());

        // MUST match your field name passwordhash [1](https://insightgloballlc-my.sharepoint.com/personal/kasaboina_lithin_insightglobal_com/_layouts/15/Doc.aspx?sourcedoc=%7BB0350138-E09C-4D96-BA5F-8390195937EB%7D&file=Banking_system_ms%20(003).docx&action=default&mobileredirect=true&DefaultItemOpen=1)
        user.setPasswordhash(passwordEncoder.encode(request.getPassword()));

        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user.setStatus(Status.ACTIVE);

        return userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password"));

        // MUST match your field name passwordhash [1](https://insightgloballlc-my.sharepoint.com/personal/kasaboina_lithin_insightglobal_com/_layouts/15/Doc.aspx?sourcedoc=%7BB0350138-E09C-4D96-BA5F-8390195937EB%7D&file=Banking_system_ms%20(003).docx&action=default&mobileredirect=true&DefaultItemOpen=1)
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordhash())) {
            throw new AuthenticationFailedException("Invalid username or password");
        }

        if (user.getStatus() != Status.ACTIVE) {
            throw new AuthenticationFailedException("User is INACTIVE");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        // userid exists in your entity [1](https://insightgloballlc-my.sharepoint.com/personal/kasaboina_lithin_insightglobal_com/_layouts/15/Doc.aspx?sourcedoc=%7BB0350138-E09C-4D96-BA5F-8390195937EB%7D&file=Banking_system_ms%20(003).docx&action=default&mobileredirect=true&DefaultItemOpen=1)
        return new LoginResponse(token, user.getUserid(), user.getUsername(), user.getRole().name());
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }
}