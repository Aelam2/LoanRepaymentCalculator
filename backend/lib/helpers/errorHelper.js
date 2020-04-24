import { Sequelize } from "../models/models";

const handleSequelizeError = err => {
  let status = null;
  let error = "";
  let result = {
    codeName: "",
    value: ""
  };

  if (err instanceof Sequelize.UniqueConstraintError) {
    status = 409;
    error = err.errors[0].message;
    result = {
      codeName: err.errors[0].path,
      value: err.errors[0].value
    };
  } else if (err instanceof Sequelize.ValidationError) {
    status = 422;
    error = err.errors[0].message;
    result = {
      codeName: err.errors[0].path,
      value: err.errors[0].value
    };
  }
  return { status, error, result };
};

/**
 * @description Throws a constraint error if the Model contains a record where the requested field equals the requested value
 * @param  {Object} model
 * @param  {String} field
 * @param  {String} value
 * @param  {String} errMessage
 */
const isUnique = async (model, field, value, errMessage) => {
  try {
    // Check if model contains an object containing value
    let result = await model.findOne({ where: { [field]: value } });

    // If item exists with value throw error
    if (result) {
      throw new Error(`${model.name} contains row with ${field} = ${value}`);
    }

    // If no row is found, return true
    return true;
  } catch (err) {
    // If item existed with value, return a UniquConstraint Sequelize error
    if (err.message.includes("contains row with")) {
      throw new Sequelize.UniqueConstraintError({
        message: err.message,
        errors: [{ path: field, value: value, message: errMessage || `${field} has already been taken` }]
      });
    }

    throw new Error(err.message);
  }
};

export { isUnique, handleSequelizeError };
