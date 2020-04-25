import axios from "axios";
import { USER_SIGN_UP_SUCCESS, USER_SIGN_UP_LOADING, USER_SIGN_UP_ERROR } from "actions/UserActionTypes";
import { USER_SIGN_IN_SUCCESS, USER_SIGN_IN_LOADING, USER_SIGN_IN_ERROR } from "actions/UserActionTypes";
import { USER_SIGN_OUT_SUCCESS } from "actions/UserActionTypes";
import { USER_CHANGE_LOCALE_SUCCESS, USER_CHANGE_THEME_SUCCESS } from "actions/UserActionTypes";
import { USER_SEND_PASSWORD_RESET_SUCCESS, USER_SEND_PASSWORD_RESET_LOADING, USER_SEND_PASSWORD_RESET_ERROR } from "actions/UserActionTypes";
import { USER_FETCH_RESET_DETAILS_SUCCESS, USER_FETCH_RESET_DETAILS_LOADING, USER_FETCH_RESET_DETAILS_ERROR } from "actions/UserActionTypes";
import { USER_SET_NEW_PASSWORD_SUCCESS, USER_SET_NEW_PASSWORD_LOADING, USER_SET_NEW_PASSWORD_ERROR } from "actions/UserActionTypes";

export const localSignUp = data => {
  return async dispatch => {
    try {
      // Set sign-up loading status to true
      dispatch({ type: USER_SIGN_UP_LOADING, payload: true });

      // Attempt to sign-up new user
      const res = await axios.post(`/sign-up`, data);

      // If successful, set token into store
      dispatch({ type: USER_SIGN_UP_SUCCESS, payload: res.data.token });

      // If successful, set token into localstorage for later user
      localStorage.setItem("JWT_TOKEN", res.data.token);
      return true;
    } catch (err) {
      console.error("localSignUp error! ===>", err.message);

      // On error set sign-up error state to true
      dispatch({ type: USER_SIGN_UP_ERROR, payload: true });
      return false;
    }
  };
};

export const localSignIn = data => {
  return async dispatch => {
    try {
      // Set sign-up loading status to true
      dispatch({ type: USER_SIGN_IN_LOADING, payload: true });

      // Attempt to sign-in user with credentials
      const res = await axios.post(`/sign-in`, data, { codeMessages: { 401: "Incorrect Username or Password" } });

      // If successful, set token into store
      dispatch({ type: USER_SIGN_IN_SUCCESS, payload: res.data.token });

      // If successful, set token into localstorage for later user
      localStorage.setItem("JWT_TOKEN", res.data.token);
      return true;
    } catch (err) {
      console.error("localSignIn error! ===>", err.message);

      // On error set sign-in error state to true
      dispatch({ type: USER_SIGN_IN_ERROR, payload: true });
      return false;
    }
  };
};

export const oAuthGoogleSignIn = data => {
  return async dispatch => {
    try {
      // Set sign-up loading status to true
      dispatch({ type: USER_SIGN_IN_LOADING, payload: true });

      // Attempt to sign-in OAuth access_token
      const res = await axios.post(`/oauth/google`, { access_token: data });

      // If successful, set token into store
      dispatch({ type: USER_SIGN_IN_SUCCESS, payload: res.data.token });

      // If successful, set token into localstorage for later user
      localStorage.setItem("JWT_TOKEN", res.data.token);
      return true;
    } catch (err) {
      console.error("oAuthGoogleSignIn error! ===>", err.message);

      // On error set sign-in error state to true
      dispatch({ type: USER_SIGN_IN_ERROR, payload: true });
      return false;
    }
  };
};

export const oAuthFacebookSignIn = data => {
  return async dispatch => {
    try {
      // Set sign-up loading status to true
      dispatch({ type: USER_SIGN_IN_LOADING, payload: true });

      // Attempt to sign-in OAuth access_token
      const res = await axios.post(`/oauth/facebook`, { access_token: data });

      // If successful, set token into store
      dispatch({ type: USER_SIGN_IN_SUCCESS, payload: res.data.token });

      // If successful, set token into localstorage for later user
      localStorage.setItem("JWT_TOKEN", res.data.token);
      return true;
    } catch (err) {
      console.error("oAuthFacebookSignIn error! ===>", err.message);

      // On error set sign-in error state to true
      dispatch({ type: USER_SIGN_IN_ERROR, payload: true });
      return false;
    }
  };
};

export const signOutUser = () => {
  return dispatch => {
    localStorage.removeItem("JWT_TOKEN");
    dispatch({ type: USER_SIGN_OUT_SUCCESS, payload: "" });
    dispatch({ type: "CLEAR_STORE" });
    return true;
  };
};

export const changeSiteLocale = locale => {
  return dispatch => {
    localStorage.setItem("SITE_LOCALE", locale);
    dispatch({ type: USER_CHANGE_LOCALE_SUCCESS, payload: locale });
    return true;
  };
};

export const changeSiteTheme = theme => {
  return dispatch => {
    localStorage.setItem("SITE_THEME", theme);
    dispatch({ type: USER_CHANGE_THEME_SUCCESS, payload: theme });
    return true;
  };
};

export const sendPasswordReset = ({ Email }) => {
  return async dispatch => {
    try {
      dispatch({
        type: USER_SEND_PASSWORD_RESET_LOADING,
        payload: true
      });

      const { data } = await axios.post(`/password-reset`, { Email }, { handlerEnabled: false });

      dispatch({
        type: USER_SEND_PASSWORD_RESET_SUCCESS,
        payload: data.data
      });
    } catch (err) {
      console.log(err, err.response);
      dispatch({
        type: USER_SEND_PASSWORD_RESET_ERROR,
        payload: {
          error: true,
          message: err.response.data.error
        }
      });
    }
  };
};

export const getPasswordResetDetails = token => {
  return async dispatch => {
    try {
      dispatch({
        type: USER_FETCH_RESET_DETAILS_LOADING,
        payload: true
      });

      const { data } = await axios.get(`/password-reset/${token}`, { handlerEnabled: false });

      dispatch({
        type: USER_FETCH_RESET_DETAILS_SUCCESS,
        payload: data.data
      });
    } catch (err) {
      dispatch({
        type: USER_FETCH_RESET_DETAILS_ERROR,
        payload: {
          error: true,
          errorMessage: err.response.data.error || "An unexpected error occured"
        }
      });
    }
  };
};

export const setNewPassword = (token, { Email, Password }) => {
  return async dispatch => {
    try {
      dispatch({
        type: USER_SET_NEW_PASSWORD_SUCCESS,
        payload: true
      });

      await axios.post(`/password-reset/${token}`, { Email, Password }, { handlerEnabled: false });

      dispatch({
        type: USER_SET_NEW_PASSWORD_LOADING,
        payload: null
      });
    } catch (err) {
      dispatch({
        type: USER_SET_NEW_PASSWORD_ERROR,
        payload: {
          error: true,
          errorMessage: err.response.data.error || "An unexpected error occured"
        }
      });
    }
  };
};
