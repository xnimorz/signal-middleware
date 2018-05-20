export const FETCH_AREAS_SIGNAL = "FETCH_AREAS_SIGNAL";
export const RECEIVE_AREAS = "RECEIVE_AREAS";
export const REQUEST_AREAS = "REQUEST_AREAS";
export const CLEAR_AREAS = "CLEAR_AREAS";

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

export const clearAreas = () => ({
  type: CLEAR_AREAS
});
