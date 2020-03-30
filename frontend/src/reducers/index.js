import { combineReducers } from "redux";
import authReducer, { DEFAULT_STATE as defaultAuthState } from "./auth";

export default combineReducers({
  auth: authReducer
});

export { defaultAuthState }
