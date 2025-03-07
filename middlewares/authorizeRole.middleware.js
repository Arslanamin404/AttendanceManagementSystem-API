export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User",
      });
    }
    next(); //proceed if authorized
  };
};
