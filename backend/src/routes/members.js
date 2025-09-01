/**
 * 成员管理相关API路由
 * 包含用户管理、角色管理、部门管理、权限管理等功能
 */

const express = require('express');
const Joi = require('joi');
const { MemberDataService } = require('../data/memberData');
const { validateRequest, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 请求验证模式
const userSchema = Joi.object({
  employeeId: Joi.string().required().messages({
    'string.empty': '工号不能为空',
    'any.required': '工号是必填项'
  }),
  name: Joi.string().required().min(2).max(50).messages({
    'string.empty': '姓名不能为空',
    'string.min': '姓名至少2个字符',
    'string.max': '姓名最多50个字符',
    'any.required': '姓名是必填项'
  }),
  email: Joi.string().email().required().messages({
    'string.email': '邮箱格式不正确',
    'string.empty': '邮箱不能为空',
    'any.required': '邮箱是必填项'
  }),
  phone: Joi.string().pattern(/^1[3-9]\d{9}$/).required().messages({
    'string.pattern.base': '手机号格式不正确',
    'string.empty': '手机号不能为空',
    'any.required': '手机号是必填项'
  }),
  departmentId: Joi.string().required().messages({
    'string.empty': '部门不能为空',
    'any.required': '部门是必填项'
  }),
  position: Joi.string().required().messages({
    'string.empty': '职位不能为空',
    'any.required': '职位是必填项'
  }),
  roleId: Joi.string().required().messages({
    'string.empty': '角色不能为空',
    'any.required': '角色是必填项'
  }),
  reportToId: Joi.string().allow(null, ''),
  status: Joi.string().valid('active', 'pending', 'disabled').default('pending')
});

const roleSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    'string.empty': '角色名称不能为空',
    'string.min': '角色名称至少2个字符',
    'string.max': '角色名称最多50个字符',
    'any.required': '角色名称是必填项'
  }),
  code: Joi.string().required().pattern(/^[A-Z_]+$/).messages({
    'string.pattern.base': '角色代码只能包含大写字母和下划线',
    'string.empty': '角色代码不能为空',
    'any.required': '角色代码是必填项'
  }),
  description: Joi.string().required().max(200).messages({
    'string.empty': '角色描述不能为空',
    'string.max': '角色描述最多200个字符',
    'any.required': '角色描述是必填项'
  }),
  permissions: Joi.array().items(Joi.string()).default([]),
  level: Joi.number().integer().min(1).max(10).required().messages({
    'number.base': '角色等级必须是数字',
    'number.min': '角色等级最小为1',
    'number.max': '角色等级最大为10',
    'any.required': '角色等级是必填项'
  }),
  status: Joi.string().valid('active', 'disabled').default('active')
});

const departmentSchema = Joi.object({
  name: Joi.string().required().min(2).max(50).messages({
    'string.empty': '部门名称不能为空',
    'string.min': '部门名称至少2个字符',
    'string.max': '部门名称最多50个字符',
    'any.required': '部门名称是必填项'
  }),
  code: Joi.string().required().pattern(/^[A-Z_]+$/).messages({
    'string.pattern.base': '部门代码只能包含大写字母和下划线',
    'string.empty': '部门代码不能为空',
    'any.required': '部门代码是必填项'
  }),
  description: Joi.string().max(200).allow(''),
  parentId: Joi.string().allow(null, ''),
  manager: Joi.string().required().messages({
    'string.empty': '负责人不能为空',
    'any.required': '负责人是必填项'
  }),
  managerId: Joi.string().allow(null, ''),
  level: Joi.number().integer().min(1).max(10).required().messages({
    'number.base': '部门层级必须是数字',
    'number.min': '部门层级最小为1',
    'number.max': '部门层级最大为10',
    'any.required': '部门层级是必填项'
  }),
  status: Joi.string().valid('active', 'disabled').default('active')
});

// 应用认证中间件
router.use(authenticateToken);

// ==================== 用户管理相关接口 ====================

