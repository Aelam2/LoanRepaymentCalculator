import bcrypt from "bcryptjs";

/**
 * @swagger
 *  components:
 *    schemas:
 *      Users:
 *        type: object
 *        properties:
 *          UserID:
 *            type: integer
 *            required: true
 *            description: Unique User Indentifier
 *          UserName:
 *            type: string
 *            required: true
 *            description: User inputted value used for future logins
 *          FirstName:
 *            type: string
 *            nullable: true
 *            description: User's First Name.
 *          LastName:
 *            type: string
 *            nullable: true
 *            description: User's Last Name.
 *          Email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *          LastLogin:
 *            type: string
 *            format: date-time
 *            description: Timestamp of last time a user logged in.
 *          DateCreated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the user's account was created.
 *          DateUpdated:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when the user's account was last updated.
 *          DateDeleted:
 *            type: string
 *            format: date-time
 *            description: Timestamp of when user's account was deleted. Active accounts will have a null value.
 *        example:
 *          UserID: 1
 *          UserName: Aelam
 *          FirstName: Alex
 *          LastName: Elam
 *          Email: "james@alexelam.dev"
 *          LastLogin: 2020-03-24 12:12:00.2010000 -05:00
 *          DateCreated: 2020-03-24 11:31:00.5230000 -05:00
 *          DateUpdated: 2020-03-24 13:00:00.6030000 -05:00
 *          DateDeleted: null
 */

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      CreationMethod: {
        type: DataTypes.STRING,
        allowNull: false
      },
      UserName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [3, 40],
            msg: "Username must start with a letter, have no spaces, and be between 3 to 40 characters."
          },
          is: {
            args: /^[A-Za-z][A-Za-z0-9-]+$/i, // must start with letter and only have letters, numbers, dashes
            msg: "Username must start with a letter, have no spaces, and be 3 - 40 characters."
          }
        }
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      GoogleID: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: "Google account already exists"
        }
      },
      FacebookID: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: "Facebook account already exists"
        }
      },
      FirstName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0 - 254],
            msg: "Your full name can only be 254 caracters."
          }
        }
      },
      LastName: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: {
            args: [0 - 254],
            msg: "Your full name can only be 254 caracters."
          }
        }
      },
      Email: {
        type: DataTypes.STRING,
        unique: {
          msg: "Email has already been taken"
        },
        validate: {
          isEmail: {
            args: true,
            msg: "The email you entered is invalid or is already in our system."
          },
          len: {
            args: [1 - 254],
            msg: "The email you entered is invalid or longer than 254 characters."
          }
        }
      },
      LastLogin: {
        type: DataTypes.DATE
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
      paranoid: true,

      hooks: {
        beforeCreate: async User => {
          try {
            // Only create password for local authenticated accounts
            if (User.CreationMethod !== "local") {
              return;
            }

            // Generate salt
            const salt = await bcrypt.genSalt(10);

            // Hash password - Salt + Password
            User.Password = await bcrypt.hash(User.Password, salt);
          } catch (err) {
            throw new Error(err);
          }
        }
      },

      defaultScope: {
        attributes: { exclude: ["Password"] }
      },

      scopes: {
        withPassword: {
          attributes: {}
        }
      }
    }
  );

  // Check plain-text password against hashed password
  Users.prototype.isValidPassword = async function(password) {
    console.log(password, this.Password);
    return await bcrypt.compare(password, this.Password);
  };

  Users.associate = function(models) {
    // associations can be defined here
  };

  return Users;
};
