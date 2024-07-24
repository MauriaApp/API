# Dockerfile

# Use the official Node.js 20 image from Docker Hub
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy all files from the current directory to the working directory in the container
COPY . .

# Install dependencies for both server and client
RUN npm install

# Build your application (if necessary)
RUN npm run build

# Expose the port your app runs on
EXPOSE 8080

# Command to run your app, assuming index.js is your server entry point
CMD ["npm", "start"]
