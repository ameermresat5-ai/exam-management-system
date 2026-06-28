const roleMiddleware = (...allowedRoles) => {
  const roles = allowedRoles.flat();

  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("Authentication is required.");
      error.statusCode = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error("You do not have permission to access this resource.");
      error.statusCode = 403;
      return next(error);
    }

    return next();
  };
};

module.exports = roleMiddleware;
