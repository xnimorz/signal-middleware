import signalMiddleware, { addReaction } from "../src/index";

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
        const callback = ({ dispatch, getState }, payload) => {
          expect(typeof dispatch).toBe("function");
          expect(typeof getState).toBe("function");
          expect(payload).toEqual(payload);
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

      test("must return data, that returned from signal handler", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", () => "data");

        const returnedValue = actionHandler(testData);
        expect(returnedValue).toBe("data");
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

    describe("return data from signal handler", () => {
      const actionHandler = nextHandler(action => action);

      test("Must return any data from signal handler", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", (store, action) => {
          return "some data";
        });

        const returnedValue = actionHandler(testData);

        expect(returnedValue).toEqual("some data");
      });

      test("must handle promise rejection", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", (store, action) => {
          return Promise.reject("reason");
        });

        const returnedValue = actionHandler(testData);

        expect(returnedValue).rejects.toBe("reason");
      });

      test("must handle promise if signal action returns resolved promise", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction("SOME_SIGNAL_ACTION", (store, action, signalResolver) => {
          return Promise.resolve("value");
        });

        const returnedValue = actionHandler(testData);

        expect(returnedValue).resolves.toBe("value");
      });

      test("must corretly handle async-await functoins (just for example)", () => {
        const testData = {
          signal: "SOME_SIGNAL_ACTION",
          payload: { foo: "bar" }
        };

        addReaction(
          "SOME_SIGNAL_ACTION",
          async (store, action, signalResolver) => {
            return "value";
          }
        );

        const returnedValue = actionHandler(testData);

        expect(returnedValue).resolves.toBe("value");
      });
    });
  });
});
