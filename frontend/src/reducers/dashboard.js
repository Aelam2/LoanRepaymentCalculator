import moment from "moment";
import { DASHBOARD_ADD_EDIT_DRAWER_TOGGLE, DASHBOARD_LIST_ACCORDION_TOGGLE, DASHBOARD_MOBILE_TAB_CHANGE } from "actions/DashboardActionTypes";

import { DASHBOARD_FETCH_LOANS_SUCCESS, DASHBOARD_FETCH_LOANS_LOADING, DASHBOARD_FETCH_LOANS_ERROR } from "actions/DashboardActionTypes";
import { DASHBOARD_CREATE_LOAN_SUCCESS, DASHBOARD_CREATE_LOAN_LOADING, DASHBOARD_CREATE_LOAN_ERROR } from "actions/DashboardActionTypes";
import { DASHBOARD_UPDATE_LOAN_SUCCESS, DASHBOARD_UPDATE_LOAN_LOADING, DASHBOARD_UPDATE_LOAN_ERROR } from "actions/DashboardActionTypes";
import { DASHBOARD_DELETE_LOAN_SUCCESS, DASHBOARD_DELETE_LOAN_LOADING, DASHBOARD_DELETE_LOAN_ERROR } from "actions/DashboardActionTypes";
import { DASHBOARD_HIDE_LOAN_SUCCESS, DASHBOARD_UNHIDE_LOAN_SUCCESS } from "actions/DashboardActionTypes";

import { DASHBOARD_FETCH_PAYMENT_PLANS_SUCCESS, DASHBOARD_FETCH_PAYMENT_PLANS_LOADING, DASHBOARD_FETCH_PAYMENT_PLANS_ERROR } from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_CREATE_PAYMENT_PLANS_SUCCESS, DASHBOARD_CREATE_PAYMENT_PLANS_LOADING, DASHBOARD_CREATE_PAYMENT_PLANS_ERROR } from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_UPDATE_PAYMENT_PLANS_SUCCESS, DASHBOARD_UPDATE_PAYMENT_PLANS_LOADING, DASHBOARD_UPDATE_PAYMENT_PLANS_ERROR } from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_DELETE_PAYMENT_PLANS_SUCCESS, DASHBOARD_DELETE_PAYMENT_PLANS_LOADING ,DASHBOARD_DELETE_PAYMENT_PLANS_ERROR } from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_TOGGLE_CURRENT_PAYMENT_PLAN_SUCCESS, DASHBOARD_TOGGLE_CURRENT_PAYMENT_PLAN_LOADING } from 'actions/DashboardActionTypes' //prettier-ignore

import { DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_SUCCESS, DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_LOADING, DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_ERROR } from "actions/DashboardActionTypes"; //prettier-ignore
import { DASHBOARD_ANALYTICS_TOGGLE_CONSOLIDATED_VIEW, DASHBOARD_ON_CHART_TOOLTIP_HOVER_SUCCESS } from "actions/DashboardActionTypes";

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
    currentPlan: {},
    loading: true,
    error: false,
    creating: false,
    updating: false,
    deleting: false,
    isOpen: true
  },

  analytics: {
    data: {
      type: "",
      name: "",
      description: "",
      loans: [],
      masterSchedule: [],
      consolidatedSchedule: [],
      accumulatedSchedule: [],
      minimumPlan: {},
      selectedMonth: {},
      principal: 0,
      interest: 0,
      months: 0
    },
    isConsolidatedView: false,
    loading: true,
    error: false,
    errorMessage: null
  },

  mobileTab: "dashboard"
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
        mobileTab: action.payload
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

    case DASHBOARD_CREATE_LOAN_ERROR:
      return {
        ...state,
        loans: {
          ...state.loans,
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

    case DASHBOARD_UPDATE_LOAN_ERROR:
      return {
        ...state,
        loans: {
          ...state.loans,
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

    case DASHBOARD_DELETE_LOAN_ERROR:
      return {
        ...state,
        loans: {
          ...state.loans,
          deleting: false
        }
      };

    case DASHBOARD_HIDE_LOAN_SUCCESS:
      return {
        ...state,
        loans: {
          ...state.loans,
          data: state.loans.data.map(l => {
            if (l.LoanID === action.payload) {
              return { ...l, hidden: true };
            }
            return l;
          })
        }
      };

    case DASHBOARD_UNHIDE_LOAN_SUCCESS:
      return {
        ...state,
        loans: {
          ...state.loans,
          data: state.loans.data.map(l => {
            if (l.LoanID === action.payload) {
              return { ...l, hidden: false };
            }
            return l;
          })
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
          data: action.payload.plans,
          currentPlan: action.payload.currentPlan,
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

    case DASHBOARD_CREATE_PAYMENT_PLANS_LOADING:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          creating: action.payload
        }
      };
    case DASHBOARD_CREATE_PAYMENT_PLANS_SUCCESS:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          data: [...state.paymentPlans.data, action.payload],
          creating: false
        }
      };

    case DASHBOARD_CREATE_PAYMENT_PLANS_ERROR:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          creating: false
        }
      };

    case DASHBOARD_UPDATE_PAYMENT_PLANS_LOADING:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          updating: action.payload
        }
      };

    case DASHBOARD_UPDATE_PAYMENT_PLANS_SUCCESS:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          data: state.paymentPlans.data.map(l => {
            if (l.PaymentPlanID === action.payload.PaymentPlanID) {
              return action.payload;
            } else {
              return l;
            }
          }),
          updating: false
        }
      };

    case DASHBOARD_UPDATE_PAYMENT_PLANS_ERROR:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          updating: false
        }
      };

    case DASHBOARD_DELETE_PAYMENT_PLANS_LOADING:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          deleting: true
        }
      };

    case DASHBOARD_TOGGLE_CURRENT_PAYMENT_PLAN_LOADING:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          loading: action.payload
        }
      };

    case DASHBOARD_TOGGLE_CURRENT_PAYMENT_PLAN_SUCCESS:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          data: state.paymentPlans.data.map(p => {
            if (p.PaymentPlanID == action.payload.PaymentPlanID) {
              return { ...p, IsCurrent: action.payload.IsCurrent };
            }
            return { ...p, IsCurrent: 0 };
          }),
          currentPlan: action.payload.IsCurrent ? state.paymentPlans.data.find(p => p.PaymentPlanID == action.payload.PaymentPlanID) : {}
        },
        analytics: {
          ...state.analytics,
          loading: false
        }
      };

    case DASHBOARD_DELETE_PAYMENT_PLANS_SUCCESS:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          data: state.paymentPlans.data.filter(l => l.PaymentPlanID != action.payload),
          deleting: false
        }
      };

    case DASHBOARD_DELETE_PAYMENT_PLANS_ERROR:
      return {
        ...state,
        paymentPlans: {
          ...state.paymentPlans,
          deleting: false
        }
      };

    case DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_LOADING:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          loading: action.payload,
          error: false,
          errorMessage: false
        }
      };

    case DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_SUCCESS:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          data: {
            ...state.analytics.data,
            ...action.payload
          },
          loading: false,
          error: false,
          errorMessage: false
        }
      };

    case DASHBOARD_FETCH_ANALYTICS_AMORTIZATION_ERROR:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          loading: false,
          error: action.payload.error,
          errorMessage: action.payload.errorMessage
        }
      };

    case DASHBOARD_ANALYTICS_TOGGLE_CONSOLIDATED_VIEW:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          isConsolidatedView: action.payload
        }
      };

    case DASHBOARD_ON_CHART_TOOLTIP_HOVER_SUCCESS:
      return {
        ...state,
        analytics: {
          ...state.analytics,
          data: {
            ...state.analytics.data,
            selectedMonth:
              state.analytics.data.accumulatedSchedule.find(
                d => moment(d.date).month() == moment(action.payload).month() && moment(d.date).year() == moment(action.payload).year()
              ) || {}
          }
        }
      };

    default:
      return state;
  }
};

export { DEFAULT_STATE };
