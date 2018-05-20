import { DIRTY, FETCH, CLEAR } from "../constants/status";
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

    // Simulate async request
    setTimeout(() => {
      // Simulate server work:
      const comments = getState().comments.data;
      const newId = Math.max(...comments.map(comment => comment.id), 0) + 1;

      // You can resolve or reject signalAction and
      // handle promise in view layer (look to AddComment.js component)
      signalResolver.resolve();

      // Dispatch new action
      dispatch(receiveComment({ id: newId, text: payload }));
    }, Math.random() * 2000);
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
