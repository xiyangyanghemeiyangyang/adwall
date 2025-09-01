// 主应用文件
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

// 导入路由
const authRoutes = require("./routes/auth");
const versionRoutes = require("./routes/versions");
const dashboardRoutes = require("./routes/dashboard");
const memberRoutes = require("./routes/members");
const projectRoutes = require("./routes/projects");

// 导入中间件
const { errorHandler, requestLogger } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());

// 压缩中间件
app.use(compression());

// 请求日志中间件
app.use(requestLogger);

// HTTP请求日志
app.use(morgan("combined"));

// 跨域配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 请求体解析
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 限流中间件
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: "请求过于频繁，请稍后再试",
    code: 429
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// 健康检查端点
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "服务器运行正常",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API路由
app.use("/api/auth", authRoutes);
app.use("/api/versions", versionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/projects", projectRoutes);

// 根路径
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CrmPlus API Server",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      versions: "/api/versions",
      dashboard: "/api/dashboard",
      members: "/api/members",
      projects: "/api/projects",
      health: "/health"
    }
  });
});

// 404处理
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "接口不存在",
    code: 404,
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(` CrmPlus API Server 启动成功!`);
  console.log(` 服务器地址: http://localhost:${PORT}`);
  console.log(` 环境: ${process.env.NODE_ENV || "development"}`);
  console.log(` 启动时间: ${new Date().toLocaleString()}`);
  console.log(` 可用接口:`);
  console.log(`   - 认证接口: http://localhost:${PORT}/api/auth`);
  console.log(`   - 版本管理: http://localhost:${PORT}/api/versions`);
  console.log(`   - 仪表板: http://localhost:${PORT}/api/dashboard`);
  console.log(`   - 成员管理: http://localhost:${PORT}/api/members`);
  console.log(`   - 项目管理: http://localhost:${PORT}/api/projects`);
  console.log(`   - 健康检查: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on("SIGTERM", () => {
  console.log("收到 SIGTERM 信号，正在关闭服务器...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("收到 SIGINT 信号，正在关闭服务器...");
  process.exit(0);
});

module.exports = app;
