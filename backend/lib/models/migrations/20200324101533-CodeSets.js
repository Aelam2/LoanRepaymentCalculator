"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("CodeSets", {
      CodeValueID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      CodeValueName: {
        type: Sequelize.STRING
      },
      CodeValueDescription: {
        type: Sequelize.STRING
      },
      CodeValueParentID: {
        type: Sequelize.INTEGER
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("CodeSets");
  }
};
