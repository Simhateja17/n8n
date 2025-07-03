# Step 1: Start from the official n8n image as our base.
FROM docker.io/n8nio/n8n:1.95.2

# Step 2: Switch to the 'root' user so we have permission to install software.
USER root

# Step 3: Install the necessary tools. This is the crucial fix for the 'make: not found' error.
# 'build-base' includes tools like 'make' and 'g++' needed to compile code.
# Additional packages required for ibm_db driver compilation and runtime.
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    python3-dev \
    linux-pam-dev \
    libc6-compat \
    libstdc++ \
    libgcc \
    musl-dev \
    gcompat

# Step 4: Install the ibm_db dependency needed by our custom node.
RUN npm install --global ibm_db

# Step 5: Copy our custom node files directly into n8n's custom directory.
# This follows n8n's recommended approach for private nodes in Docker.
RUN mkdir -p /home/node/.n8n/custom/nodes /home/node/.n8n/custom/credentials
COPY dist/nodes/IbmDb2 /home/node/.n8n/custom/nodes/IbmDb2
COPY dist/credentials/IbmDb2Api.credentials.js /home/node/.n8n/custom/credentials/IbmDb2Api.credentials.js
RUN chown -R node:node /home/node/.n8n

# Step 6: Switch back to the less-privileged 'node' user for better security.
USER node