# Installation Guide for @mehrdafon/n8n-nodes-ibm-db2

This package provides an n8n node for connecting to IBM DB2 databases. The IBM DB2 driver requires native compilation, which needs specific build tools and dependencies.

## Installation Options

### Option 1: Automatic Setup (Recommended)

The package now includes automatic dependency detection and installation for Docker/Alpine environments:

```bash
npm install @mehrdafon/n8n-nodes-ibm-db2
```

This will:
1. Detect if you're running in a Docker/Alpine Linux environment
2. Check for required build tools
3. Automatically install missing dependencies if possible
4. Provide clear guidance if manual intervention is needed

### Option 2: Using Docker (Most Reliable)

Use the provided Dockerfile which handles all dependencies automatically:

```bash
# Build the Docker image
docker build -t my-n8n-with-db2 .

# Run the container
docker run -p 5678:5678 my-n8n-with-db2
```

### Option 3: Manual Dependency Installation

#### For Alpine Linux (Docker n8n images):
```bash
# Install as root
apk update && apk add --no-cache \
    build-base \
    python3 \
    python3-dev \
    linux-pam-dev \
    libc6-compat \
    libstdc++ \
    libgcc \
    musl-dev \
    gcompat

# Then install the node
npm install @mehrdafon/n8n-nodes-ibm-db2
```

#### For Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install build-essential python3-dev
npm install @mehrdafon/n8n-nodes-ibm-db2
```

#### For CentOS/RHEL:
```bash
sudo yum groupinstall "Development Tools"
sudo yum install python3-devel
npm install @mehrdafon/n8n-nodes-ibm-db2
```

## Troubleshooting

### Common Issues

1. **"make: not found" error**
   - Solution: Install build tools using one of the methods above

2. **Permission denied during automatic setup**
   - Run the container with appropriate permissions
   - Or use the manual installation method

3. **IBM DB2 driver compilation fails**
   - Ensure all build dependencies are installed
   - Check that Python 3 is available
   - Verify you have sufficient disk space

### Getting Help

If you encounter issues:

1. Check the installation logs for specific error messages
2. Ensure you're using a supported platform
3. Try the Docker approach for the most reliable setup
4. Open an issue on the project repository with detailed error logs

## Platform Support

- ✅ Alpine Linux (Docker n8n images)
- ✅ Ubuntu/Debian
- ✅ CentOS/RHEL
- ✅ Windows (with build tools installed)
- ✅ macOS

## License Requirements

This package includes the IBM DB2 ODBC driver, which is licensed under the Apache License 2.0. By using this package, you agree to the IBM license terms. Check the IBM documentation for additional license requirements. 