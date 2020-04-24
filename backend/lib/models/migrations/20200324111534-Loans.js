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
        UserID: {
          type: Sequelize.INTEGER,
          references: {
            model: { tableName: "Users" },
            key: "UserID"
          }
        },
        LoanName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        LoanTypeID: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: { tableName: "CodeSets" },
            key: "CodeValueID"
          }
        },
        LoanTerm: {
          type: Sequelize.INTEGER,
          validate: {
            min: 1
          }
        },
        LoanBalance: {
          type: Sequelize.FLOAT,
          validate: {
            min: 1
          }
        },
        InterestRate: {
          type: Sequelize.DOUBLE,
          validate: {
            min: 0
          }
        },
        PaymentStart: {
          type: Sequelize.DATE
        },
        PaymentMinimum: {
          type: Sequelize.FLOAT,
          validate: {
            min: 1
          }
        },
        StatusID: {
          type: Sequelize.INTEGER,
          allowNull: true,
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
