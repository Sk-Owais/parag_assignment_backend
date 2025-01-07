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
const {
  customers: customerModel,
  customer_auth_token: customerAuthTokenModel,
} = initModels(sequelize);
const {
  USER: { USER_CREATED_ERROR, USER_CREATED_SUCCESS },
} = require("../constants/messageConstant");
const { generateJwtToken } = require("../helpers/commonHelperFunctions");
const{queryOptions}=require('../helpers/databaseHelperFunctions')
async function createUserService(data) {
  const { customer_name, customer_email } = data;
  try {
    const createCustomer = await customerModel.create({
      customer_name,
      customer_email,
    });
    const accessToken = await generateJwtToken(
      {
        email: customer_email,
        token_type: "ACCESS_TOKEN",
        customer_id: createCustomer?.customer_id,
      },
      60 * 60 * 24
    );
    const createAuthSessionInDatabase = await customerAuthTokenModel.create(
      {
        token: accessToken,
        customer_id: createCustomer?.customer_id,
      },
      { ...queryOptions }
    );
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        createCustomer ? USER_CREATED_SUCCESS : USER_CREATED_ERROR,
        !!createCustomer,
        {
          createCustomer,
          access_token: createAuthSessionInDatabase?.token,
        }
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
