"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbmDb2Api = void 0;
class IbmDb2Api {
    name = 'ibmDb2Api';
    displayName = 'IBM DB2 API';
    documentationUrl = 'https://www.ibm.com/docs/en/db2/11.5?topic=services-db2-rest';
    properties = [
        {
            displayName: 'Connection Type',
            name: 'connectionType',
            type: 'options',
            options: [
                {
                    name: 'Database Connection Parameters (REST)',
                    value: 'database',
                    description: 'Use traditional database connection parameters via REST API (Recommended)'
                },
                {
                    name: 'ODBC Direct Connection',
                    value: 'odbc',
                    description: 'Direct ODBC connection to DB2 (requires ibm_db installation)'
                },
                {
                    name: 'REST API Endpoint',
                    value: 'rest',
                    description: 'Use a custom REST API endpoint'
                },
            ],
            default: 'database',
            description: 'How to connect to your DB2 instance',
        },
        {
            displayName: 'Notice',
            name: 'odbcNotice',
            type: 'notice',
            default: '',
            displayOptions: {
                show: {
                    connectionType: ['odbc'],
                },
            },
            typeOptions: {
                theme: 'warning',
            },
            description: 'ODBC Direct connection requires the ibm_db package to be installed separately. Run: npm install ibm_db',
        },
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: '',
            placeholder: 'https://your-db2-server:8443/db2/rest',
            description: 'Base URL of your DB2 REST API endpoint',
            required: true,
            displayOptions: {
                show: {
                    connectionType: ['rest'],
                },
            },
        },
        {
            displayName: 'Server',
            name: 'host',
            type: 'string',
            default: '',
            placeholder: '172.16.1.20',
            description: 'Database server hostname or IP address',
            required: true,
            displayOptions: {
                show: {
                    connectionType: ['database', 'odbc'],
                },
            },
        },
        {
            displayName: 'Port',
            name: 'port',
            type: 'number',
            default: 50000,
            description: 'Database port',
            required: true,
            displayOptions: {
                show: {
                    connectionType: ['database', 'odbc'],
                },
            },
        },
        {
            displayName: 'Database',
            name: 'database',
            type: 'string',
            default: '',
            placeholder: 'TFKDFG',
            description: 'Database name',
            required: true,
            displayOptions: {
                show: {
                    connectionType: ['database', 'odbc'],
                },
            },
        },
        {
            displayName: 'User',
            name: 'username',
            type: 'string',
            default: '',
            placeholder: 'T2000COCODMS',
            description: 'Database username',
            required: true,
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'Database password',
            required: true,
        },
        {
            displayName: 'REST Service Options',
            name: 'restOptions',
            type: 'collection',
            placeholder: 'Add REST Option',
            default: {},
            displayOptions: {
                show: {
                    connectionType: ['database'],
                },
            },
            options: [
                {
                    displayName: 'REST Services Port',
                    name: 'restPort',
                    type: 'number',
                    default: 8443,
                    description: 'Port for DB2 REST Services (if different from database port)',
                },
                {
                    displayName: 'REST Services Path',
                    name: 'restPath',
                    type: 'string',
                    default: '/db2/rest',
                    description: 'Path for DB2 REST Services API',
                },
                {
                    displayName: 'Use HTTPS',
                    name: 'useHttps',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to use HTTPS for REST API calls',
                },
            ],
        },
        {
            displayName: 'ODBC Options',
            name: 'odbcOptions',
            type: 'collection',
            placeholder: 'Add ODBC Option',
            default: {},
            displayOptions: {
                show: {
                    connectionType: ['odbc'],
                },
            },
            options: [
                {
                    displayName: 'Connection Timeout',
                    name: 'connectionTimeout',
                    type: 'number',
                    default: 30,
                    description: 'Connection timeout in seconds',
                },
                {
                    displayName: 'Use SSL',
                    name: 'useSSL',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to use SSL for the connection',
                },
            ],
        },
        {
            displayName: 'API Key (for REST endpoints)',
            name: 'apiKey',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
            placeholder: 'your-api-key-here',
            description: 'API key for authentication (if REST endpoint requires it)',
            displayOptions: {
                show: {
                    connectionType: ['rest'],
                },
            },
        },
        {
            displayName: 'SSL/TLS Options',
            name: 'sslOptions',
            type: 'collection',
            placeholder: 'Add SSL Option',
            default: {},
            displayOptions: {
                show: {
                    connectionType: ['rest', 'database'],
                },
            },
            options: [
                {
                    displayName: 'Ignore SSL Issues',
                    name: 'ignoreSsl',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to ignore SSL certificate errors',
                },
                {
                    displayName: 'Use Self-Signed Certificate',
                    name: 'allowSelfSigned',
                    type: 'boolean',
                    default: false,
                    description: 'Whether to allow self-signed certificates',
                },
            ],
        },
    ];
}
exports.IbmDb2Api = IbmDb2Api;
