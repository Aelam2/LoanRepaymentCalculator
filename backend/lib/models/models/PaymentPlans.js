/**
 * @swagger
 *  components:
 *    schemas:
 *      PaymentPlans:
 *        type: object
 *        properties:
 *          PaymentPlanID:
 *            type: integer
 *            format: int32
 *            required: true
 *            description: Unique Payment Plan Identifier
 *          UserID:
 *            type: integer
 *            format: int32
 *            required: true
 *            description: Unique User Identifier that payment plan is associated with
 *          PlanName:
 *            type: string
 *            required: true
 *            description: User inputted name for payment plan.
 *          AllocationMethodID:
 *            type: integer
 *            format: uuid
 *            required: true
 *            description: How the payment is dispersed among the user's loans. (Snowball, avalanche, ect...)
 *          IsCurrent:
 *            type: integer
 *            format: int32
 *            required: true
 *            description: Whether this plan is used against loans for calculating charts and analytics
 *          DateCreated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the payment plan was created.
 *          DateUpdated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the payment plan was last updated.
 *          DateDeleted:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when payment plan was deleted. Active payment plan will have a null value.
 *        example:
 *          PaymentPlanID: 1
 *          UserID: 1
 *          PlanName: Fast-Track!
 *          IsCurrent: 1
 *          LastLogin: 2020-03-24 12:12:00.2010000 -05:00
 *          DateCreated: 2020-03-24 11:31:00.5230000 -05:00
 *          DateUpdated: 2020-03-24 13:00:00.6030000 -05:00
 *          DateDeleted: null
 */
module.exports = (sequelize, DataTypes) => {
  const PaymentPlans = sequelize.define(
    "PaymentPlans",
    {
      PaymentPlanID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      UserID: {
        type: DataTypes.INTEGER,
        references: {
          model: { tableName: "Users" },
          key: "UserID"
        },
        allowNull: false
      },
      PlanName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      AllocationMethodID: {
        type: DataTypes.UUID,
        references: {
          model: { tableName: "CodeSets" },
          key: "CodeValueID"
        }
      },
      IsCurrent: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      },
      DateCreated: {
        type: DataTypes.DATE
      },
      DateUpdated: {
        type: DataTypes.DATE
      },
      DateDeleted: {
        type: DataTypes.DATE
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

  PaymentPlans.associate = function (models) {
    PaymentPlans.belongsTo(models.Users, {
      foreignKey: "UserID",
      targetKey: "UserID"
    });

    PaymentPlans.hasMany(models.Payments, {
      foreignKey: "PaymentPlanID",
      targetKey: "PaymentPlanID"
    });

    PaymentPlans.belongsTo(models.CodeSets, {
      foreignKey: "AllocationMethodID",
      targetKey: "CodeValueID",
      as: "AllocationMethod"
    });
  };

  return PaymentPlans;
};
