/**
 * 项目管理路由
 * 处理项目、里程碑、代码审查、分支等API接口
 */

const express = require('express');
const Joi = require('joi');
const projectService = require('../services/projectService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 数据验证模式
const projectSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.empty': '项目名称不能为空',
    'string.min': '项目名称至少1个字符',
    'string.max': '项目名称最多100个字符',
    'any.required': '项目名称是必填项'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': '项目描述最多500个字符'
  }),
  startDate: Joi.string().isoDate().optional().messages({
    'string.isoDate': '开始日期格式不正确'
  }),
  endDate: Joi.string().isoDate().optional().messages({
    'string.isoDate': '结束日期格式不正确'
  }),
  teamMembers: Joi.number().integer().min(1).max(50).optional().messages({
    'number.base': '团队成员数量必须是数字',
    'number.integer': '团队成员数量必须是整数',
    'number.min': '团队成员数量至少1人',
    'number.max': '团队成员数量最多50人'
  }),
  tags: Joi.array().items(Joi.string()).optional().messages({
    'array.base': '标签必须是数组'
  })
});

const milestoneSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': '里程碑标题不能为空',
    'string.min': '里程碑标题至少1个字符',
    'string.max': '里程碑标题最多100个字符',
    'any.required': '里程碑标题是必填项'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': '里程碑描述最多500个字符'
  }),
  dueDate: Joi.string().isoDate().required().messages({
    'string.isoDate': '截止日期格式不正确',
    'any.required': '截止日期是必填项'
  }),
  projectId: Joi.string().required().messages({
    'any.required': '项目ID是必填项'
  }),
  assignedTo: Joi.string().optional()
});

const codeReviewSchema = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    'string.empty': '审查标题不能为空',
    'string.min': '审查标题至少1个字符',
    'string.max': '审查标题最多100个字符',
    'any.required': '审查标题是必填项'
  }),
  author: Joi.string().min(1).max(50).required().messages({
    'string.empty': '作者不能为空',
    'string.min': '作者名称至少1个字符',
    'string.max': '作者名称最多50个字符',
    'any.required': '作者是必填项'
  }),
  reviewer: Joi.string().min(1).max(50).required().messages({
    'string.empty': '审查者不能为空',
    'string.min': '审查者名称至少1个字符',
    'string.max': '审查者名称最多50个字符',
    'any.required': '审查者是必填项'
  }),
  projectId: Joi.string().required().messages({
    'any.required': '项目ID是必填项'
  }),
  branchName: Joi.string().optional(),
  commitHash: Joi.string().optional(),
  description: Joi.string().max(500).optional().messages({
    'string.max': '描述最多500个字符'
  }),
  linesChanged: Joi.number().integer().min(0).optional().messages({
    'number.base': '代码行数必须是数字',
    'number.integer': '代码行数必须是整数',
    'number.min': '代码行数不能为负数'
  }),
  filesChanged: Joi.array().items(Joi.string()).optional().messages({
    'array.base': '文件列表必须是数组'
  })
});

const branchSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    'string.empty': '分支名称不能为空',
    'string.min': '分支名称至少1个字符',
    'string.max': '分支名称最多100个字符',
    'any.required': '分支名称是必填项'
  }),
  type: Joi.string().valid('main', 'develop', 'feature', 'hotfix').optional().messages({
    'any.only': '分支类型必须是 main、develop、feature 或 hotfix 之一'
  }),
  projectId: Joi.string().required().messages({
    'any.required': '项目ID是必填项'
  }),
  author: Joi.string().min(1).max(50).required().messages({
    'string.empty': '作者不能为空',
    'string.min': '作者名称至少1个字符',
    'string.max': '作者名称最多50个字符',
    'any.required': '作者是必填项'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': '描述最多500个字符'
  }),
  isProtected: Joi.boolean().optional()
});

// 通用验证中间件
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: '数据验证失败',
        errors: errorMessages,
        code: 400
      });
    }
    req.validatedData = value;
    next();
  };
};

