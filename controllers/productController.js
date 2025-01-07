const {
    INTERNAL_SERVER_ERROR,
    PRECONDITION_FAILED,
  } = require("../constants/httpStatusCodeConstant.js"),
  {
    handleControllerError,
    handleDataValidation,
  } = require("../helpers/responseHandler.js"),
  zod = require("zod"),
  { createProductService } = require("../services/productService.js");

const createProductController = async (req, res) => {
  try {
    const { error, data } = zod
      .object({
        product_name: zod.string(),
        price_per_unit: zod.string(),
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

    const { code, response } = await createProductService({
      ...data,
    });
    return res.status(code).json(response);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

module.exports = {
  createProductController,
};
