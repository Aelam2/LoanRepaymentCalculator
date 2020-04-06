import axios from "axios";
import { DASHBOARD_ADD_EDIT_DRAWER_TOGGLE, DASHBOARD_LIST_ACCORDION_TOGGLE, DASHBOARD_MOBILE_TAB_CHANGE } from "./types";

import { DASHBOARD_FETCH_LOANS_SUCCESS, DASHBOARD_FETCH_LOANS_LOADING, DASHBOARD_FETCH_LOANS_ERROR } from "./types";
import { DASHBOARD_CREATE_LOAN_SUCCESS, DASHBOARD_CREATE_LOAN_LOADING } from "./types";
import { DASHBOARD_UPDATE_LOAN_SUCCESS, DASHBOARD_UPDATE_LOAN_LOADING } from "./types";
import { DASHBOARD_DELETE_LOAN_SUCCESS, DASHBOARD_DELETE_LOAN_LOADING } from "./types";

import { DASHBOARD_FETCH_PAYMENT_PLANS_SUCCESS, DASHBOARD_FETCH_PAYMENT_PLANS_LOADING, DASHBOARD_FETCH_PAYMENT_PLANS_ERROR } from "./types.js";

export const toggleListAccordion = (type, isOpen) => {
  return dispatch => {
    console.log(type, isOpen);
    dispatch({
      type: DASHBOARD_LIST_ACCORDION_TOGGLE,
      payload: { type, isOpen }
    });

    return isOpen;
  };
};

export const toggleAddEditDrawer = (visible, type, item) => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_ADD_EDIT_DRAWER_TOGGLE,
      payload: { visible, type, item }
    });
    return true;
  };
};

export const fetchLoans = () => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_FETCH_LOANS_LOADING,
        payload: true
      });

      const { data } = await axios.get(`/me/loans`);

      dispatch({
        type: DASHBOARD_FETCH_LOANS_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("fetchLoans error! ===>", err.message);

      dispatch({
        type: DASHBOARD_FETCH_LOANS_ERROR,
        payload: true
      });

      return false;
    }
  };
};

export const createNewLoan = loan => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_CREATE_LOAN_LOADING,
        payload: true
      });

      const { data } = await axios.post(`/me/loans`, { ...loan, LoanType: "2bc95ac6-7448-11ea-bc55-0242ac130003" });

      dispatch({
        type: DASHBOARD_CREATE_LOAN_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("createNewLoan error! ===>", err.message);

      return false;
    }
  };
};

export const updateExistingLoan = loan => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_UPDATE_LOAN_LOADING,
        payload: true
      });

      const { data } = await axios.put(`/me/loans/${loan.LoanID}`, { ...loan, LoanType: "2bc95ac6-7448-11ea-bc55-0242ac130003" });

      dispatch({
        type: DASHBOARD_UPDATE_LOAN_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("updateExistingLoan error! ===>", err.message);

      return false;
    }
  };
};

export const deleteExistingLoan = LoanID => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_DELETE_LOAN_LOADING,
        payload: true
      });

      const { data } = await axios.delete(`/me/loans/${LoanID}`);

      dispatch({
        type: DASHBOARD_DELETE_LOAN_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("deleteExistingLoan error! ===>", err.message);

      return false;
    }
  };
};

export const fetchPaymentPlans = () => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_FETCH_PAYMENT_PLANS_LOADING,
        payload: true
      });

      const { data } = await axios.get(`/me/payment-plans`);

      dispatch({
        type: DASHBOARD_FETCH_PAYMENT_PLANS_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("fetchPaymentPlans error! ===>", err.message);
      dispatch({
        type: DASHBOARD_FETCH_PAYMENT_PLANS_ERROR,
        payload: true
      });
      return false;
    }
  };
};

export const handleMobileTabChange = key => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_MOBILE_TAB_CHANGE,
      payload: key
    });
    return true;
  };
};
