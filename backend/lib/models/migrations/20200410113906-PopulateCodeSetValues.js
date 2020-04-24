"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("CodeSets", [
      {
        CodeValueName: "AllocationMethodID",
        CodeValueDescription: "Category Parent: How payments are applied to loans (snowball, avalanche, ect.)",
        CodeValueParentID: null
      },
      { CodeValueName: "RecurringTypeID", CodeValueDescription: "", CodeValueParentID: null },
      { CodeValueName: "LoanTypeID", CodeValueDescription: "", CodeValueParentID: null },
      { CodeValueName: "Snowball", CodeValueDescription: "Payments are applied to loan with highest balance first", CodeValueParentID: 1 },
      { CodeValueName: "Avalanche", CodeValueDescription: "Payments are applied to loan with highest APR", CodeValueParentID: 1 },
      { CodeValueName: "None", CodeValueDescription: "Payment will only occur once", CodeValueParentID: 2 },
      { CodeValueName: "Monthly", CodeValueDescription: "Payment will recur monthly", CodeValueParentID: 2 },
      { CodeValueName: "Yearly", CodeValueDescription: "Payment will recur yearly", CodeValueParentID: 2 },
      { CodeValueName: "Credit Card", CodeValueDescription: "", CodeValueParentID: 3 },
      { CodeValueName: "Student Loan", CodeValueDescription: "", CodeValueParentID: 3 },
      { CodeValueName: "Mortage", CodeValueDescription: "", CodeValueParentID: 3 },
      { CodeValueName: "Auto Loan", CodeValueDescription: "", CodeValueParentID: 3 }
    ]);
  },

  down: (queryInterface, Sequelize) => {}
};
