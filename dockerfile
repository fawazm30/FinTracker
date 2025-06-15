# Use Node.js base image
FROM node:18-slim

# Update and install security updates
RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port (adjust to your app's port if different)
EXPOSE 3000

# Start the server
CMD [ "node", "server.js" ]

RUN apt-get update && apt-get install -y curl \
  && curl -o /usr/local/bin/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
  && chmod +x /usr/local/bin/wait-for-it.sh
