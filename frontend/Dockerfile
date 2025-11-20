# Use official Node.js LTS version as base image
FROM node:22
# Set working directory inside the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install

# copy rest of our app into container

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "npm", "start" ]

# End of Dockerfile