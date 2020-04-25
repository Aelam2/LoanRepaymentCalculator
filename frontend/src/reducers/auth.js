import { USER_SIGN_UP_SUCCESS, USER_SIGN_UP_LOADING, USER_SIGN_UP_ERROR } from "actions/types";
import { USER_SIGN_IN_SUCCESS, USER_SIGN_IN_LOADING, USER_SIGN_IN_ERROR } from "actions/types";
import { USER_SIGN_OUT_SUCCESS } from "actions/types";
import { USER_SEND_PASSWORD_RESET_SUCCESS, USER_SEND_PASSWORD_RESET_LOADING, USER_SEND_PASSWORD_RESET_ERROR } from "actions/UserActionTypes";
import { USER_FETCH_RESET_DETAILS_SUCCESS, USER_FETCH_RESET_DETAILS_LOADING, USER_FETCH_RESET_DETAILS_ERROR } from "actions/UserActionTypes";
import { USER_SET_NEW_PASSWORD_SUCCESS, USER_SET_NEW_PASSWORD_LOADING, USER_SET_NEW_PASSWORD_ERROR } from "actions/UserActionTypes";

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
  },
  resetEmailForm: {
    loading: false,
    success: false,
    error: false,
    message: null
  },
  resetPasswordForm: {
    data: {},
    loading: true,
    success: false,
    error: false,
    errorMessage: null
  },
  resetPasswordFormSubmit: {
    loading: false,
    success: false,
    error: false,
    errorMessage: null
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
        ...DEFAULT_STATE,
        signUp: {
          ...state.signUp,
          loading: action.payload
        }
      };

    case USER_SIGN_UP_ERROR:
      return {
        ...DEFAULT_STATE,
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
        ...DEFAULT_STATE,
        signIn: {
          ...state.signIn,
          loading: action.payload
        }
      };

    case USER_SIGN_IN_ERROR:
      return {
        ...DEFAULT_STATE,
        signIn: {
          loading: false,
          error: action.payload
        }
      };
    case USER_SIGN_OUT_SUCCESS:
      return {
        ...DEFAULT_STATE,
        isAuthenticated: false,
        token: action.payload
      };

    case USER_SEND_PASSWORD_RESET_LOADING:
      return {
        ...state,
        resetEmailForm: {
          ...state.resetEmailForm,
          loading: action.payload,
          success: false,
          error: false
        }
      };

    case USER_SEND_PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        resetEmailForm: {
          ...state.resetEmailForm,
          message: action.payload,
          success: true,
          error: false,
          loading: false
        }
      };

    case USER_SEND_PASSWORD_RESET_ERROR:
      return {
        ...state,
        resetEmailForm: {
          ...state.resetEmailForm,
          message: action.payload.message,
          success: false,
          error: action.payload.error,
          loading: false
        }
      };

    case USER_FETCH_RESET_DETAILS_LOADING:
      return {
        ...state,
        resetPasswordForm: {
          ...state.resetPasswordForm,
          loading: action.payload,
          data: {},
          success: false,
          error: false,
          errorMessage: null
        }
      };

    case USER_FETCH_RESET_DETAILS_SUCCESS:
      return {
        ...state,
        resetPasswordForm: {
          ...state.resetPasswordForm,
          data: action.payload,
          success: true,
          loading: false,
          error: false,
          errorMessage: null
        }
      };

    case USER_FETCH_RESET_DETAILS_ERROR:
      return {
        ...state,
        resetPasswordForm: {
          ...state.resetPasswordForm,
          data: {},
          success: false,
          loading: false,
          error: action.payload.error,
          errorMessage: action.payload.errorMessage
        }
      };

    case USER_SET_NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordFormSubmit: {
          ...state.resetPasswordFormSubmit,
          loading: action.payload,
          success: false,
          error: false,
          errorMessage: null
        }
      };

    case USER_SET_NEW_PASSWORD_LOADING:
      return {
        ...state,
        resetPasswordFormSubmit: {
          ...state.resetPasswordFormSubmit,
          loading: false,
          success: true,
          error: false,
          errorMessage: null
        }
      };

    case USER_SET_NEW_PASSWORD_ERROR:
      return {
        ...state,
        resetPasswordFormSubmit: {
          ...state.resetPasswordFormSubmit,
          loading: action.payload,
          success: false,
          error: action.payload.error,
          errorMessage: action.payload.errorMessage
        }
      };

    default:
      return state;
  }
};

export { DEFAULT_STATE };
