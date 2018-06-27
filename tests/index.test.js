import signalMiddleware, { addReaction } from "../src/index";
import CancelError from "../src/cancelError";

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
        actionHandler({
          signal: signalName,
          payload
        });
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
    describe("dispatch", () => {
      const actionHandler = nextHandler(action => action);

      test("must return action if action is a plain redux action", () => {
        const testData = { type: "SOME_ACTION", payload: { foo: "bar" } };

        expect(actionHandler(testData)).toEqual(testData);
      });
      test("must return action with promise field if action is a signal action", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", () => {});

        const returnedValue = actionHandler(testData);
        expect(returnedValue.signal).toEqual(testData.signal);
        expect(returnedValue.payload).toEqual(testData.payload);
        expect(returnedValue.promise instanceof Promise).toBe(true);
      });

      test("dispatch must return a new object", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", () => {});

        const returnedValue = actionHandler(testData);
        expect(returnedValue).not.toEqual(testData);
      });

      test("dispatch must not mutate argument", () => {
        const Obj = { a: 1 };
        const Obj2 = { a: 1 };
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", () => {});

        const returnedValue = actionHandler(testData);

        expect(returnedValue).not.toEqual(Obj);
        expect(Obj).toEqual(Obj2);
      });
    });
    describe("signalResolver", () => {
      const actionHandler = nextHandler(action => action);
      test("must rejects promise if signal action calls reject", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", (store, action, signalResolver) => {
          signalResolver.reject("reason");
        });

        const returnedValue = actionHandler(testData);

        expect(returnedValue.promise).rejects.toBe("reason");
      });
      test("must resolves promise if signal action calls resolve", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", (store, action, signalResolver) => {
          signalResolver.resolve("value");
        });

        const returnedValue = actionHandler(testData);

        expect(returnedValue.promise).resolves.toBe("value");
      });
    });
    describe("action with cancelType", () => {
      const actionHandler = nextHandler(action => action);
      test("must return action as usual", () => {
        const testData = {
          signal: "SIGNAL_ACTION_WITH_CANCEL_TYPE",
          payload: { foo: "bar" },
          cancelType: "page"
        };

        addReaction("SIGNAL_ACTION_WITH_CANCEL_TYPE", (store, action) => {
          expect(action).toEqual(testData);
        });

        const returnedValue = actionHandler(testData);

        expect(returnedValue.signal).toEqual(testData.signal);
        expect(returnedValue.payload).toEqual(testData.payload);
        expect(returnedValue.cancelType).toEqual(testData.cancelType);
        expect(returnedValue.promise instanceof Promise).toBe(true);
      });

      test("must cancel previous dispatch from signal action processing, if another action with same cancelType has called", done => {
        expect.assertions(3);

        const testData = {
          signal: "SINGAL",
          payload: { foo: "bar" },
          cancelType: "page"
        };

        addReaction("SINGAL", ({ dispatch }, action) => {
          process.nextTick(() => {
            try {
              dispatch({ type: "STANDART_ACTION" });
              done();
            } catch (e) {
              expect(e instanceof CancelError).toEqual(true);
              expect(e.isCancelledByType).toBe(true);
              expect(e.cancelType).toBe("page");
            }
          });
        });

        actionHandler(testData);
        actionHandler(testData);
      });
    });
  });
});
