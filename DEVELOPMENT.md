# Development Guide for n8n IBM DB2 Node

## Prerequisites
- Node.js installed
- npm installed
- Access to an IBM DB2 database (or Docker for local testing)

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/Simhateja17/n8n.git
cd n8n
```

2. Install dependencies:
```bash
npm install
```

3. Start development mode:
```bash
npm run dev
```

## How to Update the Package

### 1. Make Code Changes
- Edit files in `nodes/` or `credentials/` directories
- Test your changes locally using the development setup
- Ensure all changes are working with your IBM DB2 database

### 2. Version Update
Before publishing, update the version in package.json:
```bash
npm version patch  # for bug fixes (0.0.x)
npm version minor  # for new features (0.x.0)
npm version major  # for breaking changes (x.0.0)
```

### 3. Build and Publish
```bash
# Build the package
npm run build

# Publish to npm
npm publish --access public
```

### 4. Create GitHub Release
1. Push your changes to GitHub:
```bash
git push origin main
git push --tags
```

2. Go to [GitHub Releases](https://github.com/Simhateja17/n8n/releases)
3. Click "Create a new release"
4. Choose the new version tag
5. Title: "Release v[version]" (e.g., "Release v0.1.1")
6. Describe the changes made
7. Click "Publish release"

## Testing

### Local Testing with Docker
```bash
# Start IBM DB2 container
docker run -itd --name db2_test \
  -p 50000:50000 \
  -e DBNAME=testdb \
  -e DB2INSTANCE=db2inst1 \
  -e DB2INST1_PASSWORD=password \
  -e LICENSE=accept \
  --privileged=true \
  ibmcom/db2

# Test credentials
Host: localhost
Port: 50000
Database: testdb
User: db2inst1
Password: password
```

## Package Management

### Current Package Details
- Name: `@mehrdafon/n8n-nodes-ibm-db2`
- Published on: npmjs.com
- Installation: `npm install @mehrdafon/n8n-nodes-ibm-db2`

### Adding Collaborators
To add new maintainers to the npm package:
```bash
npm owner add <username> @mehrdafon/n8n-nodes-ibm-db2
```

## Support
For any issues or questions:
1. Create an [issue on GitHub](https://github.com/Simhateja17/n8n/issues)
2. Contact the maintainers through the repository 