import moment from "moment";
import { HANDLE_GROUP_BY_CHANGE_SUCCESS } from "actions/PaymentScheduleActionTypes";
import { SCHEDULE_PIVOT_SUCCESS, SCHEDULE_PIVOT_LOADING, SCHEDULE_PIVOT_ERROR } from "actions/PaymentScheduleActionTypes";

export const handleGroupByChange = groupBy => {
  return dispatch => {
    dispatch({
      type: HANDLE_GROUP_BY_CHANGE_SUCCESS,
      payload: groupBy
    });
  };
};

export const handleSchedulePivot = (groupBy, masterSchedule) => {
  return dispatch => {
    try {
      dispatch({
        type: SCHEDULE_PIVOT_LOADING,
        action: true
      });

      let schedule = [];

      if (groupBy === "loan") {
        let uniqueLoans = [...new Set(masterSchedule.map(l => l.LoanID))];

        for (let loanID of uniqueLoans) {
          let payments = masterSchedule.filter(p => p.LoanID == loanID);

          schedule.push({
            title: loanID,
            payments: [...payments]
          });
        }
      } else {
        let uniqueDates = [...new Set(masterSchedule.map(d => moment(d.date).startOf("month").toISOString()))];
        console.log(uniqueDates);
        for (let d of uniqueDates) {
          let payments = masterSchedule.filter(p => moment(p.date).month() === moment(d).month() && moment(p.date).year() === moment(d).year());
          schedule.push({
            title: moment(d).format("MMM, YYYY"),
            payments: [...payments]
          });
        }
      }

      dispatch({
        type: SCHEDULE_PIVOT_SUCCESS,
        payload: schedule
      });
    } catch (err) {
      dispatch({
        type: SCHEDULE_PIVOT_ERROR,
        action: true
      });
    }
  };
};
