import moment from "moment";
import { HANDLE_GROUP_BY_CHANGE_SUCCESS } from "actions/PaymentScheduleActionTypes";
import { SCHEDULE_PIVOT_SUCCESS, SCHEDULE_PIVOT_LOADING, SCHEDULE_PIVOT_ERROR } from "actions/PaymentScheduleActionTypes";

const DEFAULT_STATE = {
  groupBy: "month",
  schedule: [],
  loading: true,
  error: false
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case HANDLE_GROUP_BY_CHANGE_SUCCESS:
      return {
        ...state,
        groupBy: action.payload
      };

    case SCHEDULE_PIVOT_LOADING:
      return {
        ...state,
        loading: true
      };

    case SCHEDULE_PIVOT_SUCCESS:
      return {
        ...state,
        schedule: action.payload,
        loading: false
      };

    case SCHEDULE_PIVOT_ERROR:
      return {
        ...state,
        error: true,
        loading: false
      };

    default:
      return state;
  }
};

export { DEFAULT_STATE };
