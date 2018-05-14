import { wrapPromise } from "../src/wrapPromise";
import { wrap } from "module";

describe("wrapPromise", () => {
  test("must return new object", () => {
    const Obj = {};
    expect(wrapPromise(Obj)).not.toEqual(Obj);
  });
  test("must not mutate argument", () => {
    const Obj = { a: 1 };
    const Obj2 = { a: 1 };
    expect(wrapPromise(Obj)).not.toEqual(Obj);
    expect(Obj).toEqual(Obj2);
  });
  test("must return new object with 2 additional fields: promise and signalResolver", () => {
    const Obj = {};
    const wrapped = wrapPromise(Obj);
    expect(wrapped.promise instanceof Promise).toBeTruthy();
    expect(typeof wrapped.signalResolver.resolve).toBe("function");
    expect(typeof wrapped.signalResolver.reject).toBe("function");
  });
  describe("signalResolver", () => {
    test("must resolves promise", () => {
      const Obj = {};
      const wrapped = wrapPromise(Obj);
      wrapped.signalResolver.resolve("test");
      expect(wrapped.promise).resolves.toBe("test");
    });
    test("must rejects promise", () => {
      const Obj = {};
      const wrapped = wrapPromise(Obj);
      wrapped.signalResolver.reject("test");
      expect(wrapped.promise).rejects.toBe("test");
    });
  });
});
