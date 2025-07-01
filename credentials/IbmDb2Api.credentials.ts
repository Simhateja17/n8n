import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class IbmDb2Api implements ICredentialType {
    name = 'ibmDb2Api';
    displayName = 'IBM DB2 API';
    documentationUrl = 'https://www.npmjs.com/package/ibm_db';
    properties: INodeProperties[] = [
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