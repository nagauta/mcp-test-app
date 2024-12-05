import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
    ListResourcesResultSchema,
    ReadResourceResultSchema
  } from "@modelcontextprotocol/sdk/types.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "apps/client/node_modules/@modelcontextprotocol/server-filesystem/dist/index.js",
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

// List available resources
const resources = await client.request(
  { method: "resources/list" },
  ListResourcesResultSchema
);

// Read a specific resource
const resourceContent = await client.request(
  {
    method: "resources/read",
    params: {
      uri: "file:///example.txt"
    }
  },
  ReadResourceResultSchema
);
}
main();