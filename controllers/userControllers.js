const {
    INTERNAL_SERVER_ERROR,
    PRECONDITION_FAILED,
  } = require("../constants/httpStatusCodeConstant.js"),
  {
    handleControllerError,
    handleDataValidation,
  } = require("../helpers/responseHandler.js"),
  zod = require("zod"),
  { createUserService } = require("../services/userService.js");

const createUserController = async (req, res) => {
  try {
    const { error, data } = zod
      .object({
        customer_name: zod.string(),
        customer_email: zod.string(),
        customer_password: zod.string(),
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

    const { code, response } = await createUserService({
      ...data,
    });
    return res.status(code).json(response);
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR?.code).json(handleControllerError(error));
  }
};

module.exports = {
  createUserController,
};
