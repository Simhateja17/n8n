#!/usr/bin/env node

var execSync = require('child_process').execSync;
var fs = require('fs');
var path = require('path');

function isDockerEnvironment() {
    try {
        // Check if we're in a Docker container
        return fs.existsSync('/.dockerenv') || 
               process.env.DOCKER_CONTAINER === 'true' ||
               process.env.container === 'docker';
    } catch (error) {
        return false;
    }
}

function isAlpineLinux() {
    try {
        var osRelease = fs.readFileSync('/etc/os-release', 'utf8');
        return osRelease.indexOf('Alpine Linux') !== -1;
    } catch (error) {
        return false;
    }
}

function hasBuildTools() {
    try {
        execSync('which make', { stdio: 'ignore' });
        execSync('which g++', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

function main() {
    console.log('🔍 Checking environment and dependencies...');
    
    var inDocker = isDockerEnvironment();
    var isAlpine = isAlpineLinux();
    var hasBuild = hasBuildTools();
    
    console.log('Docker environment: ' + inDocker);
    console.log('Alpine Linux: ' + isAlpine);
    console.log('Build tools available: ' + hasBuild);
    
    if (inDocker && isAlpine && !hasBuild) {
        console.log('⚠️  Missing build dependencies for IBM DB2 driver compilation.');
        console.log('📦 Will attempt to install required dependencies...');
        
        // Create a flag file to indicate dependencies need to be installed
        var flagPath = path.join(__dirname, '..', '.needs-alpine-deps');
        fs.writeFileSync(flagPath, 'true');
    } else if (!hasBuild && process.platform === 'linux') {
        console.log('⚠️  Build tools not found. IBM DB2 driver may fail to compile.');
        console.log('💡 Consider installing build-essential (Ubuntu/Debian) or Development Tools (CentOS/RHEL)');
    }
}

if (require.main === module) {
    main();
} 