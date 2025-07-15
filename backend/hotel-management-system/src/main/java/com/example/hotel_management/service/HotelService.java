package com.example.hotel_management.service;

import com.example.hotel_management.model.Hotel;
import com.example.hotel_management.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelService {
    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id).orElse(null);
    }

    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(Long id, Hotel hotelDetails) {
        if (hotelDetails == null) {
            throw new IllegalArgumentException("Hotel details cannot be null");
        }
        
        Hotel hotel = hotelRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));

        if (hotelDetails.getName() != null && !hotelDetails.getName().trim().isEmpty()) {
            hotel.setName(hotelDetails.getName().trim());
        }
        
        if (hotelDetails.getLocation() != null) {
            hotel.setLocation(hotelDetails.getLocation().trim());
        }
        
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }
}
