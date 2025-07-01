import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, IDataObject, NodeConnectionType } from 'n8n-workflow';
import * as ibmdb from 'ibm_db';

export class IbmDb2 implements INodeType {
    description: INodeTypeDescription = {
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
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
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

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        let returnData: IDataObject[] = [];

        for (let i = 0; i < items.length; i++) {
            const query = this.getNodeParameter('query', i, '') as string;
            const credentials = await this.getCredentials('ibmDb2Api');
            const connStr = `DATABASE=${credentials.database};HOSTNAME=${credentials.host};UID=${credentials.user};PWD=${credentials.password};PORT=${credentials.port};PROTOCOL=TCPIP`;
            
            try {
                const data = await new Promise<any[]>((resolve, reject) => {
                    ibmdb.open(connStr, (error: any, conn: any) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        
                        conn.query(query, (queryError: any, result: any) => {
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
                
                const executionData = this.helpers.returnJsonArray(data as IDataObject[]);
                returnData.push(...executionData.map(item => item.json));
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: (error as Error).message } });
                    continue;
                }
                throw error;
            }
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}