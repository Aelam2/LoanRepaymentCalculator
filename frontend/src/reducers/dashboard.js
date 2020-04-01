import { DASHBOARD_ADD_EDIT_DRAWER_TOGGLE } from "actions/types";

const DEFAULT_STATE = {
  drawer: {
    visible: false,
    item: "loans"
  },

  loans: {
    data: [],
    loading: false,
    error: false
  },

  paymentPlans: {
    data: [],
    loading: false,
    error: false
  }
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case DASHBOARD_ADD_EDIT_DRAWER_TOGGLE:
      return {
        ...state,
        drawer: {
          ...state.drawer,
          visible: action.payload.visible,
          item: action.payload.item
        }
      };

    default:
      return state;
  }
};

export { DEFAULT_STATE };
