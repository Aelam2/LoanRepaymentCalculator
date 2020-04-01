const sequelize = require("sequelize");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "Users",
      {
        UserID: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        CreationMethod: {
          type: Sequelize.STRING,
          allowNull: false
        },
        UserName: {
          type: Sequelize.STRING,
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
          type: Sequelize.STRING,
          allowNull: true
        },
        GoogleID: {
          type: Sequelize.STRING,
          allowNull: true
        },
        FacebookID: {
          type: Sequelize.STRING,
          allowNull: true
        },
        FirstName: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            len: {
              args: [0 - 254],
              msg: "Your full name can only be 254 caracters."
            }
          }
        },
        LastName: {
          type: Sequelize.STRING,
          allowNull: true,
          validate: {
            len: {
              args: [0 - 254],
              msg: "Your full name can only be 254 caracters."
            }
          }
        },
        Email: {
          type: Sequelize.STRING,
          unique: true,
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
          type: Sequelize.DATE
        },
        DateCreated: {
          type: Sequelize.DATE
        },
        DateUpdated: {
          type: Sequelize.DATE
        },
        DateDeleted: {
          type: Sequelize.DATE
        }
      },
      {
        timestamps: true,
        createdAt: "DateCreated",
        updatedAt: "DateUpdated",
        deletedAt: "DateDeleted",
        paranoid: true,

        indexes: [
          {
            unique: true,
            fields: ["UserName"],
            where: {
              UserName: {
                [sequelize.Op.ne]: null
              }
            }
          }
        ],

        hooks: {
          beforeCreate: async User => {
            try {
              // Only create password for local authenticated accounts
              if (User.method !== "local") {
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
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  }
};
