import { DASHBOARD_ADD_EDIT_DRAWER_TOGGLE, DASHBOARD_LIST_ACCORDION_TOGGLE, DASHBOARD_MOBILE_TAB_CHANGE } from "actions/types";

import { DASHBOARD_FETCH_LOANS_SUCCESS, DASHBOARD_FETCH_LOANS_LOADING, DASHBOARD_FETCH_LOANS_ERROR } from "actions/types";
import { DASHBOARD_CREATE_LOAN_SUCCESS, DASHBOARD_CREATE_LOAN_LOADING } from "actions/types";
import { DASHBOARD_UPDATE_LOAN_SUCCESS, DASHBOARD_UPDATE_LOAN_LOADING } from "actions/types";
import { DASHBOARD_DELETE_LOAN_SUCCESS, DASHBOARD_DELETE_LOAN_LOADING } from "actions/types";

import { DASHBOARD_FETCH_PAYMENT_PLANS_SUCCESS, DASHBOARD_FETCH_PAYMENT_PLANS_LOADING, DASHBOARD_FETCH_PAYMENT_PLANS_ERROR } from "actions/types";

const DEFAULT_STATE = {
  drawer: {
    visible: false,
    type: "loans",
    item: {}
  },

  loans: {
    data: [],
    loading: true,
    error: false,
    creating: false,
    updating: false,
    deleting: false,
    isOpen: true
  },

  paymentPlans: {
    data: [],
    loading: true,
    error: false,
    creating: false,
    updating: false,
    deleting: false,
    isOpen: true
  },

  mobileTab: 0
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case DASHBOARD_LIST_ACCORDION_TOGGLE:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          isOpen: action.payload.isOpen
        }
      };
    case DASHBOARD_ADD_EDIT_DRAWER_TOGGLE:
      return {
        ...state,
        drawer: {
          ...state.drawer,
          visible: action.payload.visible,
          type: action.payload.type,
          item: action.payload.item
        }
      };

    case DASHBOARD_MOBILE_TAB_CHANGE:
      return {
        ...state,
        mobileTab: Number(action.payload)
      };

    case DASHBOARD_FETCH_LOANS_LOADING:
      return {
        ...state,
        loans: {
          ...state.loans,
          loading: action.payload,
          error: false
        }
      };
    case DASHBOARD_FETCH_LOANS_SUCCESS:
      return {
        ...state,
        loans: { ...state.loans, data: action.payload, loading: false, error: false }
      };

    case DASHBOARD_FETCH_LOANS_ERROR:
      return {
        ...state,
        loans: {
          ...state.loans,
          loading: false,
          error: action.payload
        }
      };

    case DASHBOARD_CREATE_LOAN_LOADING:
      return {
        ...state,
        loans: {
          ...state.loans,
          creating: action.payload
        }
      };
    case DASHBOARD_CREATE_LOAN_SUCCESS:
      return {
        ...state,
        loans: {
          ...state.loans,
          data: [...state.loans.data, action.payload],
          creating: false
        }
      };

    case DASHBOARD_UPDATE_LOAN_LOADING:
      return {
        ...state,
        loans: {
          ...state.loans,
          updating: action.payload
        }
      };

    case DASHBOARD_UPDATE_LOAN_SUCCESS:
      return {
        ...state,
        loans: {
          ...state.loans,
          data: state.loans.data.map(l => {
            if (l.LoanID === action.payload.LoanID) {
              return action.payload;
            } else {
              return l;
            }
          }),
          updating: false
        }
      };

    case DASHBOARD_DELETE_LOAN_LOADING:
      return {
        ...state,
        loans: {
          ...state.loans,
          deleting: true
        }
      };

    case DASHBOARD_DELETE_LOAN_SUCCESS:
      return {
        ...state,
        loans: {
          ...state.loans,
          data: state.loans.data.filter(l => l.LoanID != action.payload),
          deleting: false
        }
      };

    case DASHBOARD_FETCH_PAYMENT_PLANS_LOADING:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          loading: action.payload,
          error: false
        }
      };
    case DASHBOARD_FETCH_PAYMENT_PLANS_SUCCESS:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          data: action.payload,
          loading: false,
          error: false
        }
      };
    case DASHBOARD_FETCH_PAYMENT_PLANS_ERROR:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          loading: false,
          error: action.payload
        }
      };

    default:
      return state;
  }
};

export { DEFAULT_STATE };
