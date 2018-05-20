// Reactions store
const reactions = {};

/**
 * Add reaction to definite signal
 * @param {String} signalName signal name
 * @param {Function} signalReaction signal handler
 */
export const addReaction = (signalName, signalReaction) => {
  reactions[signalName] = signalReaction;
};

/**
 * Signal-Middleware.
 * Signal Action example:
 * {
 *   signal: String,
 *   payload: {your data is here}
 *   promise: [OPTIONAL] Promise,
 *   signalResolver: { resolve: _resolve, reject: _reject }
 * }
 */
export default ({ getState, dispatch }) => next => action => {
  if (!action.signal) {
    return next(action);
  }

  if (!reactions[action.signal]) {
    throw new Error(`There is no handler for ${action.signal} signal`, action);
  }

  const promise = new Promise((resolve, reject) => {
    reactions[action.signal]({ getState, dispatch }, action.payload, {
      resolve,
      reject
    });
  });

  return {
    ...action,
    promise
  };
};
