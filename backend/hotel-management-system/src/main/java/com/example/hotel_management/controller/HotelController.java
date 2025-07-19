package com.example.hotel_management.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.example.hotel_management.model.Hotel;
import com.example.hotel_management.service.HotelService;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/hotels")
public class HotelController {
    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        try {
            List<Hotel> hotels = hotelService.getAllHotels();
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error fetching hotels: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public Hotel getHotel(@PathVariable Long id) {
        return hotelService.getHotelById(id);
    }

    @PostMapping
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        try {
            Hotel createdHotel = hotelService.createHotel(hotel);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdHotel);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public Hotel updateHotel(@PathVariable Long id, @RequestBody Hotel hotelDetails) {
        return hotelService.updateHotel(id, hotelDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
    }
}
