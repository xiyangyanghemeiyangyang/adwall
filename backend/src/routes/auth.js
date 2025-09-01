// 认证路由
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users, activeTokens } = require("../data/authData");
const { formatResponse } = require("../utils/helpers");

const router = express.Router();

// 用户登录
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json(
        formatResponse(false, null, "用户名和密码不能为空", 400)
      );
    }

    // 查找用户
    const user = users.find(u => u.username === username || u.email === username);
    if (!user) {
      return res.status(401).json(
        formatResponse(false, null, "用户名或密码错误", 401)
      );
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json(
        formatResponse(false, null, "用户名或密码错误", 401)
      );
    }

    // 检查用户状态
    if (user.status !== "active") {
      return res.status(403).json(
        formatResponse(false, null, "账户已被禁用", 403)
      );
    }

    // 生成JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 将token添加到活跃列表
    activeTokens.add(token);

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;

    res.json(formatResponse(true, {
      user: userInfo,
      token
    }, "登录成功"));
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 用户注册
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // 验证必填字段
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json(
        formatResponse(false, null, "所有字段都是必填的", 400)
      );
    }

    // 验证密码确认
    if (password !== confirmPassword) {
      return res.status(400).json(
        formatResponse(false, null, "两次输入的密码不一致", 400)
      );
    }

    // 检查用户名是否已存在
    if (users.find(u => u.username === username)) {
      return res.status(400).json(
        formatResponse(false, null, "用户名已存在", 400)
      );
    }

    // 检查邮箱是否已存在
    if (users.find(u => u.email === email)) {
      return res.status(400).json(
        formatResponse(false, null, "邮箱已存在", 400)
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      role: "developer", // 默认角色
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = newUser;

    res.status(201).json(formatResponse(true, {
      user: userInfo
    }, "注册成功"));
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 用户登出
router.post("/logout", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token && activeTokens.has(token)) {
      activeTokens.delete(token);
    }

    res.json(formatResponse(true, null, "登出成功"));
  } catch (error) {
    console.error("登出错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 获取当前用户信息
router.get("/me", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json(
        formatResponse(false, null, "未提供访问令牌", 401)
      );
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json(
          formatResponse(false, null, "访问令牌无效", 403)
        );
      }

      const user = users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(404).json(
          formatResponse(false, null, "用户不存在", 404)
        );
      }

      const { password: _, ...userInfo } = user;
      res.json(formatResponse(true, { user: userInfo }, "获取用户信息成功"));
    });
  } catch (error) {
    console.error("获取用户信息错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

module.exports = router;
