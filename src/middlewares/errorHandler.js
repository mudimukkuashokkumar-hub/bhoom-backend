// src/middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code && err.code.startsWith('ER_')) {
    return res.status(400).json({
      success: false,
      message: 'Database error',
      code: 'DATABASE_ERROR',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR',
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 'NOT_FOUND',
  });
};
