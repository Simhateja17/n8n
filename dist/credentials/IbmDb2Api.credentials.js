"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbmDb2Api = void 0;
class IbmDb2Api {
    name = 'ibmDb2Api';
    displayName = 'IBM DB2 API';
    documentationUrl = 'https://www.npmjs.com/package/ibm_db';
    properties = [
        {
            displayName: 'Hostname',
            name: 'host',
            type: 'string',
            default: '',
            placeholder: 'localhost',
        },
        {
            displayName: 'Port',
            name: 'port',
            type: 'number',
            default: 50000,
        },
        {
            displayName: 'Database',
            name: 'database',
            type: 'string',
            default: '',
            placeholder: 'BLUDB',
        },
        {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: '',
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: {
                password: true,
            },
            default: '',
        },
    ];
}
exports.IbmDb2Api = IbmDb2Api;
