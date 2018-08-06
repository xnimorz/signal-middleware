import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import signalMiddleware from "signal-middleware";

import comments from "../models/comments";
import areas from "../models/areas";
import switcher from "../models/switcher";

const middlewares = [logger, signalMiddleware];

export default function configureStore() {
  const store = createStore();    
}
