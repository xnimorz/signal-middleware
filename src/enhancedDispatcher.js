import CancelError from "./cancelError";

// Dict stores all the latests identifiers of signals
const cancelGroups = {};

export default function enhanceDispatchWithCancellationToken(dispatch, action) {
  // We use new object, because object would never be equal with another object ({} !== {})
  const uniqueIdentifier = {};
  // Actualize the latest identifier by cancelToken
  cancelGroups[action.cancelType] = uniqueIdentifier;

  return (...args) => {
    // If actual identifier changed, we should cancel the dispatch processing.
    if (cancelGroups[action.cancelType] !== uniqueIdentifier) {
      throw new CancelError({
        message:
          "Another signal action with the same cancelType has dispatched",
        cancelType: action.cancelType,
        isCancelledByType: true
      });
    }

    return dispatch(...args);
  };
}
