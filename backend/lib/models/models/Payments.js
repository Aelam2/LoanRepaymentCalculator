/**
 * @swagger
 *  components:
 *    schemas:
 *      Payments:
 *        type: object
 *        properties:
 *          PaymentID:
 *            type: integer
 *            format: int32
 *            required: true
 *            description: Unique Payment Identifer
 *          PaymentPlanID:
 *            type: integer
 *            required: true
 *            format: int32
 *            description: Overlying payment plan that current payment is associated with.
 *          PaymentDate:
 *            type: string
 *            format: date-time
 *            required: true
 *            description: Date that payment will be dispersed among loans. Recurring payments wiill use this as reference for future months
 *          PaymentAmount:
 *            type: number
 *            format: float
 *            required: true
 *            description: Amount user's total loan balance will be reduced by after the payment date
 *          RecurringTypeID:
 *            type: integer
 *            format: int32
 *            required: true
 *            description: Whether the payment recurs monthly, yearly, or never.
 *          DateCreated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the payment was created.
 *          DateUpdated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the payment was last updated.
 *          DateDeleted:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when payment was deleted. Active payments will have a null value.
 *        example:
 *          PaymentID: 1
 *          PaymentPlanID: 1
 *          PaymentDate: 2020-04-01
 *          PaymentAmount: 333.25
 *          AllocationMethodID: 4
 *          IsRecurring: 1
 *          DateCreated: 2020-03-24 11:31:00.5230000 -05:00
 *          DateUpdated: 2020-03-24 13:00:00.6030000 -05:00
 *          DateDeleted: null
 */
module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define(
    "Payments",
    {
      PaymentID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      PaymentPlanID: {
        type: DataTypes.INTEGER,
        references: {
          model: { tableName: "PaymentPlans" },
          key: "PaymentPlanID"
        }
      },
      PaymentDate: {
        type: DataTypes.DATE
      },
      PaymentAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      RecurringTypeID: {
        type: DataTypes.UUID,
        references: {
          model: { tableName: "CodeSets" },
          key: "CodeValueID"
        }
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

  Payments.associate = function (models) {
    Payments.belongsTo(models.PaymentPlans, {
      foreignKey: "PaymentPlanID",
      targetKey: "PaymentPlanID"
    });
  };

  return Payments;
};
