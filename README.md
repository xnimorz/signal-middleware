# Signal Middleware

Signal Middleware for Redux.
Example: https://xnimorz.github.io/signal-middleware

```
npm install --save signal-middleware
```

or

```
yarn add signal-middleware
```

Signal-middleware is created to give an abstraction.
In general, application can be divided into 3 parts:

* view logic
* business logic
* data logic

Signal action provides information between view and business layers.
Classic action provides information between business and data layers.
Also you can always dispatch classic action from your view layer if no async actions are needed.

Here is an image to represent the work:

![MVC using signal-middleware](https://raw.githubusercontent.com/xnimorz/signal-middleware/master/resources/layers.png)

The business logic here is representented by signal-middleware reactions.

# Usage:

1.  Import signalMiddleware to your store initialization file and add signalMiddleware to the list of middlewares:

```javascript
import { createStore, applyMiddleware, combineReducers } from "redux";
import signalMiddleware from "signal-middleware";

const middlewares = [signalMiddleware /* Your other middlewares */];

export default function configureStore() {
  const store = createStore(
    combineReducers({
      /* Your reducers */
    }),
    applyMiddleware(...middlewares)
  );
  return store;
}
```

2.  Create a signal action:

```javascript
export const SIGNAL_ACTION_KEY = "SIGNAL_ACTION_KEY";

export const signalActionCreator = data => ({
  signal: SIGNAL_ACTION_KEY,
  payload: data
});
```

3.  Add a reaction to the `SIGNAL_ACTION_KEY` signal:

```javascript
import { addReaction } from "signal-middleware";

addReaction(
  SIGNAL_ACTION_KEY,
  ({ getState, dispatch }, payload, signalResolver) => {
    // Paste your code here
    // Dispatch new action via dispatch
    // Get your current store state via getState
    // Your action data is in payload
    // You can resolve or reject a promise via signalResolver methods resolve and reject
  }
);
```

Signal-middleware adds abstraction between View and Data layers:

## Async actions

Signal-middleware allows you to create async functions:

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

## Getting state

Signal-middleware provides `{ dispatch, getState }` object as the first argument of your reaction. So you can get access to him.

Let's assume we shouldn't add todos which already have the same text:

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
// It's separate from view and data logic. View layer works with business logic through the signal actions, and business logic layer works with data logic through the classic actions.
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

## Async-await and business logic

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
// It's separate from view and data logic. View layer works with business logic through the signal actions, and business logic layer works with data logic through the classic actions.
addReaction(ADD_TODO, async ({ dispatch, getState }, { text }) => {
  try {
    // You can dispatch any number of actions
    dispatch(pendingTodo(result));
    const result = await axios.post(REMOTE_URL_FOR_TODOS, { text });
    dispatch(receiveTodo(result));
  } catch (e) {
    dispatch({ type: FAIL_TODO, payload: e });
  }
});
```

The last example shows us how we can implement the business logic using `signal-middleware`

# Completed example

### Postpone callback after async request completes

When you write a comment you should clear the text field after server request completes. At the moment you don't know about future id of the comment, so you would add a callback after server request completes. When you use signal-middleware and dispatch a signal action it wraps the signal action with a promise. In reaction you can resolve or reject this promise. And your view layer can subscribe to the promise using `then`. You can see it in our example https://github.com/xnimorz/signal-middleware/master/examples/src/components/AddComment.js

Let's write a file with actions and actionCreators:

```javascript
// actions/comments.js

export const ADD_COMMENT_SIGNAL = "ADD_COMMENT_SIGNAL";
export const RECEIVE_NEW_COMMENT = "RECEIVE_NEW_COMMENT";
export const REQUEST_ADD_COMMENT = "REQUEST_ADD_COMMENT";

export const addComment = comment => ({
  signal: ADD_COMMENT_SIGNAL,
  payload: comment
});

export const receiveComment = comments => ({
  type: RECEIVE_NEW_COMMENT,
  payload: comments
});

export const requestComment = () => ({
  type: REQUEST_ADD_COMMENT
});
```

Now we can handle `ADD_COMMENT_SIGNAL` using addReaction:

```javascript
// models/comments.js
import { DIRTY, FETCH, CLEAR } from "../constants/status";
import axios from "axios";
import {
  RECEIVE_NEW_COMMENT,
  REQUEST_ADD_COMMENT,
  ADD_COMMENT_SIGNAL,
  receiveComment,
  requestComment
} from "../actions/comments";

import { addReaction } from "signal-middleware";

addReaction(
  ADD_COMMENT_SIGNAL,
  ({ getState, dispatch }, payload, signalResolver) => {
    // You can dispatch as many actions in signalMiddleware as you need
    dispatch(requestComment());

    axios.post("/url/to/comments", { comment: payload }).then(result => {
      // You can resolve or reject signalAction and
      // handle promise in view layer (look to AddComment.js component)
      signalResolver.resolve();
      // Dispatch new action to store
      dispatch(receiveComment({ id: newId, text: payload }));
    });
  }
);

export default function comments(state = { status: DIRTY, data: [] }, action) {
  switch (action.type) {
    case REQUEST_ADD_COMMENT: {
      return {
        ...state,
        status: FETCH
      };
    }
    case RECEIVE_NEW_COMMENT: {
      return {
        status: CLEAR,
        data: [action.payload, ...state.data]
      };
    }
    default:
      return state;
  }
}
```

In view layer we can handle a promise:

```javascript
import React, { PureComponent } from "react";
import { connect } from "react-redux";

import TextArea from "./TextArea";
import Button from "./Button";

import { addComment } from "../actions/comments";

class AddComment extends PureComponent {
  textArea = React.createRef();

  addComment = () => {
    // We wrap our signal action with promise,
    // so we can clear field after async request comes from server
    this.props
      .addComment(this.textArea.current.value)
      .promise.then(() => (this.textArea.current.value = ""));
  };

  render() {
    return (
      <div>
        <TextArea innerRef={this.textArea} />
        <Button onClick={this.addComment}>Add comment</Button>
      </div>
    );
  }
}

export default connect(null, { addComment })(AddComment);
```

# Motivation

Nowadays, building complicated frontend application requires a plenty of business logic with server requests and so on.
You can use middlewares such as `redux-thunk` to implement `async actions creator`. However after a definite time interval it would be complicated to work with tons of code in `action creators`. For example, if you want to show an alert to user, when he clicks the button, you wouldn't patch browser engine code, you just add some logic to your own project. You can relate to `action` similarly. `Actions` in redux application are similar to events in browser. Consequently, if some event (`action`) in your project is triggered, you have a reaction for the `action`. The main goal of `signal-middleware` is to give an abstraction for the implementation of a separate business logic.

Some more information about middlewares you can find in a lecture (Russian lang): https://docs.google.com/presentation/d/1qFTB--HrXCU0_nVQ_T4ZlB9CsiXpXQsASc14pctoggA/edit?usp=sharing

# License

MIT
