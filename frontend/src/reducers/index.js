import { combineReducers } from "redux";
import authReducer, { DEFAULT_STATE as defaultAuthState } from "./auth";
import userReducer, { DEFAULT_STATE as defaultUserState } from "./user";

export default combineReducers({
  auth: authReducer,
  user: userReducer
});

export { defaultAuthState, defaultUserState };
