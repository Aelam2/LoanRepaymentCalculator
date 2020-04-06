import { SITE_UPDATING_WINDOW_SIZE, USER_CHANGE_LOCALE_SUCCESS, USER_CHANGE_THEME_SUCCESS } from "actions/types";

const DEFAULT_STATE = {
  width: window.innerWidth,
  isMobile: window.innerWidth < 940,
  locale: "",
  theme: "light",
  currency: "USD"
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case SITE_UPDATING_WINDOW_SIZE:
      return {
        ...state,
        width: action.payload,
        isMobile: action.payload < 940
      };

    case USER_CHANGE_LOCALE_SUCCESS:
      return {
        ...state,
        locale: action.payload
      };

    case USER_CHANGE_THEME_SUCCESS:
      return {
        ...state,
        theme: action.payload
      };

    default:
      return state;
  }
};

export { DEFAULT_STATE };
