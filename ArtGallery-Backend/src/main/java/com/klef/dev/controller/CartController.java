package com.klef.dev.controller;

import com.klef.dev.entity.Artwork;
import com.klef.dev.entity.User;
import com.klef.dev.service.CartService;
import com.klef.dev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shop/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    // GET cart items
    @GetMapping
    public ResponseEntity<List<Artwork>> getCart(@RequestParam String username) {
        User user = userService.findByUsername(username);
        if (user == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(cartService.getCartItems(user));
    }

    // ADD to cart
    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody CartRequest request) {
        try {
            cartService.addToCart(request.getUsername(), request.getArtworkId());
            return ResponseEntity.ok("Added to cart");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // BUY cart
    @PostMapping("/buy")
    public ResponseEntity<String> buyCart(@RequestBody CartRequest request) {
        User user = userService.findByUsername(request.getUsername());
        if (user == null) return ResponseEntity.badRequest().body("Invalid user");
        cartService.buyCart(user);
        return ResponseEntity.ok("Purchase successful");
    }

    // REMOVE from cart
    @DeleteMapping("/remove/{artworkId}")
    public ResponseEntity<String> removeFromCart(
            @PathVariable Long artworkId,
            @RequestParam String username) {
        User user = userService.findByUsername(username);
        if (user == null) return ResponseEntity.badRequest().body("Invalid user");

        boolean removed = cartService.removeFromCart(user, artworkId);
        return removed
                ? ResponseEntity.ok("Item removed from cart")
                : ResponseEntity.badRequest().body("Item not found in cart");
    }

    // DTO for requests
    public static class CartRequest {
        private String username;
        private Long artworkId;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public Long getArtworkId() { return artworkId; }
        public void setArtworkId(Long artworkId) { this.artworkId = artworkId; }
    }
}