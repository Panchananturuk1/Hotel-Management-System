-- Create database
CREATE DATABASE IF NOT EXISTS hotel_management_db;
USE hotel_management_db;

-- Create tables
CREATE TABLE IF NOT EXISTS hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) NOT NULL,
    UNIQUE KEY unique_name (name)
);

-- Add created_date column
ALTER TABLE hotels ADD COLUMN created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_number VARCHAR(10) NOT NULL,
    room_type VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    max_occupancy INT NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    hotel_id INT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id)
);

CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    room_id INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Insert sample data
INSERT INTO rooms (room_number, room_type, price, max_occupancy) VALUES
('101', 'Single', 1500.00, 1),
('102', 'Single', 1500.00, 1),
('103', 'Double', 2500.00, 2),
('104', 'Double', 2500.00, 2),
('105', 'Deluxe', 3500.00, 2),
('106', 'Deluxe', 3500.00, 2),
('201', 'Suite', 5000.00, 4),
('202', 'Suite', 5000.00, 4);

INSERT INTO customers (name, email, phone, address) VALUES
('John Doe', 'john@example.com', '+919876543210', '123 Main St, Mumbai'),
('Jane Smith', 'jane@example.com', '+919876543211', '456 Park Ave, Delhi'),
('Bob Johnson', 'bob@example.com', '+919876543212', '789 Ocean Dr, Chennai');

-- Sample booking
INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, total_price) VALUES
(1, 1, '2025-07-15', '2025-07-20', 7500.00),
(2, 2, '2025-07-16', '2025-07-21', 7500.00),
(3, 3, '2025-07-17', '2025-07-22', 12500.00);
