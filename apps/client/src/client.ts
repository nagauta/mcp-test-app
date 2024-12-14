import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import * as agents from "@graphai/agents";
import { CallToolResultSchema, ListToolsRequestSchema, ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GraphAI } from "graphai";
import dotenv from "dotenv";
dotenv.config();

const transport = new StdioClientTransport({
  command: "node_modules/@modelcontextprotocol/server-filesystem/dist/index.js",
  args: ["/Users/myano/Downloads/sample"]
});

const client = new Client({
  name: "example-client",
  version: "1.0.0",
}, {
  capabilities: {}
});
const main = async () => {
await client.connect(transport);

// 
const graph_data = {
  version: 0.5,
  loop: {
    while: ":continue",
  },
  nodes: {
    continue: {
      value: true,
      update: ":checkInput",
    },
    messages: {
      // Holds the conversation, array of messages.
      value: [{ role: "system", content: "You are a assistants. please support users following instrunctions" }],
      update: ":reducer.array.$0",
      isResult: true,
    },
    userInput: {
      // Receives an input from the user.
      agent: "textInputAgent",
      params: {
        message: "You:",
        required: true,
      },
    },
    checkInput: {
      // Checks if the user wants to terminate the chat or not.
      agent: "compareAgent",
      inputs: { array: [":userInput.text", "!=", "/bye"] },
    },
    tools: {
      agent: async () => { 
        const result = await client.request(
          { method: "tools/list" },
          ListToolsResultSchema,
        );
        const tools = result.tools.map(tool => ({
          type: "function",
          function: {
            name: tool?.name,
            description: tool?.description,
            parameters: tool?.inputSchema
          }
        }));
        return tools;
      },
    },
    llm_prompt: {
      agent: "openAIAgent",
      inputs: { messages: ":messages", tools: ":tools", prompt: ":userInput.text" },
    },
    tool_call: {
      agent: async (inputs: any) => {
        console.log(`${inputs.tool.name} is called`);
        const resourceContent = await client.request(
          {
            method: "tools/call",
            params: inputs.tool
          },
          CallToolResultSchema,
        );
        return resourceContent;
      },
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

const graph = new GraphAI(graph_data, { ...agents });
const xxx = await graph.run();
console.log(JSON.stringify(xxx));

client.close();
}
main();