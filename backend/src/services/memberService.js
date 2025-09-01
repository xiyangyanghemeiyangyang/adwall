/**
 * 成员管理业务逻辑服务层
 * 包含用户、角色、部门、权限等业务逻辑处理
 */

const moment = require('moment');
const { MemberDataService } = require('../data/memberData');

class MemberService {
  // ==================== 用户管理服务 ====================
  
  /**
   * 获取用户列表（带分页和筛选）
   * @param {Object} filters - 筛选条件
   * @param {Object} pagination - 分页参数
   * @returns {Object} 用户列表和分页信息
   */
  static async getUsers(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const users = MemberDataService.getUsers(filters);
      
      // 计算分页
      const total = users.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedUsers = users.slice(startIndex, endIndex);
      
      // 格式化用户数据
      const formattedUsers = paginatedUsers.map(user => ({
        ...user,
        lastLoginFormatted: user.lastLogin ? moment(user.lastLogin).format('YYYY-MM-DD HH:mm:ss') : '从未登录',
        joinDateFormatted: moment(user.joinDate).format('YYYY-MM-DD'),
        statusText: this.getStatusText(user.status)
      }));
      
      return {
        users: formattedUsers,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`获取用户列表失败: ${error.message}`);
    }
  }
  
  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   * @returns {Object} 创建的用户信息
   */
  static async createUser(userData) {
    try {
      // 验证邮箱唯一性
      const existingUser = MemberDataService.getUsers().find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('邮箱已存在');
      }
      
      // 验证工号唯一性
      const existingEmployee = MemberDataService.getUsers().find(user => user.employeeId === userData.employeeId);
      if (existingEmployee) {
        throw new Error('工号已存在');
      }
      
      // 验证部门是否存在
      const department = MemberDataService.getDepartmentById(userData.departmentId);
      if (!department) {
        throw new Error('部门不存在');
      }
      
      // 验证角色是否存在
      const role = MemberDataService.getRoleById(userData.roleId);
      if (!role) {
        throw new Error('角色不存在');
      }
      
      // 设置部门名称
      userData.department = department.name;
      userData.role = role.name;
      
      // 设置默认权限
      if (!userData.permissions) {
        userData.permissions = role.permissions.includes('*') ? ['*'] : [...role.permissions];
      }
      
      const newUser = MemberDataService.createUser(userData);
      
      // 更新部门成员数量
      this.updateDepartmentMemberCount(userData.departmentId);
      
      return newUser;
    } catch (error) {
      throw new Error(`创建用户失败: ${error.message}`);
    }
  }
  
  /**
   * 更新用户信息
   * @param {string} userId - 用户ID
   * @param {Object} userData - 更新的用户数据
   * @returns {Object} 更新后的用户信息
   */
  static async updateUser(userId, userData) {
    try {
      const existingUser = MemberDataService.getUserById(userId);
      if (!existingUser) {
        throw new Error('用户不存在');
      }
      
      // 验证邮箱唯一性（排除当前用户）
      if (userData.email && userData.email !== existingUser.email) {
        const emailConflict = MemberDataService.getUsers().find(user => 
          user.email === userData.email && user.id !== userId
        );
        if (emailConflict) {
          throw new Error('邮箱已被其他用户使用');
        }
      }
      
      // 验证工号唯一性（排除当前用户）
      if (userData.employeeId && userData.employeeId !== existingUser.employeeId) {
        const employeeConflict = MemberDataService.getUsers().find(user => 
          user.employeeId === userData.employeeId && user.id !== userId
        );
        if (employeeConflict) {
          throw new Error('工号已被其他用户使用');
        }
      }
      
      // 验证部门是否存在
      if (userData.departmentId) {
        const department = MemberDataService.getDepartmentById(userData.departmentId);
        if (!department) {
          throw new Error('部门不存在');
        }
        userData.department = department.name;
      }
      
      // 验证角色是否存在
      if (userData.roleId) {
        const role = MemberDataService.getRoleById(userData.roleId);
        if (!role) {
          throw new Error('角色不存在');
        }
        userData.role = role.name;
        
        // 如果角色权限发生变化，更新用户权限
        if (!userData.permissions) {
          userData.permissions = role.permissions.includes('*') ? ['*'] : [...role.permissions];
        }
      }
      
      const updatedUser = MemberDataService.updateUser(userId, userData);
      
      // 如果部门发生变化，更新部门成员数量
      if (userData.departmentId && userData.departmentId !== existingUser.departmentId) {
        this.updateDepartmentMemberCount(existingUser.departmentId);
        this.updateDepartmentMemberCount(userData.departmentId);
      }
      
      return updatedUser;
    } catch (error) {
      throw new Error(`更新用户失败: ${error.message}`);
    }
  }
  
  /**
   * 删除用户
   * @param {string} userId - 用户ID
   * @returns {boolean} 删除结果
   */
  static async deleteUser(userId) {
    try {
      const existingUser = MemberDataService.getUserById(userId);
      if (!existingUser) {
        throw new Error('用户不存在');
      }
      
      const deleted = MemberDataService.deleteUser(userId);
      
      if (deleted) {
        // 更新部门成员数量
        this.updateDepartmentMemberCount(existingUser.departmentId);
      }
      
      return deleted;
    } catch (error) {
      throw new Error(`删除用户失败: ${error.message}`);
    }
  }
  
  // ==================== 角色管理服务 ====================
  
  /**
   * 获取角色列表
   * @returns {Array} 角色列表
   */
  static async getRoles() {
    try {
      const roles = MemberDataService.getRoles();
      
      // 格式化角色数据
      const formattedRoles = roles.map(role => ({
        ...role,
        createdAtFormatted: moment(role.createdAt).format('YYYY-MM-DD'),
        statusText: this.getStatusText(role.status),
        permissionCount: role.permissions.includes('*') ? '全部权限' : role.permissions.length
      }));
      
      return formattedRoles;
    } catch (error) {
      throw new Error(`获取角色列表失败: ${error.message}`);
    }
  }
  
  /**
   * 创建角色
   * @param {Object} roleData - 角色数据
   * @returns {Object} 创建的角色信息
   */
  static async createRole(roleData) {
    try {
      // 验证角色名称唯一性
      const existingRole = MemberDataService.getRoles().find(role => role.name === roleData.name);
      if (existingRole) {
        throw new Error('角色名称已存在');
      }
      
      // 验证角色代码唯一性
      const existingCode = MemberDataService.getRoles().find(role => role.code === roleData.code);
      if (existingCode) {
        throw new Error('角色代码已存在');
      }
      
      const newRole = MemberDataService.createRole(roleData);
      return newRole;
    } catch (error) {
      throw new Error(`创建角色失败: ${error.message}`);
    }
  }
  
  /**
   * 更新角色信息
   * @param {string} roleId - 角色ID
   * @param {Object} roleData - 更新的角色数据
   * @returns {Object} 更新后的角色信息
   */
  static async updateRole(roleId, roleData) {
    try {
      const existingRole = MemberDataService.getRoleById(roleId);
      if (!existingRole) {
        throw new Error('角色不存在');
      }
      
      // 验证角色名称唯一性（排除当前角色）
      if (roleData.name && roleData.name !== existingRole.name) {
        const nameConflict = MemberDataService.getRoles().find(role => 
          role.name === roleData.name && role.id !== roleId
        );
        if (nameConflict) {
          throw new Error('角色名称已被其他角色使用');
        }
      }
      
      // 验证角色代码唯一性（排除当前角色）
      if (roleData.code && roleData.code !== existingRole.code) {
        const codeConflict = MemberDataService.getRoles().find(role => 
          role.code === roleData.code && role.id !== roleId
        );
        if (codeConflict) {
          throw new Error('角色代码已被其他角色使用');
        }
      }
      
      const updatedRole = MemberDataService.updateRole(roleId, roleData);
      
      // 如果角色权限发生变化，更新所有使用该角色的用户权限
      if (roleData.permissions && JSON.stringify(roleData.permissions) !== JSON.stringify(existingRole.permissions)) {
        this.updateUsersPermissionsByRole(roleId, roleData.permissions);
      }
      
      return updatedRole;
    } catch (error) {
      throw new Error(`更新角色失败: ${error.message}`);
    }
  }
  
  /**
   * 删除角色
   * @param {string} roleId - 角色ID
   * @returns {boolean} 删除结果
   */
  static async deleteRole(roleId) {
    try {
      const existingRole = MemberDataService.getRoleById(roleId);
      if (!existingRole) {
        throw new Error('角色不存在');
      }
      
      // 检查是否有用户使用该角色
      const usersWithRole = MemberDataService.getUsers().filter(user => user.roleId === roleId);
      if (usersWithRole.length > 0) {
        throw new Error(`无法删除角色，还有 ${usersWithRole.length} 个用户正在使用该角色`);
      }
      
      const deleted = MemberDataService.deleteRole(roleId);
      return deleted;
    } catch (error) {
      throw new Error(`删除角色失败: ${error.message}`);
    }
  }
  
  // ==================== 部门管理服务 ====================
  
  /**
   * 获取部门列表
   * @returns {Array} 部门列表
   */
  static async getDepartments() {
    try {
      const departments = MemberDataService.getDepartments();
      
      // 格式化部门数据
      const formattedDepartments = departments.map(dept => ({
        ...dept,
        createdAtFormatted: moment(dept.createdAt).format('YYYY-MM-DD'),
        statusText: this.getStatusText(dept.status),
        levelText: `L${dept.level}`
      }));
      
      return formattedDepartments;
    } catch (error) {
      throw new Error(`获取部门列表失败: ${error.message}`);
    }
  }
  
  /**
   * 创建部门
   * @param {Object} deptData - 部门数据
   * @returns {Object} 创建的部门信息
   */
  static async createDepartment(deptData) {
    try {
      // 验证部门名称唯一性
      const existingDept = MemberDataService.getDepartments().find(dept => dept.name === deptData.name);
      if (existingDept) {
        throw new Error('部门名称已存在');
      }
      
      // 验证部门代码唯一性
      const existingCode = MemberDataService.getDepartments().find(dept => dept.code === deptData.code);
      if (existingCode) {
        throw new Error('部门代码已存在');
      }
      
      // 验证上级部门是否存在
      if (deptData.parentId) {
        const parentDept = MemberDataService.getDepartmentById(deptData.parentId);
        if (!parentDept) {
          throw new Error('上级部门不存在');
        }
        
        // 验证层级关系
        if (deptData.level <= parentDept.level) {
          throw new Error('子部门层级必须大于上级部门');
        }
      }
      
      const newDepartment = MemberDataService.createDepartment(deptData);
      return newDepartment;
    } catch (error) {
      throw new Error(`创建部门失败: ${error.message}`);
    }
  }
  
  /**
   * 更新部门信息
   * @param {string} deptId - 部门ID
   * @param {Object} deptData - 更新的部门数据
   * @returns {Object} 更新后的部门信息
   */
  static async updateDepartment(deptId, deptData) {
    try {
      const existingDept = MemberDataService.getDepartmentById(deptId);
      if (!existingDept) {
        throw new Error('部门不存在');
      }
      
      // 验证部门名称唯一性（排除当前部门）
      if (deptData.name && deptData.name !== existingDept.name) {
        const nameConflict = MemberDataService.getDepartments().find(dept => 
          dept.name === deptData.name && dept.id !== deptId
        );
        if (nameConflict) {
          throw new Error('部门名称已被其他部门使用');
        }
      }
      
      // 验证部门代码唯一性（排除当前部门）
      if (deptData.code && deptData.code !== existingDept.code) {
        const codeConflict = MemberDataService.getDepartments().find(dept => 
          dept.code === deptData.code && dept.id !== deptId
        );
        if (codeConflict) {
          throw new Error('部门代码已被其他部门使用');
        }
      }
      
      // 验证上级部门是否存在且不能是自己
      if (deptData.parentId && deptData.parentId === deptId) {
        throw new Error('部门不能将自己设为上级部门');
      }
      
      if (deptData.parentId) {
        const parentDept = MemberDataService.getDepartmentById(deptData.parentId);
        if (!parentDept) {
          throw new Error('上级部门不存在');
        }
        
        // 验证层级关系
        if (deptData.level <= parentDept.level) {
          throw new Error('子部门层级必须大于上级部门');
        }
      }
      
      const updatedDepartment = MemberDataService.updateDepartment(deptId, deptData);
      
      // 如果部门名称发生变化，更新所有用户的部门名称
      if (deptData.name && deptData.name !== existingDept.name) {
        this.updateUsersDepartmentName(deptId, deptData.name);
      }
      
      return updatedDepartment;
    } catch (error) {
      throw new Error(`更新部门失败: ${error.message}`);
    }
  }
  
  /**
   * 删除部门
   * @param {string} deptId - 部门ID
   * @returns {boolean} 删除结果
   */
  static async deleteDepartment(deptId) {
    try {
      const existingDept = MemberDataService.getDepartmentById(deptId);
      if (!existingDept) {
        throw new Error('部门不存在');
      }
      
      // 检查是否有用户属于该部门
      const usersInDept = MemberDataService.getUsers().filter(user => user.departmentId === deptId);
      if (usersInDept.length > 0) {
        throw new Error(`无法删除部门，还有 ${usersInDept.length} 个用户属于该部门`);
      }
      
      // 检查是否有子部门
      const childDepts = MemberDataService.getDepartments().filter(dept => dept.parentId === deptId);
      if (childDepts.length > 0) {
        throw new Error(`无法删除部门，还有 ${childDepts.length} 个子部门`);
      }
      
      const deleted = MemberDataService.deleteDepartment(deptId);
      return deleted;
    } catch (error) {
      throw new Error(`删除部门失败: ${error.message}`);
    }
  }
  
  // ==================== 权限管理服务 ====================
  
  /**
   * 获取权限树
   * @returns {Array} 权限树结构
   */
  static async getPermissionTree() {
    try {
      const permissionTree = MemberDataService.getPermissionTree();
      return permissionTree;
    } catch (error) {
      throw new Error(`获取权限树失败: ${error.message}`);
    }
  }
  
  /**
   * 获取用户权限
   * @param {string} userId - 用户ID
   * @returns {Array} 用户权限列表
   */
  static async getUserPermissions(userId) {
    try {
      const user = MemberDataService.getUserById(userId);
      if (!user) {
        throw new Error('用户不存在');
      }
      
      return user.permissions;
    } catch (error) {
      throw new Error(`获取用户权限失败: ${error.message}`);
    }
  }
  
  // ==================== 组织架构服务 ====================
  
  /**
   * 获取组织架构树
   * @returns {Array} 组织架构树
   */
  static async getOrganizationTree() {
    try {
      const organizationTree = MemberDataService.getOrganizationTree();
      return organizationTree;
    } catch (error) {
      throw new Error(`获取组织架构树失败: ${error.message}`);
    }
  }
  
  /**
   * 获取汇报关系
   * @returns {Array} 汇报关系列表
   */
  static async getReportRelations() {
    try {
      const reportRelations = MemberDataService.getReportRelations();
      return reportRelations;
    } catch (error) {
      throw new Error(`获取汇报关系失败: ${error.message}`);
    }
  }
  
  // ==================== 统计信息服务 ====================
  
  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  static async getStatistics() {
    try {
      const statistics = MemberDataService.getStatistics();
      
      // 添加更多统计信息
      const users = MemberDataService.getUsers();
      const roles = MemberDataService.getRoles();
      const departments = MemberDataService.getDepartments();
      
      // 按部门统计用户数量
      const deptUserStats = departments.map(dept => ({
        departmentId: dept.id,
        departmentName: dept.name,
        userCount: users.filter(user => user.departmentId === dept.id).length
      }));
      
      // 按角色统计用户数量
      const roleUserStats = roles.map(role => ({
        roleId: role.id,
        roleName: role.name,
        userCount: users.filter(user => user.roleId === role.id).length
      }));
      
      return {
        ...statistics,
        departmentStats: deptUserStats,
        roleStats: roleUserStats,
        recentUsers: users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(user => ({
            id: user.id,
            name: user.name,
            department: user.department,
            joinDate: moment(user.joinDate).format('YYYY-MM-DD')
          }))
      };
    } catch (error) {
      throw new Error(`获取统计信息失败: ${error.message}`);
    }
  }
  
  // ==================== 辅助方法 ====================
  
  /**
   * 获取状态文本
   * @param {string} status - 状态值
   * @returns {string} 状态文本
   */
  static getStatusText(status) {
    const statusMap = {
      'active': '正常',
      'pending': '待激活',
      'disabled': '禁用'
    };
    return statusMap[status] || status;
  }
  
  /**
   * 更新部门成员数量
   * @param {string} departmentId - 部门ID
   */
  static updateDepartmentMemberCount(departmentId) {
    const department = MemberDataService.getDepartmentById(departmentId);
    if (department) {
      const memberCount = MemberDataService.getUsers().filter(user => user.departmentId === departmentId).length;
      MemberDataService.updateDepartment(departmentId, { memberCount });
    }
  }
  
  /**
   * 根据角色更新用户权限
   * @param {string} roleId - 角色ID
   * @param {Array} permissions - 权限列表
   */
  static updateUsersPermissionsByRole(roleId, permissions) {
    const usersWithRole = MemberDataService.getUsers().filter(user => user.roleId === roleId);
    usersWithRole.forEach(user => {
      MemberDataService.updateUser(user.id, { permissions });
    });
  }
  
  /**
   * 更新用户部门名称
   * @param {string} departmentId - 部门ID
   * @param {string} departmentName - 部门名称
   */
  static updateUsersDepartmentName(departmentId, departmentName) {
    const usersInDept = MemberDataService.getUsers().filter(user => user.departmentId === departmentId);
    usersInDept.forEach(user => {
      MemberDataService.updateUser(user.id, { department: departmentName });
    });
  }
}

module.exports = MemberService;
