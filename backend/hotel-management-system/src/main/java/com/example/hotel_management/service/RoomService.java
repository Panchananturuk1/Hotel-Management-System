package com.example.hotel_management.service;

import com.example.hotel_management.model.Room;
import com.example.hotel_management.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    /**
     * Retrieve all rooms from the database
     * @return List of all rooms
     */
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    /**
     * Retrieve a specific room by ID
     * @param id The ID of the room to retrieve
     * @return The room if found, null otherwise
     */
    public Room getRoomById(Long id) {
        return roomRepository.findById(id).orElse(null);
    }

    /**
     * Retrieve all rooms for a specific hotel
     * @param hotelId The ID of the hotel
     * @return List of rooms belonging to the hotel
     */
    public List<Room> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    /**
     * Create a new room
     * @param room The room to create
     * @return The created room with generated ID
     */
    public Room createRoom(Room room) {
        if (room == null) {
            throw new IllegalArgumentException("Room cannot be null");
        }
        return roomRepository.save(room);
    }

    /**
     * Update an existing room
     * @param id The ID of the room to update
     * @param roomDetails The new room details
     * @return The updated room
     */
    public Room updateRoom(Long id, Room roomDetails) {
        if (roomDetails == null) {
            throw new IllegalArgumentException("Room details cannot be null");
        }
        
        Room existingRoom = roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        // Update room details
        if (roomDetails.getNumber() != null && !roomDetails.getNumber().trim().isEmpty()) {
            existingRoom.setNumber(roomDetails.getNumber());
        }
        
        if (roomDetails.getType() != null && !roomDetails.getType().trim().isEmpty()) {
            existingRoom.setType(roomDetails.getType());
        }
        
        if (roomDetails.getPrice() > 0) {
            existingRoom.setPrice(roomDetails.getPrice());
        }
        
        return roomRepository.save(existingRoom);
    }

    /**
     * Delete a room by ID
     * @param id The ID of the room to delete
     */
    public void deleteRoom(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Room ID cannot be null");
        }
        roomRepository.deleteById(id);
    }
}
