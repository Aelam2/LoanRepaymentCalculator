"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "PaymentPlans",
      {
        PaymentPlanID: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        UserID: {
          type: Sequelize.INTEGER,
          references: {
            model: { tableName: "Users" },
            key: "UserID"
          },
          allowNull: false
        },
        PlanName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        AllocationMethodID: {
          type: Sequelize.INTEGER,
          references: {
            model: { tableName: "CodeSets" },
            key: "CodeValueID"
          }
        },
        IsCurrent: {
          type: Sequelize.BOOLEAN,
          defaultValue: 0
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
    return queryInterface.dropTable("PaymentPlans");
  }
};
