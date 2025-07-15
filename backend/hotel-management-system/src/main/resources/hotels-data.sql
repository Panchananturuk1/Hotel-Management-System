-- Insert sample hotels with ratings
INSERT INTO hotels (name, location, rating) VALUES
('Grand Palace Hotel', 'Mumbai, India', 4.5),
('Royal Suites', 'Delhi, India', 4.8),
('Ocean View Resort', 'Goa, India', 4.7),
('Mountain Retreat', 'Shimla, India', 4.6),
('City Center Hotel', 'Bangalore, India', 4.4),
('Beach Paradise', 'Chennai, India', 4.5),
('Luxury Inn', 'Kolkata, India', 4.3),
('Green Valley Resort', 'Jaipur, India', 4.7),
('Hilltop Hotel', 'Ooty, India', 4.6),
('Business Hotel', 'Pune, India', 4.4);

-- Verify the insertion
SELECT id, name, location, rating FROM hotels ORDER BY id;
