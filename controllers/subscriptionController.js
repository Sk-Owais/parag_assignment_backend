const {
    INTERNAL_SERVER_ERROR,
    PRECONDITION_FAILED,
  } = require("../constants/httpStatusCodeConstant.js"),
  {
    handleControllerError,
    handleDataValidation,
  } = require("../helpers/responseHandler.js"),
  zod = require("zod"),
  {
    createSubscriptionService,
    updateSubscriptionService,
    deleteSubscriptionService,
    getAllSubscriptionService,
  } = require("../services/subscriptionServices.js");
const product = require("../models/product.js");

const createSubscriptionController = async (req, res) => {
  try {
    const { error, data } = zod
      .object({
        frequency: zod.string(),
        quantity: zod.number(),
        start_date: zod.string(),
        end_date: zod.string(),
        product_id: zod.string(),
        customer_id: zod.string(),
      })
      .safeParse(req.body);

    if (error) {
      return res.status(PRECONDITION_FAILED.code).json(
        handleDataValidation(
          error.issues?.map((i) => {
            return `${i.path[0]} ${i.message}`;
          })
        )
      );
    }

    const { code, response } = await createSubscriptionService({
      ...data,
      ...req.headers,
    });
    return res.status(code).json(response);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const updateSubscriptionController = async (req, res) => {
  try {
    const { error, data } = zod
      .object({
        frequency: zod.string(),
        quantity: zod.number(),
      })
      .safeParse(req.body);

    if (error) {
      return res.status(PRECONDITION_FAILED.code).json(
        handleDataValidation(
          error.issues?.map((i) => {
            return `${i.path[0]} ${i.message}`;
          })
        )
      );
    }

    const { code, response } = await updateSubscriptionService({
      ...data,
      ...req.params,
      ...req.headers,
    });
    return res.status(code).json(response);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

const deleteSubscriptionController = async (req, res) => {
  try {
    const { code, response } = await deleteSubscriptionService({
      ...req.params,
      ...req.headers,
    });
    return res.status(code).json(response);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};
const getAllSubscriptionController = async (req, res) => {
  try {
    const { code, response } = await getAllSubscriptionService({
      ...req.params,
      ...req.headers,
    });
    return res.status(code).json(response);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};
module.exports = {
  createSubscriptionController,
  updateSubscriptionController,
  getAllSubscriptionController,
  deleteSubscriptionController,
};
