// 版本管理路由
const express = require("express");
const { versionData, deploymentData } = require("../data/versionData");
const { formatResponse, paginate, filterData, sortData, generateId, validateVersion } = require("../utils/helpers");
const { authenticateToken, authorize } = require("../middleware/auth");

const router = express.Router();

// 获取版本列表
router.get("/", authenticateToken, (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      priority, 
      developer, 
      sortBy = "createdAt", 
      sortOrder = "desc" 
    } = req.query;

    let filteredData = [...versionData];

    // 应用过滤器
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (developer) filters.developer = developer;

    if (Object.keys(filters).length > 0) {
      filteredData = filterData(filteredData, filters);
    }

    // 应用排序
    filteredData = sortData(filteredData, sortBy, sortOrder);

    // 应用分页
    const result = paginate(filteredData, page, limit);

    res.json(formatResponse(true, result, "获取版本列表成功"));
  } catch (error) {
    console.error("获取版本列表错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 获取单个版本详情
router.get("/:id", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const version = versionData.find(v => v.id === parseInt(id));

    if (!version) {
      return res.status(404).json(
        formatResponse(false, null, "版本不存在", 404)
      );
    }

    res.json(formatResponse(true, version, "获取版本详情成功"));
  } catch (error) {
    console.error("获取版本详情错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 创建新版本
router.post("/", authenticateToken, authorize(["admin", "manager"]), (req, res) => {
  try {
    const { version, name, description, releaseDate, priority, developer } = req.body;

    // 验证必填字段
    if (!version || !name || !releaseDate || !developer) {
      return res.status(400).json(
        formatResponse(false, null, "版本号、名称、发布日期和开发者是必填字段", 400)
      );
    }

    // 验证版本号格式
    if (!validateVersion(version)) {
      return res.status(400).json(
        formatResponse(false, null, "版本号格式不正确，应为 v1.0.0 格式", 400)
      );
    }

    // 检查版本号是否已存在
    if (versionData.find(v => v.version === version)) {
      return res.status(400).json(
        formatResponse(false, null, "版本号已存在", 400)
      );
    }

    // 创建新版本
    const newVersion = {
      id: generateId(),
      version,
      name,
      description: description || "",
      releaseDate,
      status: "开发中",
      priority: priority || "中",
      developer,
      testStatus: "未测试",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    versionData.push(newVersion);

    res.status(201).json(formatResponse(true, newVersion, "版本创建成功"));
  } catch (error) {
    console.error("创建版本错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 更新版本
router.put("/:id", authenticateToken, authorize(["admin", "manager"]), (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const versionIndex = versionData.findIndex(v => v.id === parseInt(id));
    if (versionIndex === -1) {
      return res.status(404).json(
        formatResponse(false, null, "版本不存在", 404)
      );
    }

    // 如果更新版本号，验证格式和唯一性
    if (updateData.version) {
      if (!validateVersion(updateData.version)) {
        return res.status(400).json(
          formatResponse(false, null, "版本号格式不正确", 400)
        );
      }

      const existingVersion = versionData.find(v => v.version === updateData.version && v.id !== parseInt(id));
      if (existingVersion) {
        return res.status(400).json(
          formatResponse(false, null, "版本号已存在", 400)
        );
      }
    }

    // 更新版本
    versionData[versionIndex] = {
      ...versionData[versionIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json(formatResponse(true, versionData[versionIndex], "版本更新成功"));
  } catch (error) {
    console.error("更新版本错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 删除版本
router.delete("/:id", authenticateToken, authorize(["admin"]), (req, res) => {
  try {
    const { id } = req.params;
    const versionIndex = versionData.findIndex(v => v.id === parseInt(id));

    if (versionIndex === -1) {
      return res.status(404).json(
        formatResponse(false, null, "版本不存在", 404)
      );
    }

    // 检查版本状态，已发布的版本不能删除
    if (versionData[versionIndex].status === "已发布") {
      return res.status(400).json(
        formatResponse(false, null, "已发布的版本不能删除", 400)
      );
    }

    versionData.splice(versionIndex, 1);

    res.json(formatResponse(true, null, "版本删除成功"));
  } catch (error) {
    console.error("删除版本错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 版本回滚
router.post("/:id/rollback", authenticateToken, authorize(["admin", "manager"]), (req, res) => {
  try {
    const { id } = req.params;
    const { rollbackVersion } = req.body;

    if (!rollbackVersion) {
      return res.status(400).json(
        formatResponse(false, null, "回滚版本号不能为空", 400)
      );
    }

    const versionIndex = versionData.findIndex(v => v.id === parseInt(id));
    if (versionIndex === -1) {
      return res.status(404).json(
        formatResponse(false, null, "版本不存在", 404)
      );
    }

    // 检查回滚版本是否存在
    const rollbackVersionExists = versionData.find(v => v.version === rollbackVersion);
    if (!rollbackVersionExists) {
      return res.status(400).json(
        formatResponse(false, null, "回滚版本不存在", 400)
      );
    }

    // 更新版本状态
    versionData[versionIndex] = {
      ...versionData[versionIndex],
      status: "已回滚",
      rollbackVersion,
      updatedAt: new Date().toISOString()
    };

    res.json(formatResponse(true, versionData[versionIndex], "版本回滚成功"));
  } catch (error) {
    console.error("版本回滚错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 获取部署列表
router.get("/deployments/list", authenticateToken, (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      environment, 
      status, 
      version,
      sortBy = "deployTime", 
      sortOrder = "desc" 
    } = req.query;

    let filteredData = [...deploymentData];

    // 应用过滤器
    const filters = {};
    if (environment) filters.environment = environment;
    if (status) filters.status = status;
    if (version) filters.version = version;

    if (Object.keys(filters).length > 0) {
      filteredData = filterData(filteredData, filters);
    }

    // 应用排序
    filteredData = sortData(filteredData, sortBy, sortOrder);

    // 应用分页
    const result = paginate(filteredData, page, limit);

    res.json(formatResponse(true, result, "获取部署列表成功"));
  } catch (error) {
    console.error("获取部署列表错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 创建部署任务
router.post("/deployments", authenticateToken, authorize(["admin", "manager"]), (req, res) => {
  try {
    const { environment, version, operator } = req.body;

    if (!environment || !version || !operator) {
      return res.status(400).json(
        formatResponse(false, null, "环境、版本和操作员是必填字段", 400)
      );
    }

    // 检查版本是否存在
    const versionExists = versionData.find(v => v.version === version);
    if (!versionExists) {
      return res.status(400).json(
        formatResponse(false, null, "版本不存在", 400)
      );
    }

    // 创建部署任务
    const newDeployment = {
      id: generateId(),
      environment,
      version,
      deployTime: new Date().toISOString().replace("T", " ").substring(0, 19),
      status: "部署中",
      progress: 0,
      operator,
      duration: "0分钟",
      logs: ["开始部署..."],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    deploymentData.push(newDeployment);

    res.status(201).json(formatResponse(true, newDeployment, "部署任务创建成功"));
  } catch (error) {
    console.error("创建部署任务错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

module.exports = router;
