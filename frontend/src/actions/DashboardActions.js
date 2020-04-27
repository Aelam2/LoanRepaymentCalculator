import axios from "axios";
import querystring from "querystring";

import { DASHBOARD_ADD_EDIT_DRAWER_TOGGLE, DASHBOARD_LIST_ACCORDION_TOGGLE, DASHBOARD_MOBILE_TAB_CHANGE } from "actions/DashboardActionTypes";

import { DASHBOARD_FETCH_LOANS_SUCCESS, DASHBOARD_FETCH_LOANS_LOADING, DASHBOARD_FETCH_LOANS_ERROR } from "actions/DashboardActionTypes";
import { DASHBOARD_CREATE_LOAN_SUCCESS, DASHBOARD_CREATE_LOAN_LOADING, DASHBOARD_CREATE_LOAN_ERROR } from "actions/DashboardActionTypes";
import { DASHBOARD_UPDATE_LOAN_SUCCESS, DASHBOARD_UPDATE_LOAN_LOADING, DASHBOARD_UPDATE_LOAN_ERROR } from "actions/DashboardActionTypes";
import { DASHBOARD_DELETE_LOAN_SUCCESS, DASHBOARD_DELETE_LOAN_LOADING, DASHBOARD_DELETE_LOAN_ERROR } from "actions/DashboardActionTypes";
import { DASHBOARD_HIDE_LOAN_SUCCESS, DASHBOARD_UNHIDE_LOAN_SUCCESS } from "actions/DashboardActionTypes";

import { DASHBOARD_FETCH_PAYMENT_PLANS_SUCCESS, DASHBOARD_FETCH_PAYMENT_PLANS_LOADING, DASHBOARD_FETCH_PAYMENT_PLANS_ERROR } from "actions/DashboardActionTypes.js"; //prettier-ignore
import { DASHBOARD_CREATE_PAYMENT_PLANS_SUCCESS, DASHBOARD_CREATE_PAYMENT_PLANS_LOADING, DASHBOARD_CREATE_PAYMENT_PLANS_ERROR } from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_UPDATE_PAYMENT_PLANS_SUCCESS, DASHBOARD_UPDATE_PAYMENT_PLANS_LOADING, DASHBOARD_UPDATE_PAYMENT_PLANS_ERROR  } from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_DELETE_PAYMENT_PLANS_SUCCESS, DASHBOARD_DELETE_PAYMENT_PLANS_LOADING , DASHBOARD_DELETE_PAYMENT_PLANS_ERROR} from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_TOGGLE_CURRENT_PAYMENT_PLAN_SUCCESS, DASHBOARD_TOGGLE_CURRENT_PAYMENT_PLAN_LOADING } from 'actions/DashboardActionTypes' //prettier-ignore

import { DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_SUCCESS, DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_LOADING, DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_ERROR} from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_ANALYTICS_TOGGLE_CONSOLIDATED_VIEW, DASHBOARD_ON_CHART_TOOLTIP_HOVER_SUCCESS } from "actions/DashboardActionTypes"; //prettier-ignore

export const toggleListAccordion = (type, isOpen) => {
  return dispatch => {
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
      console.error("[fetchLoans] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_FETCH_LOANS_ERROR,
        payload: true
      });

      return false;
    }
  };
};

export const createLoan = loan => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_CREATE_LOAN_LOADING,
        payload: true
      });

      const { data } = await axios.post(`/me/loans`, { ...loan, LoanTypeID: "9" });

      dispatch({
        type: DASHBOARD_CREATE_LOAN_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("[createLoan] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_CREATE_LOAN_ERROR
      });

      throw new Error("There was a problem creating your loan!");
    }
  };
};

export const updateLoan = loan => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_UPDATE_LOAN_LOADING,
        payload: true
      });

      const { data } = await axios.put(`/me/loans/${loan.LoanID}`, { ...loan, LoanTypeID: "9" });

      dispatch({
        type: DASHBOARD_UPDATE_LOAN_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("[updateLoan] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_UPDATE_LOAN_ERROR
      });

      throw new Error("There was a problem updating your loan!");
    }
  };
};

