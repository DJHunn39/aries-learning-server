import "dotenv/config";
import { initialiseOrgAgent } from "./aries/initialiseOrgAgent.js";
import { createNewInvitation } from "./aries/createNewInvitation.js";
import { setupConnectionListener } from "./aries/setupConnectionListener.js";
import { registerTestCredential } from "./aries/registerTestCredential.js";

const onConnection = () =>
  console.log(
    "We now have an active connection to use in the following tutorials"
  );

const startServer = async () => {
  console.log("Init Aries agent");
  const agent = await initialiseOrgAgent();

  console.log("Registering credential definition");
  await registerTestCredential(agent);

  console.log("Creating invite for new credential");
  const { outOfBandRecord, invitationUrl } = await createNewInvitation(agent);

  console.log(invitationUrl);

  console.log("Listening for connection changes...");
  setupConnectionListener(agent, outOfBandRecord, onConnection);
};

export default startServer;

startServer();
