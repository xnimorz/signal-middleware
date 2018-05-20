import { SWITCH_VIEW } from "../actions/switcher";
import { COMMENTS, AREAS } from "../constants/viewKinds";

export default function switcher(state = COMMENTS, action) {
  switch (action.type) {
    case SWITCH_VIEW:
      return action.payload;

    default:
      return state;
  }
}
