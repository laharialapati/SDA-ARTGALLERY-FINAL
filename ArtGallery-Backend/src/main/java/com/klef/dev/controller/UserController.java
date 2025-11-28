package com.klef.dev.controller;

import com.klef.dev.entity.User;
import com.klef.dev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*") // ✅ keep global for safety
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ LOGIN
    @PostMapping("/login")
    @CrossOrigin(origins = "*") // ✅ explicit for POST
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            User user = userService.findByUsername(loginRequest.getUsername());
            if (user == null || !user.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid username or password");
            }

            // return only safe info (no password)
            User response = new User();
            response.setUsername(user.getUsername());
            response.setRole(user.getRole());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error during login");
        }
    }

    // ✅ REGISTER
    @PostMapping("/register")
    @CrossOrigin(origins = "*") // ✅ explicit for POST
    public ResponseEntity<String> register(@RequestBody User user) {
        try {
            userService.registerUser(user);
            return ResponseEntity.ok("Registration successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    // GET profile
    @GetMapping("/{username}")
    public ResponseEntity<User> getUserProfile(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();

        User response = new User();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());

        return ResponseEntity.ok(response);
    }

    // UPDATE profile
    @PutMapping("/{username}")
    public ResponseEntity<String> updateUserProfile(
            @PathVariable String username,
            @RequestBody User updated
    ) {
        try {
            User existing = userService.findByUsername(username);
            if (existing == null) return ResponseEntity.notFound().build();

            existing.setEmail(updated.getEmail());
            existing.setPhone(updated.getPhone());

            userService.updateUser(existing);

            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Server error while updating profile");
        }
    }
}
