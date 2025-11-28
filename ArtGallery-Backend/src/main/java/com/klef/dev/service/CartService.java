package com.klef.dev.service;

import com.klef.dev.entity.Artwork;
import com.klef.dev.entity.Cart;
import com.klef.dev.entity.User;
import com.klef.dev.repository.ArtworkRepository;
import com.klef.dev.repository.CartRepository;
import com.klef.dev.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    // ✅ Fetch or create a new cart for a user
    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    // ✅ Get all items from a user's cart
    @Transactional
    public List<Artwork> getCartItems(User user) {
        return getOrCreateCart(user).getArtworks();
    }

    // ✅ Add artwork to cart
    @Transactional
    public void addToCart(String username, Long artworkId) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found: " + username);
        }

        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found: " + artworkId));

        Cart cart = getOrCreateCart(user);

        // Prevent duplicate entries
        if (!cart.getArtworks().contains(artwork)) {
            cart.getArtworks().add(artwork);
            cartRepository.save(cart);
        }
    }

    // ✅ Remove artwork from cart
    @Transactional
    public boolean removeFromCart(User user, Long artworkId) {
        Cart cart = getOrCreateCart(user);
        Artwork artwork = artworkRepository.findById(artworkId).orElse(null);
        if (artwork == null) return false;

        boolean removed = cart.getArtworks().remove(artwork);
        if (removed) {
            cartRepository.save(cart);
        }
        return removed;
    }

    // ✅ "Buy" cart (clear cart after purchase)
    @Transactional
    public void buyCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getArtworks().clear();
        cartRepository.save(cart);
    }
}