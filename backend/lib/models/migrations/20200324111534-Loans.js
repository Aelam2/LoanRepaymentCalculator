"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "Loans",
      {
        LoanID: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        LoanName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        LoanType: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: "CodeSets" },
            key: "CodeValueID"
          }
        },
        UserID: {
          type: Sequelize.INTEGER,
          references: {
            model: { tableName: "Users" },
            key: "UserID"
          }
        },
        PaymentStart: {
          type: Sequelize.DATE
        },
        LoanTerm: {
          type: Sequelize.INTEGER,
          validate: {
            min: 1
          }
        },
        StartingPrinciple: {
          type: Sequelize.FLOAT,
          validate: {
            min: 1
          }
        },
        CurrentPrinciple: {
          type: Sequelize.FLOAT,
          validate: {
            min: 0
          }
        },
        AccruedInterest: {
          type: Sequelize.FLOAT,
          validate: {
            min: 0
          }
        },
        InterestRate: {
          type: Sequelize.DOUBLE,
          validate: {
            min: 0
          }
        },
        MinimumPayment: {
          type: Sequelize.FLOAT,
          validate: {
            min: 1
          }
        },
        StatusID: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: "CodeSets" },
            key: "CodeValueID"
          }
        },
        DateCreated: {
          type: Sequelize.DATE
        },
        DateUpdated: {
          type: Sequelize.DATE
        },
        DateDeleted: {
          type: Sequelize.DATE
        }
      },
      {
        timestamps: true,
        createdAt: "DateCreated",
        updatedAt: "DateUpdated",
        deletedAt: "DateDeleted",
        paranoid: true
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Loans");
  }
};
