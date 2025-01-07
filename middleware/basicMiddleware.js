const {
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR,
    PRECONDITION_FAILED,
  } = require("../constants/httpStatusCodeConstant"),
  { sequelize } = require("../configs/db"),
  {
    handleResponseHandler,
    handleDataValidation,
  } = require("../helpers/responseHandler"),
  { queryOptions } = require("../helpers/databaseHelperFunctions"),
  { initModels } = require("../models/init-models"),
  { customers: customerModel, customer_auth_token: customerAuthTokenModel } =
    initModels(sequelize),
  {
    GlOBAL_ERROR: {
      CHECK_CUSTOMER_ACCESS_TOKEN_ERROR,
      CHECK_CUSTOMER_ACCESS_TOKEN_INVALID,
      CHECK_CUSTOMER_ACCESS_TOKEN_NOT_IN_DATABASE,
    },
  } = require("../constants/messageConstant"),
  zod = require("zod"),
  { verifyJwtToken } = require("../helpers/commonHelperFunctions");

const checkCustomerAccessToken = async (req, res, next) => {
  try {
    const { data, error } = zod
      .object({
        authorization: zod
          .string({
            required_error: "is required",
            invalid_type_error: "should be string",
          })
          .max(2000, { message: "should be less than 2000 characters" })
          .trim(),
      })
      .safeParse({ authorization: req.headers.authorization });

    if (error) {
      return res.status(PRECONDITION_FAILED.code).json(
        handleDataValidation(
          error.issues?.map((i) => {
            return `${i.path[0]} ${i.message}`;
          })
        )
      );
    }

    const isCustomerAuthorizationValid = await verifyJwtToken(
      data?.authorization
    );

    if (!isCustomerAuthorizationValid) {
      return res
        .status(UNAUTHORIZED.code)
        .json(
          handleResponseHandler(
            UNAUTHORIZED.errorCode,
            CHECK_CUSTOMER_ACCESS_TOKEN_INVALID
          )
        );
    }

    const getCustomerDetails = await customerModel.findOne({
      where: {
        customer_id: isCustomerAuthorizationValid?.customer_id,
      },
      attributes: ["customer_id"],
      ...queryOptions,
    });

    const checkAccessTokenExistInDatabase =
      await customerAuthTokenModel.findOne({
        where: {
          token: req.headers.authorization,
          customer_id: getCustomerDetails.customer_id,
        },
      });

    if (!checkAccessTokenExistInDatabase) {
      return res
        .status(UNAUTHORIZED.code)
        .json(
          handleResponseHandler(
            UNAUTHORIZED.errorCode,
            CHECK_CUSTOMER_ACCESS_TOKEN_NOT_IN_DATABASE
          )
        );
    }

    req.headers = {
      ...req.headers,
      tokenData: {
        ...isCustomerAuthorizationValid,
        customer_id: getCustomerDetails.id,
      },
    };
    next();
  } catch (error) {
    console.debug({ error });
    return res
      .status(INTERNAL_SERVER_ERROR.code)
      .json(
        handleResponseHandler(
          INTERNAL_SERVER_ERROR.errorCode,
          CHECK_CUSTOMER_ACCESS_TOKEN_ERROR
        )
      );
  }
};

module.exports = {
  checkCustomerAccessToken,
};
