FROM node:20-alpine
# Install FFmpeg
RUN apk add --no-cache ffmpeg
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
