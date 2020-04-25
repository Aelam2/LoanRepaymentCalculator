/**
 * @swagger
 *  components:
 *    schemas:
 *      UserPasswordReset:
 *        type: object
 *        properties:
 *          PasswordResetID:
 *            type: integer
 *            format: int32
 *            required: true
 *            description: Unique Payment Identifer
 *          ResetToken:
 *            type: string
 *            required: true
 *            description: Token that is eamiled to the user and is required for resetting their password
 *          DateExpires:
 *            type: string
 *            format: date-time
 *            required: true
 *            description: Timestamp of when reset token is no longer valid.
 *          DateCreated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the payment was created.
 */
module.exports = (sequelize, DataTypes) => {
  let UserPasswordResets = sequelize.define(
    "UserPasswordResets",
    {
      PasswordResetID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ResetToken: {
        type: DataTypes.STRING,
        allowNull: false
      },
      IsUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      DateExpires: {
        type: DataTypes.DATE,
        allowNull: false
      },
      DateCreated: {
        type: DataTypes.DATE
      }
    },
    {
      timestamps: true,
      createdAt: "DateCreated",
      updatedAt: false,
      deletedAt: false,
      paranoid: false
    }
  );

  UserPasswordResets.associate = function (models) {};

  return UserPasswordResets;
};
