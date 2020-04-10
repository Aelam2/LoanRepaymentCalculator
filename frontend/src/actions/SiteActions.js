import { SITE_UPDATING_WINDOW_SIZE } from "actions/SiteActionTypes";

export const updateWindowSize = width => {
  return async dispatch => {
    try {
      // Set site width in store
      dispatch({ type: SITE_UPDATING_WINDOW_SIZE, payload: width });
      return width;
    } catch (err) {
      console.error("Error updating width! ===>", err.message);
      return false;
    }
  };
};
