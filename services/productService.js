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
const { product: productModel } = initModels(sequelize);
const {
  PRODUCT: { PRODUCT_CREATED_SUCCESS, PRODUCT_CREATED_ERROR },
} = require("../constants/messageConstant");
async function createProductService(data) {
  const { product_name, price_per_unit } = data;
  try {
    const createProduct = await productModel.create({
      product_name,
      price_per_unit,
    });
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        createProduct ? PRODUCT_CREATED_SUCCESS : PRODUCT_CREATED_ERROR,
        !!createProduct,
        { createProduct }
      ),
    };
  } catch (error) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

module.exports = { createProductService };
