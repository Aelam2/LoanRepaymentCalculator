import moment from "moment";
import strategyDefinitions from "./repaymentStrategies";
import _ from "lodash";

const paymentsPerYear = 12;

export const moneyRound = (amount, precision = 2) => {
  var factor = Math.pow(10, precision);
  return Math.round(amount * factor) / factor;
};

export const consolidateSchedule = masterSchedule => {
  let dateArr = [];
  let schedule = [];
  for (let payment of masterSchedule) {
    payment.date = moment(payment.date).startOf("month").endOf("day").toISOString();
    var index = dateArr.indexOf(payment.date);

    // If first time reading date, add to
    if (index == -1) {
      dateArr.push(payment.date);
      schedule.push({ ...payment, LoanID: 0, LoanName: "All Loans" });
    } else {
      // If we've read date once, add to exisiting properties

      schedule[index].amount += payment.amount;
      schedule[index].interest += payment.interest;
      schedule[index].principal += payment.principal;
      schedule[index].balance += payment.balance;
    }
  }

  return schedule;
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

    let firstPaymentDate = moment.min(loans.map(l => moment(l.PaymentStart)));

    payments.map(p => Number(p.PaymentAmount)).reduce((a, b) => a + b, 0);

    let elapsedMonths = 0;
    while (hasBalance && elapsedMonths <= 480) {
      // Sum of recurring yearly payments
      let yearlyPayments = payments
        .filter(p => p.RecurringTypeID == 8 && firstPaymentDate.add(elapsedMonths, "month").isSame(moment(p.PaymentDate), "month"))
        .map(p => Number(p.PaymentAmount))
        .reduce((a, b) => a + b, 0);

      // Sum of recurring monthly payments
      let monthlyPayments = payments
        .filter(p => p.RecurringTypeID == 7 && firstPaymentDate.add(elapsedMonths, "month").isSameOrAfter(moment(p.PaymentDate), "month"))
        .map(p => Number(p.PaymentAmount))
        .reduce((a, b) => a + b, 0);

      // Sum of one time payments for the current month
      let oneTimePayments = payments
        .filter(
          p =>
            p.RecurringTypeID == 8 &&
            firstPaymentDate.add(elapsedMonths, "month").isSame(moment(p.PaymentDate), "month") &&
            firstPaymentDate.add(elapsedMonths, "month").isSame(moment(p.PaymentDate), "year")
        )
        .map(p => Number(p.PaymentAmount))
        .reduce((a, b) => a + b, 0);

      // Sum of all available payments
      let available = availableMinimumFunds + yearlyPayments + monthlyPayments + oneTimePayments;

      // Handle minimum payments
      for (let loan of loanOrder) {
        // Skip paid off loans
        if (moneyRound(loan.LoanBalance, 0) > 0) {
          let amount = Math.min(loan.LoanBalance, loan.PaymentMinimum);
          let interest = loan.LoanBalance * (loan.periodRate / 100);
          let principal = amount - interest;

          // If user started mid-month, check if minimum isn't due until next month
          if (elapsedMonths == 0 && !moment(loan.PaymentStart).isSame(firstPaymentDate, "month")) {
            loan.schedule.push({
              LoanID: loan.LoanID,
              LoanName: loan.LoanName,
              date: firstPaymentDate.endOf("day").toISOString(),
              amount: 0,
              interest: 0,
              principal: loan.LoanBalance,
              balance: loan.LoanBalance
            });
          }

          loan.LoanBalance = loan.LoanBalance - principal;
          loan.interest = loan.interest + interest;
          available -= amount;

          loan.schedule.push({
            LoanID: loan.LoanID,
            LoanName: loan.LoanName,
            date: moment(loan.PaymentStart).add(elapsedMonths, "month").endOf("day").toISOString(),
            amount: amount,
            interest: interest,
            principal: principal,
            balance: loan.LoanBalance
          });
        }
      }

      // Handle extra money
      for (let loan of loanOrder) {
        // Skip paid off loans
        if (moneyRound(loan.LoanBalance, 0) > 0) {
          let amount = Math.min(loan.LoanBalance, available);

          loan.LoanBalance -= amount;
          available -= amount;

          let pos = loan.schedule.length - 1;

          loan.schedule[pos].LoanID = loan.LoanID;
          loan.schedule[pos].LoanName = loan.LoanName;
          loan.schedule[pos].amount = loan.schedule[pos].amount + amount;
          loan.schedule[pos].principal = (loan.schedule[pos].principal || 0) + amount;
          loan.schedule[pos].balance = loan.LoanBalance;

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

      elapsedMonths += 1;
    }

    let strategyResult = {
      type: strategy.type,
      name: strategy.name,
      description: strategy.description,
      loans: loans.map(l => loanOrder.find(lo => lo.LoanID == l.LoanID)),
      masterSchedule: [],
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

    strategyResult.consolidated = consolidateSchedule(_.cloneDeep(strategyResult.masterSchedule));
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
