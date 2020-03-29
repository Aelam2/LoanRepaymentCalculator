/**
 * @swagger
 *  components:
 *    schemas:
 *      Loans:
 *        type: object
 *        properties:
 *          LoanID:
 *            type: integer
 *            format: int32
 *            required: true
 *          LoanName:
 *            type: string
 *            required: true
 *          LoanType:
 *            type: string
 *            format: uuid
 *            required: true
 *          UserID:
 *            type: integer
 *            format: int32
 *            required: true
 *          PaymentStart:
 *            type: string
 *            format: date
 *            required: true
 *          LoanTerm:
 *            type: integer
 *            format: int32
 *            required: true
 *          StartingPrinciple:
 *            type: number
 *            format: double
 *            required: true
 *          CurrentPrinciple:
 *            type: number
 *            format: double
 *            required: true
 *          AccruedInterest:
 *            type: number
 *            format: double
 *            required: true
 *          InterestRate:
 *            type: integer
 *            format: float
 *            required: true
 *          MinimumPayment:
 *            type: number
 *            format: double
 *            required: true
 *          StatusID:
 *            type: integer
 *            format: uuid
 *            required: true
 *          DateCreated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the loan was created.
 *          DateUpdated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the loan was last updated.
 *          DateDeleted:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the loan was deleted. Active loans will have a null value.
 *        example:
 *           LoanID: 1
 *           LoanName: My Subsidized Loan #1
 *           LoanType: ge7270e2-0601-36af-da68-4c77423c7329
 *           UserID: 1
 *           PaymentStart: 2020-02-01
 *           LoanTerm: 120
 *           StartingPrinciple: 7500.00
 *           CurrentPrinciple: 7166.75
 *           AccruedInterest: 0.00
 *           InterestRate: 4.25
 *           MinimumPayment: 333.33
 *           StatusID: ae7270e2-0201-36ae-ef68-4c77441j7329
 *           DateCreated: 2020-03-24 11:31:00.5230000 -05:00
 *           DateUpdated: 2020-03-24 13:00:00.6030000 -05:00
 *           DateDeleted: null
 */
module.exports = (sequelize, DataTypes) => {
  const Loans = sequelize.define(
    "Loans",
    {
      LoanID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      LoanName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      LoanType: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: { tableName: "CodeSets" },
          key: "CodeValueID"
        }
      },
      UserID: {
        type: DataTypes.INTEGER,
        references: {
          model: { tableName: "Users" },
          key: "UserID"
        }
      },
      PaymentStart: {
        type: DataTypes.DATE
      },
      LoanTerm: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1
        }
      },
      StartingPrinciple: {
        type: DataTypes.FLOAT,
        validate: {
          min: 1
        }
      },
      CurrentPrinciple: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0
        }
      },
      AccruedInterest: {
        type: DataTypes.FLOAT,
        validate: {
          min: 0
        }
      },
      InterestRate: {
        type: DataTypes.DOUBLE,
        validate: {
          min: 0
        }
      },
      MinimumPayment: {
        type: DataTypes.FLOAT,
        validate: {
          min: 1
        }
      },
      StatusID: {
        type: DataTypes.UUID,
        allowNull: false,
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

  Loans.associate = function(models) {
    Loans.belongsTo(models.Users, {
      foreignKey: "UserID",
      targetKey: "UserID"
    });

    models.CodeSets.belongsTo(Loans, {
      foreignKey: "CodeValueID",
      targetKey: "LoanType"
    });

    models.CodeSets.belongsTo(Loans, {
      foreignKey: "CodeValueID",
      targetKey: "StatusID"
    });
  };

  return Loans;
};
