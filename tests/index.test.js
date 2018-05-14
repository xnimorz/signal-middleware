import signalMiddleware, { addReaction } from "../src/index";
import { wrapPromise } from "../src/wrapPromise";

const storeStub = {
  getState: () => ({}),
  dispatch: action => {}
};

describe("signalMiddleware", () => {
  const nextHandler = signalMiddleware(storeStub);

  test("must return a function to handle next", () => {
    expect(typeof nextHandler).toBe("function");
  });

  describe("handle next", () => {
    it("must return a function to handle action", () => {
      const actionHandler = nextHandler();

      expect(typeof actionHandler).toBe("function");
    });

    describe("handle action with different action", () => {
      test("must pass action to next if there no signal field in the action", () => {
        const actionData = {};

        nextHandler(action => {
          expect(action).toEqual(actionData);
        })(actionData);
      });
      test("must pass action to next if there no Object", () => {
        const actionData = function() {};

        nextHandler(action => {
          expect(action).toEqual(actionData);
        })(actionData);
      });
      test("must return the return value of next if there no signal field in the action", () => {
        const actionData = "test";

        expect(nextHandler(action => action)(actionData)).toEqual(actionData);
      });
    });
    describe("handle signal action", () => {
      const actionHandler = nextHandler(() => {});

      test("must call function from its reactions list", () => {
        const signalName = "test";
        const callback = jest.fn();
        addReaction(signalName, callback);
        actionHandler({
          signal: signalName
        });
        expect(callback).toHaveBeenCalled();
      });

      test("must pass dispatch, setState and payload arguments to call function from its reactions list", () => {
        const signalName = "test";
        const payload = {};
        const callback = jest.fn();
        addReaction(signalName, callback);
        actionHandler({
          signal: signalName,
          payload
        });
        expect(callback).toHaveBeenCalledWith(storeStub, payload, undefined);
      });

      test("must pass dispatch, setState, payload and promiseResolve arguments to call function from its reactions list", () => {
        const signalName = "test";
        const payload = {};
        const callback = (
          { dispatch, getState },
          payload,
          { resolve, reject }
        ) => {
          expect(typeof dispatch).toBe("function");
          expect(typeof getState).toBe("function");
          expect(payload).toEqual(payload);
          expect(typeof resolve).toBe("function");
          expect(typeof reject).toBe("function");
        };
        addReaction(signalName, callback);
        actionHandler(
          wrapPromise({
            signal: signalName,
            payload
          })
        );
      });

      test("must call only nessesary reaction", () => {
        const callback = jest.fn();

        addReaction("first", () => {
          actionHandler({ signal: "second" });
        });

        addReaction("second", callback);

        addReaction("third", () => {
          // should not be called
          expect(true).toBe(false);
        });

        actionHandler({ signal: "first" });
        expect(callback).toHaveBeenCalled();
      });
    });
  });
});
