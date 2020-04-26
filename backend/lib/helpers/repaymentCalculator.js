import moment from "moment";
import strategyDefinitions from "./repaymentStrategies";
import _ from "lodash";

const paymentsPerYear = 12;

export const moneyRound = (amount, precision = 2) => {
  var factor = Math.pow(10, precision);
  return Math.round(amount * factor) / factor;
};

export const calculateSchedule = async (loans, strategyType, payments) => {
  try {
    let hasBalance = true;

    let strategy = strategyDefinitions[strategyType];
    let loanOrder = strategy.sorter(loans);

    let availableMinimumFunds = 0;

    for (let loan of loanOrder) {
      loan.principle = Number(loan.LoanBalance);
      loan.LoanBalance = Number(loan.LoanBalance);
      loan.InterestRate = Number(loan.InterestRate) * 100;
      loan.PaymentMinimum = Number(loan.PaymentMinimum);

      loan.interest = 0;
      loan.schedule = [];
      loan.periodRate = loan.InterestRate / paymentsPerYear;

      availableMinimumFunds += loan.PaymentMinimum;
    }

    let consolidatedSchedule = [];

    let firstPaymentDate = moment.min(loans.map(l => moment(l.PaymentStart)));

    let elapsedMonths = 0;
    while (hasBalance && elapsedMonths <= 480) {
      let consolidatedStart = { amount: 0, interest: 0, principal: 0, balance: 0 };

      let currentMonth = moment(firstPaymentDate).add(elapsedMonths, "month");

      // Sum of recurring yearly payments
      let yearlyPayments = payments
        .filter(p => p.RecurringTypeID == 8 && currentMonth.month() === moment(p.PaymentDate).month())
        .map(p => Number(p.PaymentAmount))
        .reduce((a, b) => a + b, 0);

      // Sum of recurring monthly payments... PaymentDate =< current >= PaymentDateEnd
      let monthlyPayments = payments
        .filter(p => p.RecurringTypeID == 7 && currentMonth.isSameOrAfter(moment(p.PaymentDate), "month"))
        .map(p => Number(p.PaymentAmount))
        .reduce((a, b) => a + b, 0);

      // Sum of one time payments for the current month
      let oneTimePayments = payments
        .filter(p => p.RecurringTypeID == 6 && currentMonth.month() === moment(p.PaymentDate).month() && currentMonth.isSame(moment(p.PaymentDate), "year"))
        .map(p => Number(p.PaymentAmount))
        .reduce((a, b) => a + b, 0);

      // Sum of all available payments
      let available = availableMinimumFunds + yearlyPayments + monthlyPayments + oneTimePayments;

      // Handle minimum payments
      for (let loan of loanOrder) {
        // Skip paid off loans
        if (loan.LoanBalance > 0) {
          let amount = Math.min(loan.LoanBalance, loan.PaymentMinimum);
          let interest = loan.LoanBalance * (loan.periodRate / 100);
          let principal = amount - interest;

          // If user started mid-month, check if minimum isn't due until next month
          let startNextMonth = elapsedMonths == 0 && moment(loan.PaymentStart).month() != firstPaymentDate.month();
          if (startNextMonth) {
            loan.schedule.push({
              LoanID: loan.LoanID,
              LoanName: loan.LoanName,
              date: firstPaymentDate.endOf("day").toISOString(),
              amount: 0,
              interest: 0,
              principal: 0,
              balance: loan.LoanBalance
            });
          } else {
            loan.LoanBalance = loan.LoanBalance - principal;
            loan.interest = loan.interest + interest;
            available -= amount;

            loan.schedule.push({
              LoanID: loan.LoanID,
              LoanName: loan.LoanName,
              date: currentMonth.endOf("day").toISOString(),
              amount: amount,
              interest: interest,
              principal: principal,
              balance: loan.LoanBalance
            });
          }

          // Add up running totals for all loans this month
          consolidatedStart.balance += loan.LoanBalance;
          consolidatedStart.amount += startNextMonth ? 0 : amount;
          consolidatedStart.interest += startNextMonth ? 0 : interest;
          consolidatedStart.principal += startNextMonth ? 0 : principal;
        }
      }

      // Handle extra money
      for (let loan of loanOrder) {
        // Skip paid off loans
        if (loan.LoanBalance > 0) {
          let amount = Math.min(loan.LoanBalance, available);

          loan.LoanBalance -= amount;
          available -= amount;

          let pos = loan.schedule.length - 1;

          loan.schedule[pos].LoanID = loan.LoanID;
          loan.schedule[pos].LoanName = loan.LoanName;
          loan.schedule[pos].amount = loan.schedule[pos].amount + amount;
          loan.schedule[pos].principal = (loan.schedule[pos].principal || 0) + amount;
          loan.schedule[pos].balance = loan.LoanBalance;

          // Adjust running totals for all loans this month
          consolidatedStart.amount += amount;
          consolidatedStart.principal += amount;
          consolidatedStart.balance -= amount;

          // Check if all the extra money is spent
          if (available <= 0) {
            break;
          }
        }

        // Determine if all the loans have been repaid
        hasBalance = !!loanOrder.find(l => {
          return moneyRound(l.LoanBalance, 2) > 0;
        });
      }

      consolidatedSchedule.push({
        LoanID: 0,
        LoanName: "All Loans",
        date: currentMonth.endOf("day").toISOString(),
        ...consolidatedStart
      });

      elapsedMonths += 1;
    }

    let strategyResult = {
      type: strategy.type,
      name: strategy.name,
      description: strategy.description,
      loans: loans.map(l => loanOrder.find(lo => lo.LoanID == l.LoanID)),
      masterSchedule: [],
      consolidatedSchedule: [],
      accumulatedSchedule: [],
      principal: 0,
      interest: 0,
      total: 0,
      payments: 0
    };

    // Determine some post-calulation properties
    for (let loan of loanOrder) {
      loan.payments = loan.schedule.length;

      strategyResult.payments = Math.max(strategyResult.payments, loan.payments);
      strategyResult.principal += loan.principle;
      strategyResult.interest += loan.interest;
      strategyResult.total = strategyResult.principal + strategyResult.interest;
      strategyResult.masterSchedule = [...strategyResult.masterSchedule, ...loan.schedule];
    }

    strategyResult.consolidatedSchedule = consolidatedSchedule;
    strategyResult.accumulatedSchedule = calcAccumulatedSchedule(consolidatedSchedule);

    strategyResult.principal = moneyRound(strategyResult.principal);
    strategyResult.interest = moneyRound(strategyResult.interest);
    strategyResult.total = moneyRound(strategyResult.total);
    strategyResult.firstPayment = firstPaymentDate.startOf("day").toISOString();
    strategyResult.finalPayment = moment.max(strategyResult.masterSchedule.map(l => moment(l.date))).toISOString();

    return strategyResult;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const calcAccumulatedSchedule = consolidatedSchedule => {
  let accumulatedSchedule = [];

  let uniqueDates = [...new Set(consolidatedSchedule.map(p => moment(p.date).startOf("month").endOf("day").toISOString()))];

  for (let d of uniqueDates) {
    let accumulatedStart = { amount: 0, interest: 0, principal: 0, balance: 0 };
    let accumulatedPayments = consolidatedSchedule.filter(p => moment(d).isSameOrBefore(moment(p.date).startOf("month").endOf("day")));
    let accumulatedTotals = accumulatedPayments.reduce((sums, month) => {
      return {
        amount: moneyRound((sums.amount += Number(month.amount)), 2),
        interest: moneyRound((sums.interest += Number(month.interest)), 2),
        principal: moneyRound((sums.principal += Number(month.principal)), 2),
        balance: moneyRound((sums.balance += Number(month.balance)), 2)
      };
    }, accumulatedStart);

    accumulatedSchedule.push({
      LoanID: -1,
      LoanName: "All Loans",
      date: d,
      ...accumulatedTotals
    });
  }

  return accumulatedSchedule;
};
