# ==========================================
# STAGE 1: Build FFmpeg with All Codecs
# ==========================================
FROM mwader/static-ffmpeg:7.1.0 AS ffmpeg-source

# ==========================================
# STAGE 2: Create the Final Node.js App Server
# ==========================================
FROM node:20-slim

# Install minimal system dependencies required for video/audio processing
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fontconfig \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy the fully compiled, all-codec FFmpeg binaries from Stage 1
COPY --from=ffmpeg-source /ffmpeg /usr/local/bin/
COPY --from=ffmpeg-source /ffprobe /usr/local/bin/

# Set up the Node.js application directory
WORKDIR /app

# Install project dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy remaining website source code
COPY . .

# Expose the web server port
EXPOSE 3000

# Start your Node backend
CMD ["node", "server.js"]
