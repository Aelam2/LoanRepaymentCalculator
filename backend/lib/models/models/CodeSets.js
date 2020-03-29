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
 *          CodeSetID:
 *            type: integer
 *            required: true
 *            description: Unique Identifier for CodeSet Category
 *          CodeSetName:
 *            type: integer
 *            required: true
 *            description: Friendly name for CodeSet Category
 *          CodeSetDescription:
 *            type: integer
 *            nullable: true
 *            description: Description of CodeSet Category
 *          CodeValueID:
 *            type: string
 *            format: uuid
 *            required: true
 *            description: Unique Identifier for single value in a CodeSet Category
 *          CodeValueName:
 *            type: integer
 *            required: true
 *            description: Friendly name for single value in a CodeSet Category
 *          CodeValueDescription:
 *            type: integer
 *            nullable: true
 *            description: Description of CodeSet value
 */
module.exports = (sequelize, DataTypes) => {
  const CodeSets = sequelize.define("CodeSets", {
    CodeSetID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    CodeSetName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CodeSetDescription: {
      type: DataTypes.STRING
    },
    CodeValueID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true
    },
    CodeValueName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    CodeValueDescription: {
      type: DataTypes.STRING
    }
  });

  CodeSets.associate = function(models) {
    // associations can be defined here
  };

  return CodeSets;
};
