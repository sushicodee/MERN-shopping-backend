function errorHandlers(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ message: 'The user is not authorized' });
  }
  if (err.name === 'ValidationError') {
    //  validation error
    return res.status(401).json({ message: err });
  }
  return next({ err, status: 500 });
}

module.exports = errorHandlers;
