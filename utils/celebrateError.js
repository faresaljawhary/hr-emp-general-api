import { isCelebrateError } from 'celebrate';
import { StatusCodes } from 'http-status-codes';

const celebrateErrorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const errorBody = err.details.get('body') || err.details.get('query');
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: errorBody.details[0].message,
      validition: errorBody.details[0]
    });
  }

  return next(err);
};
export default celebrateErrorHandler;