/**
 * @route GET /api/members/users
 * @desc 获取用户列表
 * @access Private
 */
router.get('/users', (req, res) => {
  try {
    const { page = 1, limit = 10, department, role, status, search } = req.query;
    
    const filters = {
      department,
      role,
      status,
      search
    };
    
    const users = MemberDataService.getUsers(filters);
    const total = users.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      },
      message: '获取用户列表成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/members/users/:id
 * @desc 获取单个用户信息
 * @access Private
 */
router.get('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = MemberDataService.getUserById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: '获取用户信息成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
});

/**
 * @route POST /api/members/users
 * @desc 创建新用户
 * @access Private
 */
router.post('/users', validateRequest(userSchema), (req, res) => {
  try {
    const userData = req.body;
    
    // 检查邮箱是否已存在
    const existingUser = MemberDataService.getUsers().find(user => user.email === userData.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '邮箱已存在'
      });
    }
    
    // 检查工号是否已存在
    const existingEmployee = MemberDataService.getUsers().find(user => user.employeeId === userData.employeeId);
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: '工号已存在'
      });
    }
    
    const newUser = MemberDataService.createUser(userData);
    
    res.status(201).json({
      success: true,
      data: newUser,
      message: '创建用户成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建用户失败',
      error: error.message
    });
  }
});

/**
 * @route PUT /api/members/users/:id
 * @desc 更新用户信息
 * @access Private
 */
router.put('/users/:id', validateRequest(userSchema), (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    
    const existingUser = MemberDataService.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 检查邮箱是否被其他用户使用
    const emailConflict = MemberDataService.getUsers().find(user => 
      user.email === userData.email && user.id !== id
    );
    if (emailConflict) {
      return res.status(400).json({
        success: false,
        message: '邮箱已被其他用户使用'
      });
    }
    
    // 检查工号是否被其他用户使用
    const employeeConflict = MemberDataService.getUsers().find(user => 
      user.employeeId === userData.employeeId && user.id !== id
    );
    if (employeeConflict) {
      return res.status(400).json({
        success: false,
        message: '工号已被其他用户使用'
      });
    }
    
    const updatedUser = MemberDataService.updateUser(id, userData);
    
    res.json({
      success: true,
      data: updatedUser,
      message: '更新用户信息成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新用户信息失败',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/members/users/:id
 * @desc 删除用户
 * @access Private
 */
router.delete('/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existingUser = MemberDataService.getUserById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    const deleted = MemberDataService.deleteUser(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: '删除用户成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '删除用户失败'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除用户失败',
      error: error.message
    });
  }
});

// ==================== 角色管理相关接口 ====================

/**
 * @route GET /api/members/roles
 * @desc 获取角色列表
 * @access Private
 */
router.get('/roles', (req, res) => {
  try {
    const roles = MemberDataService.getRoles();
    
    res.json({
      success: true,
      data: roles,
      message: '获取角色列表成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取角色列表失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/members/roles/:id
 * @desc 获取单个角色信息
 * @access Private
 */
router.get('/roles/:id', (req, res) => {
  try {
    const { id } = req.params;
    const role = MemberDataService.getRoleById(id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: '角色不存在'
      });
    }
    
    res.json({
      success: true,
      data: role,
      message: '获取角色信息成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取角色信息失败',
      error: error.message
    });
  }
});

/**
 * @route POST /api/members/roles
 * @desc 创建新角色
 * @access Private
 */
router.post('/roles', validateRequest(roleSchema), (req, res) => {
  try {
    const roleData = req.body;
    
    // 检查角色名称是否已存在
    const existingRole = MemberDataService.getRoles().find(role => role.name === roleData.name);
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: '角色名称已存在'
      });
    }
    
    // 检查角色代码是否已存在
    const existingCode = MemberDataService.getRoles().find(role => role.code === roleData.code);
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: '角色代码已存在'
      });
    }
    
    const newRole = MemberDataService.createRole(roleData);
    
    res.status(201).json({
      success: true,
      data: newRole,
      message: '创建角色成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建角色失败',
      error: error.message
    });
  }
});

