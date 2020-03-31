import { USER_CHANGE_LOCALE_SUCCESS } from "actions/types";

const DEFAULT_STATE = {
  user: {},
  settings: {
    locale: ""
  }
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case USER_CHANGE_LOCALE_SUCCESS:
      return {
        ...state,
        settings: {
          ...state.settings,
          locale: action.payload
        }
      };

    default:
      return state;
  }
};

export { DEFAULT_STATE };
