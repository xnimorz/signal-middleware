import React from "react";
import Code from "./Code";

export default function CommentsCode() {
  return (
    <Code>
      <strong>{`actions/comments.js:`}</strong>
      {`
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

`}
      <strong>{`models/comments.js:`}</strong>
      {`
`}
      <strong>{`
addReaction(ADD_COMMENT_SIGNAL, ({ getState, dispatch }, payload, signalResolver) => {`}</strong>
      {`
  // You can dispatch as many actions 
  // in signalMiddleware as you need      
  dispatch(requestComment());    
  
  // Simulate async request
  setTimeout(() => {
    // Simulate server work:
    const comments = getState().comments.data;
    const newId = Math.max(...comments.map(comment => comment.id), 0) + 1;

    // You can resolve or reject signalAction and 
    // handle promise in view layer 
    // (look to AddComment.js component)`}
      <strong>{`
    signalResolver.resolve();`}</strong>
      {`

    // Dispatch new action
    dispatch(receiveComment({ id: newId, text: payload }));
    
  }, Math.random() * 2000);
});

`}
      <strong>{`components/AddComments.js (only onClick handler):`}</strong>
      {`

addComment = () => {
  // We wrap our signal action with promise,
  // so we can clear field after async request comes from server
  this.props
    .addComment(this.textArea.current.value)
    `}
      <strong>{`.promise.then(`}</strong>
      {`() => (this.textArea.current.value = ""));
};

`}
    </Code>
  );
}