// 项目管理路由
// 获取所有项目
router.get('/projects', authenticateToken, (req, res) => {
  try {
    const result = projectService.getAllProjects();
    res.json(result);
  } catch (error) {
    console.error('获取项目列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 获取单个项目
router.get('/projects/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.getProjectById(id);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('获取项目详情失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 创建项目
router.post('/projects', authenticateToken, validateRequest(projectSchema), (req, res) => {
  try {
    const result = projectService.createProject(req.validatedData);
    res.status(201).json(result);
  } catch (error) {
    console.error('创建项目失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 更新项目
router.put('/projects/:id', authenticateToken, validateRequest(projectSchema), (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.updateProject(id, req.validatedData);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('更新项目失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 删除项目
router.delete('/projects/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.deleteProject(id);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('删除项目失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 里程碑管理路由
// 获取所有里程碑
router.get('/milestones', authenticateToken, (req, res) => {
  try {
    const { projectId } = req.query;
    let result;
    
    if (projectId) {
      result = projectService.getMilestonesByProject(projectId);
    } else {
      result = projectService.getAllMilestones();
    }
    
    res.json(result);
  } catch (error) {
    console.error('获取里程碑列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 创建里程碑
router.post('/milestones', authenticateToken, validateRequest(milestoneSchema), (req, res) => {
  try {
    const result = projectService.createMilestone(req.validatedData);
    res.status(201).json(result);
  } catch (error) {
    console.error('创建里程碑失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 更新里程碑
router.put('/milestones/:id', authenticateToken, validateRequest(milestoneSchema), (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.updateMilestone(id, req.validatedData);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('更新里程碑失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 删除里程碑
router.delete('/milestones/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.deleteMilestone(id);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('删除里程碑失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 代码审查管理路由
// 获取所有代码审查
router.get('/code-reviews', authenticateToken, (req, res) => {
  try {
    const result = projectService.getAllCodeReviews();
    res.json(result);
  } catch (error) {
    console.error('获取代码审查列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 获取单个代码审查
router.get('/code-reviews/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.getCodeReviewById(id);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('获取代码审查详情失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 创建代码审查
router.post('/code-reviews', authenticateToken, validateRequest(codeReviewSchema), (req, res) => {
  try {
    const result = projectService.createCodeReview(req.validatedData);
    res.status(201).json(result);
  } catch (error) {
    console.error('创建代码审查失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 更新代码审查
router.put('/code-reviews/:id', authenticateToken, validateRequest(codeReviewSchema), (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.updateCodeReview(id, req.validatedData);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('更新代码审查失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 删除代码审查
router.delete('/code-reviews/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.deleteCodeReview(id);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('删除代码审查失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 分支管理路由
// 获取所有分支
router.get('/branches', authenticateToken, (req, res) => {
  try {
    const { projectId } = req.query;
    let result;
    
    if (projectId) {
      result = projectService.getBranchesByProject(projectId);
    } else {
      result = projectService.getAllBranches();
    }
    
    res.json(result);
  } catch (error) {
    console.error('获取分支列表失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 创建分支
router.post('/branches', authenticateToken, validateRequest(branchSchema), (req, res) => {
  try {
    const result = projectService.createBranch(req.validatedData);
    res.status(201).json(result);
  } catch (error) {
    console.error('创建分支失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 更新分支
router.put('/branches/:id', authenticateToken, validateRequest(branchSchema), (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.updateBranch(id, req.validatedData);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('更新分支失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 删除分支
router.delete('/branches/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const result = projectService.deleteBranch(id);
    
    if (!result.success) {
      return res.status(result.code || 404).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('删除分支失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 统计信息路由
// 获取项目统计信息
router.get('/statistics', authenticateToken, (req, res) => {
  try {
    const result = projectService.getProjectStatistics();
    res.json(result);
  } catch (error) {
    console.error('获取统计信息失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

// 获取仪表板数据
router.get('/dashboard', authenticateToken, (req, res) => {
  try {
    const result = projectService.getDashboardData();
    res.json(result);
  } catch (error) {
    console.error('获取仪表板数据失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      code: 500
    });
  }
});

module.exports = router;
