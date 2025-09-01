// Dashboard 路由
const express = require("express");
const { statisticsData, accountApplications } = require("../data/dashboardData");
const { formatResponse, paginate, filterData, sortData } = require("../utils/helpers");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// 获取统计数据
router.get("/statistics", authenticateToken, (req, res) => {
  try {
    res.json(formatResponse(true, statisticsData, "获取统计数据成功"));
  } catch (error) {
    console.error("获取统计数据错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 获取账号申请列表
router.get("/applications", authenticateToken, (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      region, 
      type,
      sortBy = "createTime", 
      sortOrder = "desc" 
    } = req.query;

    let filteredData = [...accountApplications];

    // 应用过滤器
    const filters = {};
    if (status) filters.status = status;
    if (region) filters.region = region;
    if (type) filters.type = type;

    if (Object.keys(filters).length > 0) {
      filteredData = filterData(filteredData, filters);
    }

    // 应用排序
    filteredData = sortData(filteredData, sortBy, sortOrder);

    // 应用分页
    const result = paginate(filteredData, page, limit);

    res.json(formatResponse(true, result, "获取账号申请列表成功"));
  } catch (error) {
    console.error("获取账号申请列表错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 更新申请状态
router.put("/applications/:id/status", authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json(
        formatResponse(false, null, "状态不能为空", 400)
      );
    }

    const validStatuses = ["待审核", "已通过", "已拒绝"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(
        formatResponse(false, null, "无效的状态值", 400)
      );
    }

    const applicationIndex = accountApplications.findIndex(app => app.id === parseInt(id));
    if (applicationIndex === -1) {
      return res.status(404).json(
        formatResponse(false, null, "申请记录不存在", 404)
      );
    }

    // 更新状态
    accountApplications[applicationIndex].status = status;

    res.json(formatResponse(true, accountApplications[applicationIndex], "状态更新成功"));
  } catch (error) {
    console.error("更新申请状态错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

// 获取仪表板概览数据
router.get("/overview", authenticateToken, (req, res) => {
  try {
    const overview = {
      statistics: statisticsData,
      recentApplications: accountApplications.slice(0, 5), // 最近5条申请
      totalApplications: accountApplications.length,
      pendingApplications: accountApplications.filter(app => app.status === "待审核").length,
      approvedApplications: accountApplications.filter(app => app.status === "已通过").length,
      rejectedApplications: accountApplications.filter(app => app.status === "已拒绝").length
    };

    res.json(formatResponse(true, overview, "获取仪表板概览成功"));
  } catch (error) {
    console.error("获取仪表板概览错误:", error);
    res.status(500).json(
      formatResponse(false, null, "服务器内部错误", 500)
    );
  }
});

module.exports = router;
