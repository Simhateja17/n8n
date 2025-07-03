#!/usr/bin/env node

var execSync = require('child_process').execSync;
var fs = require('fs');
var path = require('path');

function installAlpineDependencies() {
    console.log('🚀 Installing Alpine Linux dependencies for IBM DB2...');
    
    var packages = [
        'build-base',
        'python3',
        'python3-dev', 
        'linux-pam-dev',
        'libc6-compat',
        'libstdc++',
        'libgcc',
        'musl-dev',
        'gcompat'
    ];
    
    try {
        // First update package index
        console.log('📋 Updating package index...');
        execSync('apk update', { stdio: 'inherit' });
        
        // Install required packages
        console.log('📦 Installing build dependencies...');
        var installCmd = 'apk add --no-cache ' + packages.join(' ');
        execSync(installCmd, { stdio: 'inherit' });
        
        console.log('✅ Successfully installed Alpine dependencies!');
        return true;
    } catch (error) {
        console.error('❌ Failed to install Alpine dependencies:', error.message);
        
        // Provide helpful guidance
        console.log('\n🔧 Manual installation required:');
        console.log('Run this command as root in your Docker container:');
        console.log('apk update && apk add --no-cache ' + packages.join(' '));
        console.log('\nOr use the provided Dockerfile for automatic setup.');
        
        return false;
    }
}

function attemptPermissionElevation() {
    // Check if we're already root
    if (process.getuid && process.getuid() === 0) {
        return installAlpineDependencies();
    }
    
    console.log('🔐 Root permissions required for package installation...');
    
    // Try to run with sudo if available
    try {
        execSync('which sudo', { stdio: 'ignore' });
        console.log('Using sudo for package installation...');
        
        var script = path.join(__dirname, 'install-alpine-deps.sh');
        createInstallScript(script);
        
        execSync('sudo sh ' + script, { stdio: 'inherit' });
        fs.unlinkSync(script);
        
        return true;
    } catch (error) {
        console.log('❌ sudo not available or permission denied');
        return false;
    }
}

function createInstallScript(scriptPath) {
    var script = '#!/bin/sh\n' +
        'echo "Installing Alpine dependencies for IBM DB2..."\n' +
        'apk update\n' +
        'apk add --no-cache build-base python3 python3-dev linux-pam-dev libc6-compat libstdc++ libgcc musl-dev gcompat\n' +
        'echo "Dependencies installed successfully!"\n';
    
    fs.writeFileSync(scriptPath, script, { mode: parseInt('755', 8) });
}

function main() {
    var flagPath = path.join(__dirname, '..', '.needs-alpine-deps');
    
    // Check if we need to install dependencies
    if (!fs.existsSync(flagPath)) {
        console.log('✅ No additional dependencies needed.');
        return;
    }
    
    console.log('🔧 Setting up native dependencies for IBM DB2...');
    
    // Try to install dependencies
    var success = false;
    
    if (process.getuid && process.getuid() === 0) {
        // We're root, install directly
        success = installAlpineDependencies();
    } else {
        // Try with elevated permissions
        success = attemptPermissionElevation();
    }
    
    if (success) {
        // Clean up flag file
        fs.unlinkSync(flagPath);
        console.log('🎉 Setup complete! IBM DB2 driver should compile successfully.');
    } else {
        console.log('\n📝 Alternative setup options:');
        console.log('1. Use the provided Dockerfile for automatic dependency management');
        console.log('2. Manually install build dependencies before npm install');
        console.log('3. Use a pre-built Docker image with dependencies included');
        
        // Keep the flag file so user knows what's needed
        console.log('\n⚠️  Build dependencies still missing. See above for solutions.');
    }
}

if (require.main === module) {
    main();
} 