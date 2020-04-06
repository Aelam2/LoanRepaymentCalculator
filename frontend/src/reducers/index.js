import { combineReducers } from "redux";
import siteReducer, { DEFAULT_STATE as defaultSiteState } from "./site";
import authReducer, { DEFAULT_STATE as defaultAuthState } from "./auth";
import userReducer, { DEFAULT_STATE as defaultUserState } from "./user";
import dashboardReducer, { DEFAULT_STATE as defaultDashboardState } from "./dashboard";

export default combineReducers({
  site: siteReducer,
  auth: authReducer,
  user: userReducer,
  dashboard: dashboardReducer
});

export { defaultSiteState, defaultAuthState, defaultUserState, defaultDashboardState };
