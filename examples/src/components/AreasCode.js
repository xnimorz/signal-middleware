import React from "react";
import Code from "./Code";

export default function CommentsCode() {
  return (
    <Code>
      <strong>{`actions/areas.js:`}</strong>
      {`
export const FETCH_AREAS_SIGNAL = "FETCH_AREAS_SIGNAL";
export const RECEIVE_AREAS = "RECEIVE_AREAS";
export const REQUEST_AREAS = "REQUEST_AREAS";

export const fetchAreas = () => ({
  signal: FETCH_AREAS_SIGNAL
});

export const receiveAreas = areas => ({
  type: RECEIVE_AREAS,
  payload: areas
});

export const requestAreas = () => ({
  type: REQUEST_AREAS
}); 

`}
      <strong>{`models/areas.js:`}</strong>
      {`
`}
      <strong>{`
addReaction(FETCH_AREAS_SIGNAL, async ({ dispatch }, payload) => {`}</strong>
      {`
  
    // You can dispatch as many actions in signalMiddleware as you need
    dispatch(requestAreas());
  
    try {
      const { data } = await axios.get("https://api.hh.ru/areas?locale=EN");
      // receive result from server
      dispatch(receiveAreas(data));
    } catch (e) {
      // Here we can handle errors
    }
  });
  
  export default function areas(state = { status: DIRTY, data: [] }, action) {
    switch (action.type) {
      case REQUEST_AREAS: {
        return {
          ...state,
          status: FETCH
        };
      }
      case RECEIVE_AREAS: {
        return {
          status: CLEAR,
          data: action.payload
        };
      }
      default:
        return state;
    }
  }  

`}
    </Code>
  );
}
