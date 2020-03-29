import { USER_SIGN_UP_SUCCESS, USER_SIGN_UP_LOADING, USER_SIGN_UP_ERROR } from "actions/types";
import { USER_SIGN_IN_SUCCESS, USER_SIGN_IN_LOADING, USER_SIGN_IN_ERROR } from "actions/types";

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
  switch (action) {
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
          ...state.signUp,
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
          ...state.signIn,
          error: action.payload
        }
      };

    default:
      return state;
  }
};
