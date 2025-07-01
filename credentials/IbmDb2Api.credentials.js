"use strict";
exports.__esModule = true;
exports.IbmDb2Api = void 0;
var IbmDb2Api = /** @class */ (function () {
    function IbmDb2Api() {
        this.name = 'ibmDb2Api';
        this.displayName = 'IBM DB2 API';
        this.documentationUrl = 'https://www.npmjs.com/package/ibm_db';
        this.properties = [
            {
                displayName: 'Hostname',
                name: 'host',
                type: 'string',
                "default": '',
                placeholder: 'localhost'
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                "default": 50000
            },
            {
                displayName: 'Database',
                name: 'database',
                type: 'string',
                "default": '',
                placeholder: 'BLUDB'
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                "default": ''
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true
                },
                "default": ''
            },
        ];
    }
    return IbmDb2Api;
}());
exports.IbmDb2Api = IbmDb2Api;
