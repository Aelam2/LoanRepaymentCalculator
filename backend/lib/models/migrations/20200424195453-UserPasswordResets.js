"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "UserPasswordResets",
      {
        PasswordResetID: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        Email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        ResetToken: {
          type: Sequelize.STRING,
          allowNull: false
        },
        IsUsed: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        DateExpires: {
          type: Sequelize.DATE,
          allowNull: false
        },
        DateCreated: {
          type: Sequelize.DATE
        },
        DateUpdated: {
          type: Sequelize.DATE
        }
      },
      {
        timestamps: true,
        createdAt: "DateCreated",
        updatedAt: "DateUpdated",
        deletedAt: false,
        paranoid: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("UserPasswordResets");
  }
};
