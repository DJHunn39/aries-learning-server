import { KeyType, TypedArrayEncoder } from "@aries-framework/core";

export const registerTestCredential = async (agent) => {
  // Import a DID with Indy VDR into the wallet
  const seed = TypedArrayEncoder.fromString(process.env.WALLET_SEED); // What I input on bcovrin. Should be kept secure in production!
  const unqualifiedIndyDid = process.env.DID; // What was returned after registering seed on bcovrin
  const indyDid = `did:indy:bcovrin:test:${unqualifiedIndyDid}`;

  await agent.dids.import({
    did: indyDid,
    overwrite: true,
    privateKeys: [
      {
        privateKey: seed,
        keyType: KeyType.Ed25519,
      },
    ],
  });

  // Register a very basic schema (just one attribute) associated to an issuer DID
  const schemaResult = await agent.modules.anoncreds.registerSchema({
    schema: {
      attrNames: ["name"],
      issuerId: indyDid,
      name: "Example Schema to register",
      version: "1.0.0",
    },
    options: {},
  });

  if (schemaResult.schemaState.state === "failed") {
    throw new Error(
      `Error creating schema: ${schemaResult.schemaState.reason}`
    );
  }

  // Register credential definition using the schema we just registered
  const credentialDefinitionResult =
    await agent.modules.anoncreds.registerCredentialDefinition({
      credentialDefinition: {
        tag: "default",
        issuerId: indyDid,
        schemaId: schemaResult.schemaState.schemaId,
      },
      options: {},
    });

  if (credentialDefinitionResult.credentialDefinitionState.state === "failed") {
    throw new Error(
      `Error creating credential definition: ${credentialDefinitionResult.credentialDefinitionState.reason}`
    );
  }
  return credentialDefinitionResult;
};
