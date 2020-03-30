import axios from "axios";
import { USER_SIGN_UP_SUCCESS, USER_SIGN_UP_LOADING, USER_SIGN_UP_ERROR } from "./types";
import { USER_SIGN_IN_SUCCESS, USER_SIGN_IN_LOADING, USER_SIGN_IN_ERROR } from "./types";
import { USER_SIGN_OUT_SUCCESS } from "./types";

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
      console.error("Sign-Up error! ===>", err.message);

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
      console.error("Sign-Up error! ===>", err.message);

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
      console.error("Sign-Up error! ===>", err.message);

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
      console.error("Sign-Up error! ===>", err.message);

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
    return true;
  };
};
