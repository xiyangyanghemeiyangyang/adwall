// 认证中间件
const jwt = require("jsonwebtoken");
const { users, activeTokens } = require("../data/authData");

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "访问令牌缺失",
      code: 401
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "访问令牌无效",
        code: 403
      });
    }

    // 检查token是否在活跃列表中
    if (!activeTokens.has(token)) {
      return res.status(403).json({
        success: false,
        message: "访问令牌已失效",
        code: 403
      });
    }

    req.user = user;
    next();
  });
};

// 角色权限中间件
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "用户未认证",
        code: 401
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "权限不足",
        code: 403
      });
    }

    next();
  };
};

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "服务器内部错误",
    code: err.status || 500,
    timestamp: new Date().toISOString()
  });
};

// 请求日志中间件
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
};

module.exports = {
  authenticateToken,
  authorize,
  errorHandler,
  requestLogger
};