/**
 * @route PUT /api/members/roles/:id
 * @desc 更新角色信息
 * @access Private
 */
router.put('/roles/:id', validateRequest(roleSchema), (req, res) => {
  try {
    const { id } = req.params;
    const roleData = req.body;
    
    const existingRole = MemberDataService.getRoleById(id);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: '角色不存在'
      });
    }
    
    // 检查角色名称是否被其他角色使用
    const nameConflict = MemberDataService.getRoles().find(role => 
      role.name === roleData.name && role.id !== id
    );
    if (nameConflict) {
      return res.status(400).json({
        success: false,
        message: '角色名称已被其他角色使用'
      });
    }
    
    // 检查角色代码是否被其他角色使用
    const codeConflict = MemberDataService.getRoles().find(role => 
      role.code === roleData.code && role.id !== id
    );
    if (codeConflict) {
      return res.status(400).json({
        success: false,
        message: '角色代码已被其他角色使用'
      });
    }
    
    const updatedRole = MemberDataService.updateRole(id, roleData);
    
    res.json({
      success: true,
      data: updatedRole,
      message: '更新角色信息成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新角色信息失败',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/members/roles/:id
 * @desc 删除角色
 * @access Private
 */
router.delete('/roles/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existingRole = MemberDataService.getRoleById(id);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: '角色不存在'
      });
    }
    
    // 检查是否有用户使用该角色
    const usersWithRole = MemberDataService.getUsers().filter(user => user.roleId === id);
    if (usersWithRole.length > 0) {
      return res.status(400).json({
        success: false,
        message: `无法删除角色，还有 ${usersWithRole.length} 个用户正在使用该角色`
      });
    }
    
    const deleted = MemberDataService.deleteRole(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: '删除角色成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '删除角色失败'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除角色失败',
      error: error.message
    });
  }
});

// ==================== 部门管理相关接口 ====================

/**
 * @route GET /api/members/departments
 * @desc 获取部门列表
 * @access Private
 */
router.get('/departments', (req, res) => {
  try {
    const departments = MemberDataService.getDepartments();
    
    res.json({
      success: true,
      data: departments,
      message: '获取部门列表成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取部门列表失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/members/departments/:id
 * @desc 获取单个部门信息
 * @access Private
 */
router.get('/departments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const department = MemberDataService.getDepartmentById(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: '部门不存在'
      });
    }
    
    res.json({
      success: true,
      data: department,
      message: '获取部门信息成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取部门信息失败',
      error: error.message
    });
  }
});

/**
 * @route POST /api/members/departments
 * @desc 创建新部门
 * @access Private
 */
router.post('/departments', validateRequest(departmentSchema), (req, res) => {
  try {
    const deptData = req.body;
    
    // 检查部门名称是否已存在
    const existingDept = MemberDataService.getDepartments().find(dept => dept.name === deptData.name);
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: '部门名称已存在'
      });
    }
    
    // 检查部门代码是否已存在
    const existingCode = MemberDataService.getDepartments().find(dept => dept.code === deptData.code);
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: '部门代码已存在'
      });
    }
    
    const newDepartment = MemberDataService.createDepartment(deptData);
    
    res.status(201).json({
      success: true,
      data: newDepartment,
      message: '创建部门成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建部门失败',
      error: error.message
    });
  }
});

/**
 * @route PUT /api/members/departments/:id
 * @desc 更新部门信息
 * @access Private
 */
