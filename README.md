### Signal Middleware

Signal Middleware for Redux.

```
npm install --save signal-middleware
```

or

```
yarn add signal-middleware
```

## Usage:

Signal-middleware adds abstraction between View and Data-logic layers:

# Async actions

Signal-middleware allows you create async functions:

```javascript
import signalMiddleware, { addReaction } from "signal-middleware";

const ADD_TODO = "ADD_TODO";
const RECEIVE_TODO = "RECEIVE_TODO";

// Signal Action is an action that has `signal` field instead of `type`
const addTodoSignal = text => ({
  signal: ADD_TODO,
  payload: { text }
});

// Classic action works with store
const receiveTodo = text => ({
  type: RECEIVE_TODO,
  payload: { text }
});

// Add reaction to ADD_TODO signal
addReaction(ADD_TODO, ({ dispatch }, { text }) => {
  setTimeout(() => {
    // Here we can invoke actions using dispatch
    dispatch(receiveTodo(text));
  }, 1000);
});
```

# Getting state

Signal-middleware provide `{ dispatch, getState }` object as the first argument of your reaction. So you can get access to him.

Let's assume we shouldn't add todos which already have same text:

```javascript
import signalMiddleware, { addReaction } from "signal-middleware";

const ADD_TODO = "ADD_TODO";
const RECEIVE_TODO = "RECEIVE_TODO";

// Signal Action is an action that has `signal` field instead of `type`
const addTodoSignal = text => ({
  signal: ADD_TODO,
  payload: { text }
});

// Classic action works with store
const receiveTodo = text => ({
  type: RECEIVE_TODO,
  payload: { text }
});

// Reactions are the good place for your project business logic.
// It's separate from view and data-logic. View layer works with business logic through the signal actions, and business logic layer works with data logic through the classic actions.
addReaction(ADD_TODO, ({ dispatch, getState }, { text }) => {
  setTimeout(() => {
    // Getting our current state
    if (getState().todos.some(todo => todo.text === text)) {
      return;
    }
    // Here we can invoke actions using dispatch
    dispatch(receiveTodo(text));
  }, 1000);
});
```

# Async-await and business logic

Signal-middleware is created to give an abstraction.
In general, application can be divided into 3 parts:

* view logic
* business
* data

Signal action provide information between view and business layers.
Classic action provide information between business and data layers.
Also you always can dispatch classic action from your view layer if no async actions are needed.

Here is an image to represent the work:

![MVC using signal-middleware](https://raw.githubusercontent.com/xnimorz/signal-middleware/master/resources/layers.png)

The business logic here is representented by signal-middleware reactions.

Let's add to our example some async logic and errors handling:

```javascript
import signalMiddleware, { addReaction } from "signal-middleware";

const ADD_TODO = "ADD_TODO";
const RECEIVE_TODO = "RECEIVE_TODO";
const PENDING_TODO = "PENDING_TODO";
const FAIL_TODO = "FAIL_TODO";

// Signal Action is an action that has `signal` field instead of `type`
const addTodoSignal = text => ({
  signal: ADD_TODO,
  payload: { text }
});

// Classic action works with store
const receiveTodo = text => ({
  type: RECEIVE_TODO,
  payload: { text }
});

const pendingTodo = () => ({
  type: PENDING_TODO
});

// Reactions are the good place for your project business logic.
// It's separate from view and data-logic. View layer works with business logic through the signal actions, and business logic layer works with data logic through the classic actions.
addReaction(ADD_TODO, async ({ dispatch, getState }, { text }) => {
  try {
    // You can dispatch any amount of actions
    dispatch(pendingTodo(result));
    const result = await axios.post(REMOTE_URL_FOR_TODOS, { text });
    dispatch(receiveTodo(result));
  } catch (e) {
    dispatch({ type: FAIL_TODO, payload: e });
  }
});
```

The last example shows us how we can implement the business logic using `signal-middleware`

## Motivation

In our days, building complicated frontend application requires a plenty of business logic with server request and so on.
You can use middlewares such as `redux-thunk` to implement `async actions creator`. However after a definite time interval it would be complicated to work with tons of code in `action creators`. For example, if you want to show an alert to user, when he clicks the button, you wouldn't patch browser engine code, you just add some logic to your own project. You can relate to `action` similarly. `Actions` in redux application is similar to events in browser. Consequently, if some event (`action`) in your project is triggered, you have a reaction for the `action`. The main goal of `signal-middleware` is to give an abstraction for the implementation of a separate business logic.

Some more information about middlewares you can find in my lecture: https://docs.google.com/presentation/d/1qFTB--HrXCU0_nVQ_T4ZlB9CsiXpXQsASc14pctoggA/edit?usp=sharing

## License

MIT
