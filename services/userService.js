const {
  INTERNAL_SERVER_ERROR,
  OK,
} = require("../constants/httpStatusCodeConstant");
const {
  handleServiceError,
  handleResponseHandler,
} = require("../helpers/responseHandler");
const { sequelize } = require("../configs/db");
const { initModels } = require("../models/init-models");
const { customers: customerModel } = initModels(sequelize);
const {
  USER: { USER_CREATED_ERROR, USER_CREATED_SUCCESS },
} = require("../constants/messageConstant");
async function createUserService(data) {
  const { customer_name } = data;
  try {
    const createCustomer = await customerModel.create({ customer_name });
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        createCustomer ? USER_CREATED_SUCCESS : USER_CREATED_ERROR,
        !!createCustomer,
        { createCustomer }
      ),
    };
  } catch (error) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

module.exports = { createUserService };
