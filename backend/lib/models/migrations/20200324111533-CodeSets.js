"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("CodeSets", {
      CodeSetID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      CodeSetName: {
        type: Sequelize.STRING
      },
      CodeSetDescription: {
        type: Sequelize.STRING
      },
      CodeValueID: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        unique: true
      },
      CodeValueName: {
        type: Sequelize.STRING
      },
      CodeValueDescription: {
        type: Sequelize.STRING
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("CodeSets");
  }
};
