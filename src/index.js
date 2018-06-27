import enhanceDispatchWithCancellationToken from "./enhancedDispatcher";

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
 *   promise: Promise,
 *   signalResolver: { resolve: _resolve, reject: _reject }
 *   cancelType: [OPTIONAL] String
 * }
 */
export default ({ getState, dispatch }) => next => action => {
  if (!action.signal) {
    return next(action);
  }

  if (!reactions[action.signal]) {
    throw new Error(`There is no handler for ${action.signal} signal`, action);
  }

  let dispatchMethod = dispatch;

  // We should enhance dispatch method only for signal actions with cancelType string
  if (action.cancelType) {
    dispatchMethod = enhanceDispatchWithCancellationToken(dispatch, action);
  }

  const promise = new Promise((resolve, reject) => {
    reactions[action.signal]({ getState, dispatch: dispatchMethod }, action, {
      resolve,
      reject
    });
  });

  return {
    ...action,
    promise
  };
};
