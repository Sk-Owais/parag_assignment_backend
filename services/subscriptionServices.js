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
  product: productModel,
  subscription: subscriptionModel,
  customers: customerModel,
} = initModels(sequelize);
const { queryOptions } = require("../helpers/databaseHelperFunctions");
const {
  SUBSCRIPTION: {
    SUBSCRIPTION_CREATED_ERROR,
    SUBSCRIPTION_CREATED_SUCCESS,
    SUBSCRIPTION_DELETED_ERROR,
    SUBSCRIPTION_DELETED_SUCCESS,
    SUBSCRIPTION_FETCHED_ERROR,
    SUBSCRIPTION_FETCHED_SUCCESS,
    SUBSCRIPTION_NOT_EXIST,
    SUBSCRIPTION_NOT_FOUND,
    SUBSCRIPTION_UPDATED_ERROR,
    SUBSCRIPTION_UPDATED_SUCCESS,
    SUBSCRIPTION_ALREADY_ENDED,
  },
  USER: { USER_NOT_FOUND },
  PRODUCT: { PRODUCT_NOT_FOUND },
} = require("../constants/messageConstant");

async function createSubscriptionService(data) {
  const { frequency, quantity, start_date, end_date, product_id, customer_id } =
    data;
  try {
    const checkCustomer = await customerModel.findOne({
      where: { customer_id },
      ...queryOptions,
    });
    if (!checkCustomer) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_FOUND),
      };
    }
    const checkProduct = await productModel.findOne({
      where: { product_id },
      ...queryOptions,
    });
    if (!checkProduct) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, PRODUCT_NOT_FOUND),
      };
    }
    const createSubs = {
      product_id,
      customer_id,
      frequency,
      quantity,
      total_price: checkProduct?.price_per_unit * quantity,
      start_date,
      end_date,
    };
    const createSubscription = await subscriptionModel.create(createSubs);
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        createSubscription
          ? SUBSCRIPTION_CREATED_SUCCESS
          : SUBSCRIPTION_CREATED_ERROR,
        !!createSubscription
      ),
    };
  } catch (error) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}

async function updateSubscriptionService(data) {
  const { frequency, quantity, subscription_id } = data;
  try {
    const checkSubscription = await subscriptionModel.findOne({
      where: { subscription_id, is_active: true, is_deleted: false },
      ...queryOptions,
    });
    if (!checkSubscription) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, SUBSCRIPTION_NOT_FOUND),
      };
    }
    const updateSubs = await subscriptionModel.update(
      { frequency, quantity },
      { where: { subscription_id, is_active: true, is_deleted: false } }
    );
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        updateSubs.length > 0
          ? SUBSCRIPTION_UPDATED_SUCCESS
          : SUBSCRIPTION_UPDATED_ERROR,
        !!updateSubs
      ),
    };
  } catch (error) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}
async function deleteSubscriptionService(data) {
  const { subscription_id } = data;
  try {
    const checkSubscription = await subscriptionModel.findOne({
      where: { subscription_id },
      ...queryOptions,
    });
    if (!checkSubscription) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, SUBSCRIPTION_NOT_EXIST),
      };
    }
    if (checkSubscription && checkSubscription.is_deleted) {
      return {
        code: OK.code,
        response: handleResponseHandler(
          OK.errorCode,
          SUBSCRIPTION_ALREADY_ENDED
        ),
      };
    }
    const today = new Date();
    const startDate = new Date(checkSubscription?.start_date);
    const endDate = new Date(checkSubscription?.end_date);
    const calDaysDiff = (startDate, endDate) => {
      return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    };
    if (endDate <= today) {
      return {
        code: OK.code,
        response: handleResponseHandler(
          OK.errorCode,
          SUBSCRIPTION_ALREADY_ENDED
        ),
      };
    }
    const daysDiff = calDaysDiff(startDate, today);
    let cancellation_fee = 0;
    if (daysDiff <= 7) {
      cancellation_fee = 10;
    }
    const softDeleteSubs = await subscriptionModel.update(
      { is_active: false, is_deleted: true },
      { where: { subscription_id } }
    );
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        softDeleteSubs
          ? SUBSCRIPTION_DELETED_SUCCESS
          : SUBSCRIPTION_DELETED_ERROR,
        !!softDeleteSubs,
        { cancellation_fee }
      ),
    };
  } catch (error) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}
async function getAllSubscriptionService(data) {
  const { customer_id } = data;
  try {
    const checkCustomer = await customerModel.findOne({
      where: { customer_id },
      ...queryOptions,
    });
    if (!checkCustomer) {
      return {
        code: OK.code,
        response: handleResponseHandler(OK.errorCode, USER_NOT_FOUND),
      };
    }
    const getSubs = await subscriptionModel.findAll({
      where: { customer_id },
      ...queryOptions,
    });
    return {
      code: OK.code,
      response: handleResponseHandler(
        OK.errorCode,
        getSubs ? SUBSCRIPTION_FETCHED_SUCCESS : SUBSCRIPTION_FETCHED_ERROR,
        !!getSubs,
        { getSubs }
      ),
    };
  } catch (error) {
    return {
      code: INTERNAL_SERVER_ERROR.code,
      response: handleServiceError(error),
    };
  }
}
module.exports = {
  createSubscriptionService,
  updateSubscriptionService,
  deleteSubscriptionService,
  getAllSubscriptionService,
};
