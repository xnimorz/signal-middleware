import { DIRTY, FETCH, CLEAR } from "../constants/status";
import {
  FETCH_AREAS_SIGNAL,
  REQUEST_AREAS,
  RECEIVE_AREAS,
  CLEAR_AREAS,
  receiveAreas,
  requestAreas
} from "../actions/areas";

import axios from "axios";
import { addReaction } from "signal-middleware";

addReaction(FETCH_AREAS_SIGNAL, async ({ dispatch }, payload) => {
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
    case CLEAR_AREAS: {
      return {
        status: DIRTY,
        data: []
      };
    }
    default:
      return state;
  }
}
