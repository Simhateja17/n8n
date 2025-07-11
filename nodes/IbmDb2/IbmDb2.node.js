"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.IbmDb2 = void 0;
var ibmdb = require("ibm_db");
var IbmDb2 = /** @class */ (function () {
    function IbmDb2() {
        this.description = {
            displayName: 'IBM DB2',
            name: 'ibmDb2',
            icon: 'file:ibmDb2.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["query"]}}',
            description: 'Run a query in an IBM DB2 database',
            defaults: {
                name: 'IBM DB2'
            },
            inputs: 1,
            outputs: 1,
            credentials: [
                {
                    name: 'ibmDb2Api',
                    required: true
                },
            ],
            properties: [
                {
                    displayName: 'Query',
                    name: 'query',
                    type: 'string',
                    typeOptions: {
                        rows: 8,
                        editor: 'sqlEditor'
                    },
                    "default": '',
                    placeholder: 'SELECT * FROM MY_TABLE;',
                    required: true,
                    description: 'The SQL query to execute on the database'
                },
            ]
        };
    }
    IbmDb2.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var items, returnData, _loop_1, this_1, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        items = this.getInputData();
                        returnData = [];
                        _loop_1 = function (i) {
                            var query, credentials, connStr, data, executionData, error_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        query = this_1.getNodeParameter('query', i, '');
                                        return [4 /*yield*/, this_1.getCredentials('ibmDb2Api')];
                                    case 1:
                                        credentials = _b.sent();
                                        connStr = "DATABASE=".concat(credentials.database, ";HOSTNAME=").concat(credentials.host, ";UID=").concat(credentials.user, ";PWD=").concat(credentials.password, ";PORT=").concat(credentials.port, ";PROTOCOL=TCPIP");
                                        _b.label = 2;
                                    case 2:
                                        _b.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                                ibmdb.open(connStr, function (error, conn) {
                                                    if (error) {
                                                        reject(error);
                                                        return;
                                                    }
                                                    conn.query(query, function (queryError, result) {
                                                        if (queryError) {
                                                            conn.close(function () {
                                                                reject(queryError);
                                                            });
                                                            return;
                                                        }
                                                        conn.close(function () {
                                                            resolve(result);
                                                        });
                                                    });
                                                });
                                            })];
                                    case 3:
                                        data = _b.sent();
                                        executionData = this_1.helpers.returnJsonArray(data);
                                        returnData.push.apply(returnData, executionData.map(function (item) { return item.json; }));
                                        return [3 /*break*/, 5];
                                    case 4:
                                        error_1 = _b.sent();
                                        if (this_1.continueOnFail()) {
                                            returnData.push({ json: { error: error_1.message } });
                                            return [2 /*return*/, "continue"];
                                        }
                                        throw error_1;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < items.length)) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(i)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, [this.helpers.returnJsonArray(returnData)]];
                }
            });
        });
    };
    return IbmDb2;
}());
exports.IbmDb2 = IbmDb2;
