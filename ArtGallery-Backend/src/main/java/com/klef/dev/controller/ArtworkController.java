package com.klef.dev.controller;

import com.klef.dev.entity.Artwork;
import com.klef.dev.entity.User;
import com.klef.dev.service.ArtworkService;
import com.klef.dev.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/artworks")
@CrossOrigin(origins = "*") // React frontend
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    @Autowired
    private UserService userService;

    private static final String UPLOAD_DIR = "uploads";

    // ✅ Add artwork (with image upload)
    @PostMapping("/add")
    public ResponseEntity<Artwork> addArtwork(
            @RequestParam String username,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String type,
            @RequestParam Double price,
            @RequestParam(value = "image", required = false) MultipartFile file
    ) throws IOException {

        User artist = userService.findByUsername(username);
        if (artist == null) {
            return ResponseEntity.badRequest().build();
        }

        String fileName = null;
        if (file != null && !file.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        }

        Artwork artwork = new Artwork();
        artwork.setTitle(title);
        artwork.setDescription(description);
        artwork.setType(type);
        artwork.setPrice(price);
        artwork.setArtist(artist);
        if (fileName != null) {
            artwork.setImageUrl("/uploads/" + fileName);
        }

        Artwork saved = artworkService.addArtwork(artwork);
        return ResponseEntity.ok(saved);
    }

    // ✅ Get artworks by artist
    @GetMapping("/myartworks")
    public ResponseEntity<List<Artwork>> getMyArtworks(@RequestParam String username) {
        User artist = userService.findByUsername(username);
        if (artist == null) return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(artworkService.getArtworksByArtist(artist));
    }

    // ✅ Delete artwork (artist-only)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArtwork(@PathVariable Long id, @RequestParam String username) {
        User artist = userService.findByUsername(username);
        if (artist == null) {
            return ResponseEntity.status(401).body("Invalid user");
        }

        boolean deleted = artworkService.deleteArtworkByArtist(id, artist);
        return deleted
                ? ResponseEntity.ok("Artwork deleted successfully.")
                : ResponseEntity.status(403).body("You cannot delete this artwork.");
    }

    // ✅ Update artwork (artist-only)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateArtwork(
            @PathVariable Long id,
            @RequestParam String username,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String type,
            @RequestParam Double price
    ) {
        User artist = userService.findByUsername(username);
        if (artist == null) {
            return ResponseEntity.status(401).body("Invalid user");
        }

        Artwork updatedArtwork = new Artwork();
        updatedArtwork.setTitle(title);
        updatedArtwork.setDescription(description);
        updatedArtwork.setType(type);
        updatedArtwork.setPrice(price);

        boolean updated = artworkService.updateArtworkByArtist(id, updatedArtwork, artist);
        return updated
                ? ResponseEntity.ok("Artwork updated successfully.")
                : ResponseEntity.status(403).body("You cannot update this artwork.");
    }

    // ✅ Admin: Get all artworks
    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks() {
        return ResponseEntity.ok(artworkService.getAllArtworks());
    }
}