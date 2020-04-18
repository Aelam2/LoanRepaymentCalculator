/**
 * @swagger
 *  components:
 *    schemas:
 *      CodeSets:
 *        type: object
 *        required:
 *          - CodeSetID
 *          - CodeSetName
 *          - CodeValueID
 *          - CodeValueName
 *        properties:
 *          CodeValueID:
 *            type: integer
 *            required: true
 *            description: Unique Identifier for CodeSet Category
 *          CodeValueName:
 *            type: integer
 *            required: true
 *            description: Friendly name for single value in a CodeSet Category
 *          CodeValueDescription:
 *            type: integer
 *            nullable: true
 *            description: Description of CodeSet value
 *          CodeValueParentID:
 *            type: string
 *            format: uuid
 *            required: true
 *            description: ID of parent codevalue. Ex. Categories
 */
module.exports = (sequelize, DataTypes) => {
  const CodeSets = sequelize.define(
    "CodeSets",
    {
      CodeValueID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      CodeValueName: {
        type: DataTypes.STRING
      },
      CodeValueDescription: {
        type: DataTypes.STRING
      },
      CodeValueParentID: {
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: false
    }
  );

  CodeSets.associate = function (models) {
    // associations can be defined here
  };

  return CodeSets;
};
