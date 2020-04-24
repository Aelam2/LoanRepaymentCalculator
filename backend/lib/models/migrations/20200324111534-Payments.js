"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "Payments",
      {
        PaymentID: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        PaymentPlanID: {
          type: Sequelize.INTEGER,
          references: {
            model: { tableName: "PaymentPlans" },
            key: "PaymentPlanID"
          }
        },
        PaymentName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        PaymentDate: {
          type: Sequelize.DATE
        },
        PaymentAmount: {
          type: Sequelize.FLOAT,
          allowNull: false,
          validate: {
            min: 1
          }
        },
        RecurringTypeID: {
          type: Sequelize.INTEGER,
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
    return queryInterface.dropTable("Payments");
  }
};
