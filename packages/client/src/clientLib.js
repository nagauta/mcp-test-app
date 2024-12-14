"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAssistant = callAssistant;
var index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
var agents = require("@graphai/agents");
var types_js_1 = require("@modelcontextprotocol/sdk/types.js");
var stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
var graphai_1 = require("graphai");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var transport = new stdio_js_1.StdioClientTransport({
    command: "node_modules/@modelcontextprotocol/server-filesystem/dist/index.js",
    args: ["/Users/myano/Downloads/sample"]
});
var graph_data = {
    version: 0.5,
    loop: {
        while: ":continue",
    },
    nodes: {
        messages: {
            // Holds the conversation, array of messages.
            value: [{ role: "system", content: "You are a assistants. please support users following instrunctions" }],
            update: ":reducer.array.$0",
            isResult: true,
        },
        userInput: {
            value: "",
        },
        dbg: {
            agent: function (inputs) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    console.log("xxxxxxxxxxxxxxxx: ".concat(JSON.stringify(inputs.tool2)));
                    console.log("xxxxxxxxxxxxxxxx: ".concat(JSON.stringify(inputs.tool3)));
                    return [2 /*return*/];
                });
            }); },
            inputs: { tool2: ":userInput", tool3: ":messages" },
        },
        tools: {
            agent: function () { return __awaiter(void 0, void 0, void 0, function () {
                var result, tools;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, client.request({ method: "tools/list" }, types_js_1.ListToolsResultSchema)];
                        case 1:
                            result = _a.sent();
                            tools = result.tools.map(function (tool) { return ({
                                type: "function",
                                function: {
                                    name: tool === null || tool === void 0 ? void 0 : tool.name,
                                    description: tool === null || tool === void 0 ? void 0 : tool.description,
                                    parameters: tool === null || tool === void 0 ? void 0 : tool.inputSchema
                                }
                            }); });
                            return [2 /*return*/, tools];
                    }
                });
            }); },
        },
        llm_prompt: {
            agent: "openAIAgent",
            inputs: { messages: ":messages", tools: ":tools", prompt: ":userInput" },
        },
        tool_call: {
            agent: function (inputs) { return __awaiter(void 0, void 0, void 0, function () {
                var resourceContent;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("".concat(inputs.tool.name, " is called"));
                            return [4 /*yield*/, client.request({
                                    method: "tools/call",
                                    params: inputs.tool
                                }, types_js_1.CallToolResultSchema)];
                        case 1:
                            resourceContent = _a.sent();
                            return [2 /*return*/, resourceContent];
                    }
                });
            }); },
            inputs: { tool: ":llm_prompt.tool" },
            if: ":llm_prompt.tool.name",
        },
        messagesWithToolRes: {
            // Appends that message to the messages.
            agent: "pushAgent",
            inputs: {
                array: ":llm_prompt.messages",
                item: {
                    role: "tool",
                    tool_call_id: ":llm_prompt.tool.id",
                    name: ":llm_prompt.tool.name",
                    content: ":tool_call.content",
                },
            },
            if: ":llm_prompt.tool.name",
        },
        llm_post_call: {
            agent: "openAIAgent",
            inputs: {
                messages: ":messagesWithToolRes.array"
            },
            if: ":llm_prompt.tool.name",
        },
        output: {
            // Displays the response to the user.
            agent: "stringTemplateAgent",
            console: {
                after: true,
            },
            inputs: {
                text: "\x1b[32mAgent\x1b[0m: ${:llm_post_call.text}",
            },
        },
        reducer: {
            // Receives messages from either case.
            agent: "copyAgent",
            anyInput: true,
            inputs: { array: [":messagesWithToolRes.array"] },
        },
        result: {
            agent: "copyAgent",
            inputs: { messages: ":messages" },
            isResult: true,
        },
    }
};
var graph = new graphai_1.GraphAI(graph_data, __assign({}, agents));
var client = new index_js_1.Client({
    name: "example-client",
    version: "1.0.0",
}, {
    capabilities: {}
});
var chat = function (message, result) { return __awaiter(void 0, void 0, void 0, function () {
    var x;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (result) {
                    console.log("resultxxx: ".concat(JSON.stringify(result.messages)));
                    graph.initializeGraphAI(); // 必要に応じてグラフを初期化
                    graph.injectValue("messages", result.messages);
                }
                graph.injectValue("userInput", message);
                return [4 /*yield*/, graph.run()];
            case 1:
                x = _a.sent();
                return [2 /*return*/, x];
        }
    });
}); };
function callAssistant() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.connect(transport)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, function (message, result) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, chat(message, result)];
                            });
                        }); }];
            }
        });
    });
}
