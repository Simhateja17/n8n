import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, IDataObject, NodeConnectionType } from 'n8n-workflow';

export class IbmDb2 implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'IBM DB2',
        name: 'ibmDb2',
        icon: 'file:ibmDb2.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["query"]}}',
        description: 'Execute SQL queries on IBM DB2 database via REST API or ODBC',
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
                placeholder: 'SELECT * FROM MY_TABLE WHERE COLUMN = \'value\'',
                required: true,
                description: 'The SQL query to execute on the database',
            },
            {
                displayName: 'Query Parameters',
                name: 'parameters',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                default: {},
                placeholder: 'Add parameter',
                options: [
                    {
                        displayName: 'Parameter',
                        name: 'parameter',
                        values: [
                            {
                                displayName: 'Name',
                                name: 'name',
                                type: 'string',
                                default: '',
                                placeholder: 'param1'
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                placeholder: 'value1'
                            }
                        ]
                    }
                ],
                description: 'Query parameters for prepared statements'
            },
            {
                displayName: 'Options',
                name: 'options',
                type: 'collection',
                placeholder: 'Add Option',
                default: {},
                options: [
                    {
                        displayName: 'Timeout (seconds)',
                        name: 'timeout',
                        type: 'number',
                        default: 30,
                        description: 'Request timeout in seconds'
                    },
                    {
                        displayName: 'Max Rows',
                        name: 'maxRows',
                        type: 'number',
                        default: 1000,
                        description: 'Maximum number of rows to return'
                    }
                ]
            }
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        let returnData: IDataObject[] = [];

        for (let i = 0; i < items.length; i++) {
            const query = this.getNodeParameter('query', i, '') as string;
            const parameters = this.getNodeParameter('parameters', i, {}) as any;
            const options = this.getNodeParameter('options', i, {}) as any;
            const credentials = await this.getCredentials('ibmDb2Api');
            
            try {
                let data: any[] = [];
                
                // Build parameters array
                const queryParams: any[] = [];
                if (parameters.parameter && Array.isArray(parameters.parameter)) {
                    parameters.parameter.forEach((param: any) => {
                        if (param.name && param.value !== undefined) {
                            queryParams.push({
                                name: param.name,
                                value: param.value
                            });
                        }
                    });
                }

                if (credentials.connectionType === 'odbc') {
                    // ODBC Direct Connection
                    try {
                        // Try to load ibm_db module
                        let ibmdb: any;
                        try {
                            ibmdb = require('ibm_db');
                        } catch (requireError) {
                            throw new Error(
                                'ODBC connection requires the ibm_db package to be installed. ' +
                                'Please run: npm install ibm_db\n\n' +
                                'Note: This requires build tools (make, gcc, python) to be available. ' +
                                'Consider using "Database Connection Parameters (REST)" instead for easier installation.'
                            );
                        }

                        // Build connection string
                        const odbcOptions = credentials.odbcOptions as any || {};
                        const connStr = `DATABASE=${credentials.database};HOSTNAME=${credentials.host};UID=${credentials.username};PWD=${credentials.password};PORT=${credentials.port};PROTOCOL=TCPIP${odbcOptions.useSSL ? ';SECURITY=SSL' : ''}`;
                        
                        // Set connection timeout if specified
                        const connectionTimeout = odbcOptions.connectionTimeout || 30;
                        
                        data = await new Promise((resolve, reject) => {
                            const timeoutId = setTimeout(() => {
                                reject(new Error(`ODBC connection timeout after ${connectionTimeout} seconds`));
                            }, connectionTimeout * 1000);

                            ibmdb.open(connStr, (error: any, conn: any) => {
                                clearTimeout(timeoutId);
                                
                                if (error) {
                                    reject(new Error(`ODBC connection failed: ${error.message}`));
                                    return;
                                }
                                
                                // Prepare query with parameters if any
                                let finalQuery = query;
                                const paramValues: any[] = [];
                                
                                if (queryParams.length > 0) {
                                    // Replace named parameters with ? placeholders and collect values
                                    queryParams.forEach((param) => {
                                        const paramName = param.name;
                                        const paramValue = param.value;
                                        // Simple parameter replacement (could be enhanced)
                                        finalQuery = finalQuery.replace(new RegExp(`:${paramName}\\b`, 'g'), '?');
                                        paramValues.push(paramValue);
                                    });
                                }
                                
                                // Execute query
                                const queryTimeout = (options.timeout || 30) * 1000;
                                const queryTimeoutId = setTimeout(() => {
                                    conn.close(() => {
                                        reject(new Error(`Query timeout after ${options.timeout || 30} seconds`));
                                    });
                                }, queryTimeout);

                                conn.query(finalQuery, paramValues, (queryError: any, result: any) => {
                                    clearTimeout(queryTimeoutId);
                                    
                                    if (queryError) {
                                        conn.close(() => {
                                            reject(new Error(`Query execution failed: ${queryError.message}`));
                                        });
                                        return;
                                    }
                                    
                                    conn.close(() => {
                                        // Limit results if maxRows is specified
                                        let finalResult = result;
                                        if (options.maxRows && Array.isArray(result) && result.length > options.maxRows) {
                                            finalResult = result.slice(0, options.maxRows);
                                        }
                                        resolve(finalResult);
                                    });
                                });
                            });
                        });

                    } catch (error) {
                        throw new Error(`ODBC connection error: ${(error as Error).message}`);
                    }
                } else {
                    // REST API Connection (database or rest)
                    let requestOptions: any;

                    // Determine the base URL based on connection type
                    let baseUrl: string;
                    if (credentials.connectionType === 'rest') {
                        // Use provided REST API endpoint
                        baseUrl = credentials.baseUrl as string;
                    } else {
                        // Construct REST API URL from database connection parameters
                        const restOptions = credentials.restOptions as any || {};
                        const protocol = restOptions.useHttps !== false ? 'https' : 'http';
                        const restPort = restOptions.restPort || 8443;
                        const restPath = restOptions.restPath || '/db2/rest';
                        
                        baseUrl = `${protocol}://${credentials.host}:${restPort}${restPath}`;
                    }

                    // Use DB2 REST Services approach for all connections
                    requestOptions = {
                        method: 'POST',
                        url: `${baseUrl}/services/db`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
                            'Accept': 'application/json'
                        },
                        body: {
                            sql: query,
                            parameters: queryParams,
                            maxRows: options.maxRows || 1000,
                            // Include database connection info for database parameter connections
                            ...(credentials.connectionType === 'database' && {
                                connectionString: `DATABASE=${credentials.database};HOSTNAME=${credentials.host};UID=${credentials.username};PWD=${credentials.password};PORT=${credentials.port};PROTOCOL=TCPIP`
                            })
                        },
                        json: true,
                        timeout: (options.timeout || 30) * 1000,
                        // SSL options
                        ...(credentials.sslOptions && typeof credentials.sslOptions === 'object' && {
                            rejectUnauthorized: !(credentials.sslOptions as any).ignoreSsl,
                            requestCert: true,
                            agent: false
                        })
                    };

                    // Add API key if provided (for REST endpoints)
                    if (credentials.connectionType === 'rest' && credentials.apiKey) {
                        requestOptions.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
                    }

                    try {
                        const response = await this.helpers.request(requestOptions);
                        data = response.resultSet || response.data || response.rows || [];
                    } catch (restError: any) {
                        // If REST API fails and we're using database parameters, try alternative approaches
                        if (credentials.connectionType === 'database') {
                            // Try alternative REST endpoint structures
                            const alternativeEndpoints = [
                                `${baseUrl}/v1/query`,
                                `${baseUrl}/query`,
                                `${baseUrl}/sql/execute`
                            ];

                            let successfulResponse = null;
                            for (const endpoint of alternativeEndpoints) {
                                try {
                                    const altRequestOptions = {
                                        ...requestOptions,
                                        url: endpoint,
                                        body: {
                                            query: query,
                                            database: credentials.database,
                                            parameters: queryParams,
                                            maxRows: options.maxRows || 1000
                                        }
                                    };

                                    successfulResponse = await this.helpers.request(altRequestOptions);
                                    data = successfulResponse.resultSet || successfulResponse.data || successfulResponse.rows || [];
                                    break;
                                } catch (altError) {
                                    // Continue to next endpoint
                                    continue;
                                }
                            }

                            if (!successfulResponse) {
                                // If all REST approaches fail, provide helpful error message
                                throw new Error(`Unable to connect to DB2 REST API. 
                                        
Possible solutions:
1. Enable DB2 REST Services on your server: ${credentials.host}
2. Check if REST Services are running on port ${requestOptions.url.includes('8443') ? '8443' : credentials.port}
3. Verify REST Services path: ${baseUrl}
4. Ensure your credentials have REST API access
5. Try "ODBC Direct Connection" if REST is not available

Original error: ${restError.message}`);
                            }
                        } else {
                            throw restError;
                        }
                    }
                }

                // Process and format the response data
                if (!Array.isArray(data)) {
                    data = [];
                }

                // Convert each row to the expected format
                const processedData = data.map((row: any) => {
                    if (typeof row === 'object' && row !== null) {
                        return row;
                    }
                    return { result: row };
                });

                const executionData = this.helpers.returnJsonArray(processedData as IDataObject[]);
                returnData.push(...executionData.map(item => item.json));

            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ 
                        json: { 
                            error: (error as Error).message,
                            query: query,
                            connectionType: credentials.connectionType || 'unknown'
                        } 
                    });
                    continue;
                }
                throw error;
            }
        }
        
        return [this.helpers.returnJsonArray(returnData)];
    }
}