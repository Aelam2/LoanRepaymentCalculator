import { combineReducers } from "redux";
import siteReducer, { DEFAULT_STATE as defaultSiteState } from "./site";
import authReducer, { DEFAULT_STATE as defaultAuthState } from "./auth";
import userReducer, { DEFAULT_STATE as defaultUserState } from "./user";
import dashboardReducer, { DEFAULT_STATE as defaultDashboardState } from "./dashboard";
import paymentScheduleReducer, { DEFAULT_STATE as defaultPaymentScheduleState } from "./paymentSchedule";

let appReducer = combineReducers({
  site: siteReducer,
  auth: authReducer,
  user: userReducer,
  dashboard: dashboardReducer,
  paymentSchedule: paymentScheduleReducer
});

let rootReducer = (state, action) => {
  if (action.type === "CLEAR_STORE") {
    let { site } = state;
    state = { site };
  }

  return appReducer(state, action);
};

export default rootReducer;

export { defaultSiteState, defaultAuthState, defaultUserState, defaultDashboardState, defaultPaymentScheduleState };
