import { initialiseOrgAgent } from "./aries/initialiseOrgAgent";
import { createNewInvitation } from "./aries/createNewInvitation";

const onConnection = () =>
  console.log(
    "We now have an active connection to use in the following tutorials"
  );

const startServer = async () => {
  console.log("Init Aries agent");
  const agent = await initialiseOrgAgent();

  console.log("Creating invite for new credential");
  const { outOfBandRecord, invitationUrl } = await createNewInvitation(agent); // how to get the URL into the RN app

  console.log(invitationUrl);

  console.log("Listening for connection changes...");
  setupConnectionListener(acmeAgent, outOfBandRecord, onConnection);
};

export default startServer();

startServer();
