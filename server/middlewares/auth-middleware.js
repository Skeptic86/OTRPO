const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
  try {
    const authorizationHedaer = req.headers.authorization;
    console.log('authHeader: ', authorizationHedaer);
    if (!authorizationHedaer) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHedaer.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};