export const deleteLoan = LoanID => {
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
      console.error("[deleteLoan] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_DELETE_LOAN_ERROR
      });

      throw new Error("There was a problem deleting your loan!");
    }
  };
};

export const hideLoan = LoanID => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_HIDE_LOAN_SUCCESS,
      payload: LoanID
    });
  };
};

export const unHideLoan = LoanID => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_UNHIDE_LOAN_SUCCESS,
      payload: LoanID
    });
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
        payload: { plans: data.data, currentPlan: data.data.find(p => p.IsCurrent == 1) || {} }
      });

      return true;
    } catch (err) {
      console.error("[fetchPaymentPlans] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_FETCH_PAYMENT_PLANS_ERROR,
        payload: true
      });

      throw new Error("There was a problem fetching your payment plans!");
    }
  };
};

export const createPaymentPlan = paymentPlan => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_CREATE_PAYMENT_PLANS_LOADING,
        payload: true
      });

      const { data } = await axios.post(`/me/payment-plans`, { ...paymentPlan, IsCurrent: 1 });

      dispatch({
        type: DASHBOARD_CREATE_PAYMENT_PLANS_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("[createPaymentPlan] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_CREATE_PAYMENT_PLANS_ERROR
      });

      throw new Error("There was a problem creating your payment plan!");
    }
  };
};

export const updatePaymentPlan = paymentPlan => {
  return async dispatch => {
    try {
      let { PaymentPlanID, ...updatedValeus } = paymentPlan;
      console.log(paymentPlan);
      dispatch({
        type: DASHBOARD_UPDATE_PAYMENT_PLANS_LOADING,
        payload: true
      });

      const { data } = await axios.put(`/me/payment-plans/${PaymentPlanID}`, { ...updatedValeus });

      dispatch({
        type: DASHBOARD_UPDATE_PAYMENT_PLANS_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("[updatePaymentPlan] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_UPDATE_PAYMENT_PLANS_ERROR
      });

      throw new Error("There was a problem updating your payment plan!");
    }
  };
};

export const deletePaymentPlan = PaymentPlanID => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_DELETE_PAYMENT_PLANS_LOADING,
        payload: true
      });

      const { data } = await axios.delete(`/me/payment-plans/${PaymentPlanID}`);

      dispatch({
        type: DASHBOARD_DELETE_PAYMENT_PLANS_SUCCESS,
        payload: data.data
      });

      return true;
    } catch (err) {
      console.error("[deletePaymentPlan] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_DELETE_PAYMENT_PLANS_ERROR
      });

      throw new Error("There was a problem deleting your payment plan!");
    }
  };
};

export const toggleCurrentPlan = (PaymentPlanID, IsCurrent) => {
  return async dispatch => {
    // Analytics Loading animiations
    dispatch({
      type: DASHBOARD_TOGGLE_CURRENT_PAYMENT_PLAN_LOADING,
      payload: true
    });

    await axios.post(`/me/payment-plans/${PaymentPlanID}/activate`, { IsCurrent: IsCurrent });

    // Set currentPlan, update IsCurrent for all plans, and remove loading animations
    dispatch({
      type: DASHBOARD_TOGGLE_CURRENT_PAYMENT_PLAN_SUCCESS,
      payload: { PaymentPlanID, IsCurrent }
    });
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

export const fetchAmortizationSchedule = (hidden = []) => {
  return async dispatch => {
    try {
      dispatch({
        type: DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_LOADING,
        payload: true
      });

      const { data } = await axios.get(
        `/me/loans/amortization?${querystring.stringify({
          ...(hidden.length && { hidden: hidden.join(",") })
        })}`
      );

      dispatch({
        type: DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_SUCCESS,
        payload: data.data
      });
    } catch (err) {
      console.error("[fetchAmortizationSchedule] error! ===>", err.message);

      dispatch({
        type: DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_LOADING,
        payload: true
      });
    }
  };
};

export const toggleConsolidatedView = boolean => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_ANALYTICS_TOGGLE_CONSOLIDATED_VIEW,
      payload: boolean
    });
  };
};

export const onChartTooltipHover = date => {
  return dispatch => {
    dispatch({
      type: DASHBOARD_ON_CHART_TOOLTIP_HOVER_SUCCESS,
      payload: date
    });
  };
};
