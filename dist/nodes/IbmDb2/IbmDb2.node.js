"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IbmDb2 = void 0;
const ibmdb = __importStar(require("ibm_db"));
class IbmDb2 {
    description = {
        displayName: 'IBM DB2',
        name: 'ibmDb2',
        icon: 'file:ibmDb2.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["query"]}}',
        description: 'Run a query in an IBM DB2 database',
        defaults: {
            name: 'IBM DB2',
        },
        inputs: ["main" /* NodeConnectionType.Main */],
        outputs: ["main" /* NodeConnectionType.Main */],
        credentials: [
            {
                name: 'ibmDb2Api',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Query',
                name: 'query',
                type: 'string',
                typeOptions: {
                    rows: 8,
                    editor: 'sqlEditor',
                },
                default: '',
                placeholder: 'SELECT * FROM MY_TABLE;',
                required: true,
                description: 'The SQL query to execute on the database',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        let returnData = [];
        for (let i = 0; i < items.length; i++) {
            const query = this.getNodeParameter('query', i, '');
            const credentials = await this.getCredentials('ibmDb2Api');
            const connStr = `DATABASE=${credentials.database};HOSTNAME=${credentials.host};UID=${credentials.user};PWD=${credentials.password};PORT=${credentials.port};PROTOCOL=TCPIP`;
            try {
                const data = await new Promise((resolve, reject) => {
                    ibmdb.open(connStr, (error, conn) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        conn.query(query, (queryError, result) => {
                            if (queryError) {
                                conn.close(() => {
                                    reject(queryError);
                                });
                                return;
                            }
                            conn.close(() => {
                                resolve(result);
                            });
                        });
                    });
                });
                const executionData = this.helpers.returnJsonArray(data);
                returnData.push(...executionData.map(item => item.json));
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.IbmDb2 = IbmDb2;
