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


const graph_data = {
  version: 0.5,
  nodes: {
    request: {
      value: "please tell read /users/myano/downloads/sample/input.csv"
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
      console: {
        before: true,
      },
      agent: "openAIAgent",
      inputs: { tools: ":tools", prompt: ":request" },
    },
    tool_call: {
      agent: async (inputs: any) => {
        console.log(`xxx: ${JSON.stringify(inputs)}`);
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
    },
    debug: {
      agent: "copyAgent",
      params: { namedKey: "key" },
      console: {
        after: true,
      },
      inputs: { key: ":tool_call.content.$0.text" },
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
    },
    llm_post_call: {
      agent: "openAIAgent",
      inputs: {
        messages: ":messagesWithToolRes.array"
      }
    },
    final_output: {
      agent: "copyAgent",
      params: {
        namedKey: "text"
      },
      isResult: true,
      inputs: {
        text: ":llm_post_call.text"
      }
    }
  }
};

const graph = new GraphAI(graph_data, { ...agents });
const results = await graph.run();
console.log(results);

client.close();
}
main();