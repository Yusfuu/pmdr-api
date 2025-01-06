FROM node:latest

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

RUN npx prisma generate

RUN npx prisma migrate deploy

# Build the NestJS application
RUN npm run build

# Expose the application port
EXPOSE 1337

# Command to run the application
CMD ["npm", "run", "start:prod"]