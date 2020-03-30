import { USER_SIGN_UP_SUCCESS, USER_SIGN_UP_LOADING, USER_SIGN_UP_ERROR } from "actions/types";
import { USER_SIGN_IN_SUCCESS, USER_SIGN_IN_LOADING, USER_SIGN_IN_ERROR } from "actions/types";
import { USER_SIGN_OUT_SUCCESS } from "actions/types";

const DEFAULT_STATE = {
  isAuthenticated: false,
  token: "",
  signUp: {
    error: false,
    loading: false
  },
  signIn: {
    error: false,
    loading: false
  }
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case USER_SIGN_UP_SUCCESS:
      return {
        ...DEFAULT_STATE,
        isAuthenticated: true,
        token: action.payload
      };

    case USER_SIGN_UP_LOADING:
      return {
        ...state,
        signUp: {
          ...state.signUp,
          loading: action.payload
        }
      };

    case USER_SIGN_UP_ERROR:
      return {
        ...state,
        signUp: {
          loading: false,
          error: action.payload
        }
      };

    case USER_SIGN_IN_SUCCESS:
      return {
        ...DEFAULT_STATE,
        isAuthenticated: true,
        token: action.payload
      };

    case USER_SIGN_IN_LOADING:
      return {
        ...state,
        signIn: {
          ...state.signIn,
          loading: action.payload
        }
      };

    case USER_SIGN_IN_ERROR:
      return {
        ...state,
        signIn: {
          loading: false,
          error: action.payload
        }
      };
    case USER_SIGN_OUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        token: action.payload
      };

    default:
      return state;
  }
};

export { DEFAULT_STATE };
