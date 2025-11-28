package com.klef.dev.service;

import com.klef.dev.entity.User;
import com.klef.dev.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Register new user
    @Transactional
    public User registerUser(User user) throws Exception {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new Exception("Username already exists");
        }
        return userRepository.save(user);
    }

    // Login user
    public User loginUser(String usernameOrEmail, String password) {
        User user = userRepository.findByUsername(usernameOrEmail);
        if (user == null) user = userRepository.findByEmail(usernameOrEmail);

        if (user != null && user.getPassword().equals(password)) return user;
        return null;
    }

    // Find user
    public User findByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) user = userRepository.findByEmail(username);
        return user;
    }

    // Update user
    @Transactional
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    // ---------------- Admin Methods ----------------

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Delete user by username
    @Transactional
    public boolean deleteUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            userRepository.delete(user);
            return true;
        }
        return false;
    }
}