router.put('/departments/:id', validateRequest(departmentSchema), (req, res) => {
  try {
    const { id } = req.params;
    const deptData = req.body;
    
    const existingDept = MemberDataService.getDepartmentById(id);
    if (!existingDept) {
      return res.status(404).json({
        success: false,
        message: '部门不存在'
      });
    }
    
    // 检查部门名称是否被其他部门使用
    const nameConflict = MemberDataService.getDepartments().find(dept => 
      dept.name === deptData.name && dept.id !== id
    );
    if (nameConflict) {
      return res.status(400).json({
        success: false,
        message: '部门名称已被其他部门使用'
      });
    }
    
    // 检查部门代码是否被其他部门使用
    const codeConflict = MemberDataService.getDepartments().find(dept => 
      dept.code === deptData.code && dept.id !== id
    );
    if (codeConflict) {
      return res.status(400).json({
        success: false,
        message: '部门代码已被其他部门使用'
      });
    }
    
    const updatedDepartment = MemberDataService.updateDepartment(id, deptData);
    
    res.json({
      success: true,
      data: updatedDepartment,
      message: '更新部门信息成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新部门信息失败',
      error: error.message
    });
  }
});

/**
 * @route DELETE /api/members/departments/:id
 * @desc 删除部门
 * @access Private
 */
router.delete('/departments/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const existingDept = MemberDataService.getDepartmentById(id);
    if (!existingDept) {
      return res.status(404).json({
        success: false,
        message: '部门不存在'
      });
    }
    
    // 检查是否有用户属于该部门
    const usersInDept = MemberDataService.getUsers().filter(user => user.departmentId === id);
    if (usersInDept.length > 0) {
      return res.status(400).json({
        success: false,
        message: `无法删除部门，还有 ${usersInDept.length} 个用户属于该部门`
      });
    }
    
    // 检查是否有子部门
    const childDepts = MemberDataService.getDepartments().filter(dept => dept.parentId === id);
    if (childDepts.length > 0) {
      return res.status(400).json({
        success: false,
        message: `无法删除部门，还有 ${childDepts.length} 个子部门`
      });
    }
    
    const deleted = MemberDataService.deleteDepartment(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: '删除部门成功'
      });
    } else {
      res.status(500).json({
        success: false,
        message: '删除部门失败'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除部门失败',
      error: error.message
    });
  }
});

// ==================== 权限管理相关接口 ====================

/**
 * @route GET /api/members/permissions
 * @desc 获取权限列表
 * @access Private
 */
router.get('/permissions', (req, res) => {
  try {
    const permissions = MemberDataService.getPermissions();
    
    res.json({
      success: true,
      data: permissions,
      message: '获取权限列表成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取权限列表失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/members/permissions/tree
 * @desc 获取权限树
 * @access Private
 */
router.get('/permissions/tree', (req, res) => {
  try {
    const permissionTree = MemberDataService.getPermissionTree();
    
    res.json({
      success: true,
      data: permissionTree,
      message: '获取权限树成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取权限树失败',
      error: error.message
    });
  }
});

// ==================== 组织架构相关接口 ====================

/**
 * @route GET /api/members/organization/tree
 * @desc 获取组织架构树
 * @access Private
 */
router.get('/organization/tree', (req, res) => {
  try {
    const organizationTree = MemberDataService.getOrganizationTree();
    
    res.json({
      success: true,
      data: organizationTree,
      message: '获取组织架构树成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取组织架构树失败',
      error: error.message
    });
  }
});

/**
 * @route GET /api/members/organization/reports
 * @desc 获取汇报关系
 * @access Private
 */
router.get('/organization/reports', (req, res) => {
  try {
    const reportRelations = MemberDataService.getReportRelations();
    
    res.json({
      success: true,
      data: reportRelations,
      message: '获取汇报关系成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取汇报关系失败',
      error: error.message
    });
  }
});

// ==================== 统计信息相关接口 ====================

/**
 * @route GET /api/members/statistics
 * @desc 获取成员管理统计信息
 * @access Private
 */
router.get('/statistics', (req, res) => {
  try {
    const statistics = MemberDataService.getStatistics();
    
    res.json({
      success: true,
      data: statistics,
      message: '获取统计信息成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取统计信息失败',
      error: error.message
    });
  }
});

module.exports = router;
