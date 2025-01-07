const {
    INTERNAL_SERVER_ERROR,
    PRECONDITION_FAILED
  } = require("../constants/httpStatusCodeConstant"),
  { DEBUG } = require('../configs/config'),
  {
    GlOBAL_ERROR: { CONTROLLER_ERROR, SERVICE_ERROR, DATA_VALIDATION }
  } = require("../constants/messageConstant");

const handleResponseHandler = (
  statusCode = INTERNAL_SERVER_ERROR.message,
  message = "Internal server error",
  success = false,
  data = {},
  error = {}
) => {
  return { statusCode, success, message, data, error };
};

const handleControllerError = (e) => {
  DEBUG && e && console.debug(e);
  return handleResponseHandler(
    INTERNAL_SERVER_ERROR.errorCode,
    CONTROLLER_ERROR
  );
};

const handleServiceError = (e) => {
  DEBUG && e && console.debug(e);
  return handleResponseHandler(INTERNAL_SERVER_ERROR.errorCode, SERVICE_ERROR);
};

const handleDataValidation = (validationErrorArr) => {
  return handleResponseHandler(
    PRECONDITION_FAILED.errorCode,
    DATA_VALIDATION,
    false,
    {},
    {
      validationErrorArr
    }
  );
};

module.exports = {
  handleResponseHandler,
  handleControllerError,
  handleServiceError,
  handleDataValidation
};
