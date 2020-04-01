import { combineReducers } from "redux";
import authReducer, { DEFAULT_STATE as defaultAuthState } from "./auth";
import userReducer, { DEFAULT_STATE as defaultUserState } from "./user";
import dashboardReducer, { DEFAULT_STATE as defaultDashboardState } from "./dashboard";

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  dashboard: dashboardReducer
});

export { defaultAuthState, defaultUserState, defaultDashboardState };
