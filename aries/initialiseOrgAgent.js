import { AskarModule } from "@aries-framework/askar";
import { ariesAskar } from "@hyperledger/aries-askar-nodejs";
import { Agent } from "@aries-framework/core";
import { agentDependencies } from "@aries-framework/node";
import {
  HttpOutboundTransport,
  WsOutboundTransport,
  ConnectionsModule,
  DidsModule,
} from "@aries-framework/core";
import { HttpInboundTransport } from "@aries-framework/node";
import {
  IndyVdrAnonCredsRegistry,
  IndyVdrIndyDidRegistrar,
  IndyVdrIndyDidResolver,
  IndyVdrModule,
} from "@aries-framework/indy-vdr";
import { indyVdr } from "@hyperledger/indy-vdr-nodejs";
import { AnonCredsModule } from "@aries-framework/anoncreds";
import { AnonCredsRsModule } from "@aries-framework/anoncreds-rs";
import { anoncreds } from "@hyperledger/anoncreds-nodejs";

import { genesisTransactions } from "./genesisTransactions.js";

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
    logger: console,
  };

  // A new instance of an agent is created here
  const agent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({ ariesAskar }), // The wallet
      connections: new ConnectionsModule({ autoAcceptConnections: true }), // To allow us to set up connections
      anoncredsRs: new AnonCredsRsModule({
        anoncreds,
      }),
      indyVdr: new IndyVdrModule({
        indyVdr,
        networks: [
          {
            isProduction: false,
            indyNamespace: "bcovrin:test",
            genesisTransactions,
            connectOnStartup: true,
          },
        ],
      }),
      anoncreds: new AnonCredsModule({
        registries: [new IndyVdrAnonCredsRegistry()],
      }),
      dids: new DidsModule({
        registrars: [new IndyVdrIndyDidRegistrar()],
        resolvers: [new IndyVdrIndyDidResolver()],
      }),
    },
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
