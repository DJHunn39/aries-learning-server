import { ConnectionEventTypes, DidExchangeState } from "@aries-framework/core";

export const setupConnectionListener = (agent, outOfBandRecord, cb) => {
  agent.events.on(
    ConnectionEventTypes.ConnectionStateChanged,
    ({ payload }) => {
      if (payload.connectionRecord.outOfBandId !== outOfBandRecord.id) return;
      if (payload.connectionRecord.state === DidExchangeState.Completed) {
        // the connection is now ready for usage in other protocols!
        console.log(
          `Connection for out-of-band id ${outOfBandRecord.id} completed`
        );

        // Custom business logic can be included here
        // In this example we can send a basic message to the connection, but
        // anything is possible
        return cb();
      }
    }
  );
};
