# Use an official Node 18 image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build TypeScript
RUN npm run build

# Expose API port (e.g., 3000)
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
