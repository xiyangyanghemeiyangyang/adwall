// 认证中间件
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { users, activeTokens } = require("../data/authData");
const { MemberDataService } = require("../data/memberData");

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

// 权限验证中间件
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "用户未认证",
        code: 401
      });
    }

    // 获取用户详细信息
    const user = MemberDataService.getUserById(req.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "用户不存在",
        code: 401
      });
    }

    // 检查用户权限
    const hasPermission = user.permissions.includes('*') || user.permissions.includes(permission);
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "权限不足，无法执行此操作",
        code: 403
      });
    }

    next();
  };
};

// 请求验证中间件
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: "请求参数验证失败",
        errors: errorMessage,
        code: 400
      });
    }
    
    next();
  };
};

// 管理员权限中间件
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "用户未认证",
      code: 401
    });
  }

  const user = MemberDataService.getUserById(req.user.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "用户不存在",
      code: 401
    });
  }

  // 检查是否为管理员角色
  const isAdmin = user.role === '超级管理员' || user.role === '管理员' || user.permissions.includes('*');
  
  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "需要管理员权限",
      code: 403
    });
  }

  next();
};

// 部门权限中间件
const checkDepartmentAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "用户未认证",
      code: 401
    });
  }

  const user = MemberDataService.getUserById(req.user.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "用户不存在",
      code: 401
    });
  }

  // 超级管理员可以访问所有部门
  if (user.permissions.includes('*') || user.role === '超级管理员') {
    return next();
  }

  // 部门管理员只能管理自己的部门
  if (user.role === '部门管理员') {
    const targetDepartmentId = req.params.departmentId || req.body.departmentId;
    if (targetDepartmentId && targetDepartmentId !== user.departmentId) {
      return res.status(403).json({
        success: false,
        message: "只能管理自己部门的用户",
        code: 403
      });
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  authorize,
  errorHandler,
  requestLogger,
  checkPermission,
  validateRequest,
  requireAdmin,
  checkDepartmentAccess
};
