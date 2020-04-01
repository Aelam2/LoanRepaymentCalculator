import { DASHBOARD_ADD_EDIT_DRAWER_TOGGLE } from "./types";

export const toggleAddEditDrawer = (visible, item) => {
  return dispatch => {
    dispatch({ type: DASHBOARD_ADD_EDIT_DRAWER_TOGGLE, payload: { visible, item } });
    return true;
  };
};
