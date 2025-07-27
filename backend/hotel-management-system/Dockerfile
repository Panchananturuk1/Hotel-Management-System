# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file into the container
COPY target/hotel-management-system-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
