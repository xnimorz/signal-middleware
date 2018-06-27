import enhanceDispatchWithCancellationToken from "../src/enhancedDispatcher";
import CancelError from "../src/cancelError";

describe("enhanceDispatchWithCancellationToken", () => {
  test("must return a wrapper to dispatch method", () => {
    const testAction = { type: "TEST" };

    const dispatch = enhanceDispatchWithCancellationToken(
      action => {
        expect(action).toEqual(testAction);
      },
      {
        cancelType: "page",
        signal: "EXAMPLE"
      }
    );

    dispatch(testAction);
  });

  test("must cancel if another action with same cancelType has called", () => {
    const testAction = { type: "TEST" };

    const dispatch = enhanceDispatchWithCancellationToken(action => {}, {
      cancelType: "page",
      signal: "EXAMPLE"
    });

    const latestDispatch = enhanceDispatchWithCancellationToken(
      action => {
        expect(action).toEqual(testAction);
      },
      {
        cancelType: "page",
        signal: "ANOTHER_SIGNAL"
      }
    );

    try {
      dispatch(testAction);
    } catch (e) {
      expect(e instanceof CancelError).toEqual(true);
      expect(e.isCancelledByType).toBe(true);
      expect(e.cancelType).toBe("page");
    }

    latestDispatch(testAction);
  });
});
