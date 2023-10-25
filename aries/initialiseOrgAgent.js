import { AskarModule } from "@aries-framework/askar";
import { ariesAskar } from "@hyperledger/aries-askar-nodejs";
import { Agent } from "@aries-framework/core";
import { agentDependencies } from "@aries-framework/node";
import {
  HttpOutboundTransport,
  WsOutboundTransport,
  ConnectionsModule,
} from "@aries-framework/core";
import { HttpInboundTransport } from "@aries-framework/node";

export const initialiseOrgAgent = async () => {
  // Simple agent configuration. This sets some basic fields like the wallet
  // configuration and the label.
  const config = {
    label: "demo-agent-org",
    walletConfig: {
      id: "mainOrgWallet3939",
      key: "demoagentorg0000000000000000000",
    },
    endpoints: ["http://localhost:3001"],
  };

  // A new instance of an agent is created here
  // Askar can also be replaced by the indy-sdk if required
  const agent = new Agent({
    config,
    modules: {
      askar: new AskarModule({ ariesAskar }),
      connections: new ConnectionsModule({ autoAcceptConnections: true }),
    },
    dependencies: agentDependencies,
  });

  // Register a simple `WebSocket` outbound transport
  agent.registerOutboundTransport(new WsOutboundTransport());

  // Register a simple `Http` outbound transport
  agent.registerOutboundTransport(new HttpOutboundTransport());

  // Register a simple `Http` inbound transport
  agent.registerInboundTransport(new HttpInboundTransport({ port: 3001 }));

  // Initialize the agent
  await agent.initialize();

  return agent;
};
