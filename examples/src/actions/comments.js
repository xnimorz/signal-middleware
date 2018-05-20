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
