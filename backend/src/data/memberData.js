/**
 * 成员管理相关数据模型和模拟数据
 * 包含用户、角色、部门、权限等数据结构
 */

const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// 权限数据
const permissions = [
  // 系统管理权限
  { id: 'system', name: '系统管理', type: 'menu', parentId: null, level: 1 },
  { id: 'user.read', name: '查看用户', type: 'button', parentId: 'user', level: 3 },
  { id: 'user.create', name: '创建用户', type: 'button', parentId: 'user', level: 3 },
  { id: 'user.update', name: '编辑用户', type: 'button', parentId: 'user', level: 3 },
  { id: 'user.delete', name: '删除用户', type: 'button', parentId: 'user', level: 3 },
  { id: 'user', name: '用户管理', type: 'menu', parentId: 'system', level: 2 },
  { id: 'role.read', name: '查看角色', type: 'button', parentId: 'role', level: 3 },
  { id: 'role.create', name: '创建角色', type: 'button', parentId: 'role', level: 3 },
  { id: 'role.update', name: '编辑角色', type: 'button', parentId: 'role', level: 3 },
  { id: 'role.delete', name: '删除角色', type: 'button', parentId: 'role', level: 3 },
  { id: 'role', name: '角色管理', type: 'menu', parentId: 'system', level: 2 },
  
  // 业务管理权限
  { id: 'business', name: '业务管理', type: 'menu', parentId: null, level: 1 },
  { id: 'project.read', name: '查看项目', type: 'button', parentId: 'project', level: 3 },
  { id: 'project.create', name: '创建项目', type: 'button', parentId: 'project', level: 3 },
  { id: 'project.update', name: '编辑项目', type: 'button', parentId: 'project', level: 3 },
  { id: 'project', name: '项目管理', type: 'menu', parentId: 'business', level: 2 },
  
  // 部门管理权限
  { id: 'dept.read', name: '查看部门', type: 'button', parentId: 'dept', level: 3 },
  { id: 'dept.create', name: '创建部门', type: 'button', parentId: 'dept', level: 3 },
  { id: 'dept.update', name: '编辑部门', type: 'button', parentId: 'dept', level: 3 },
  { id: 'dept.delete', name: '删除部门', type: 'button', parentId: 'dept', level: 3 },
  { id: 'dept', name: '部门管理', type: 'menu', parentId: 'system', level: 2 }
];

// 角色数据
let roles = [
  {
    id: 'role_1',
    name: '超级管理员',
    code: 'SUPER_ADMIN',
    description: '拥有系统所有权限，可以管理系统设置',
    permissions: ['*'], // 所有权限
    level: 1,
    status: 'active',
    userCount: 2,
    createdAt: moment().subtract(365, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'role_2',
    name: '部门管理员',
    code: 'DEPT_ADMIN',
    description: '管理本部门用户和资源',
    permissions: ['user.read', 'user.write', 'dept.manage', 'project.read'],
    level: 2,
    status: 'active',
    userCount: 5,
    createdAt: moment().subtract(365, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'role_3',
    name: '普通用户',
    code: 'USER',
    description: '基础用户权限，查看和编辑个人信息',
    permissions: ['user.read', 'profile.edit', 'project.read'],
    level: 3,
    status: 'active',
    userCount: 28,
    createdAt: moment().subtract(365, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'role_4',
    name: '开发者',
    code: 'DEVELOPER',
    description: '开发人员权限，可以访问开发相关功能',
    permissions: ['user.read', 'project.read', 'project.create', 'project.update'],
    level: 2,
    status: 'active',
    userCount: 15,
    createdAt: moment().subtract(200, 'days').toISOString(),
    updatedAt: moment().toISOString()
  }
];

// 部门数据
let departments = [
  {
    id: 'dept_1',
    name: '技术部1',
    code: 'TECH',
    description: '负责产品开发和系统维护',
    parentId: null,
    manager: '李技术总监',
    managerId: 'user_2',
    memberCount: 15,
    level: 1,
    status: 'active',
    createdAt: moment().subtract(365, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'dept_2',
    name: '产品部',
    code: 'PROD',
    description: '负责产品规划和需求分析',
    parentId: null,
    manager: '王产品总监',
    managerId: 'user_3',
    memberCount: 8,
    level: 1,
    status: 'active',
    createdAt: moment().subtract(365, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'dept_3',
    name: '设计部',
    code: 'DESIGN',
    description: '负责产品UI/UX设计',
    parentId: 'dept_2',
    manager: '赵设计主管',
    managerId: 'user_4',
    memberCount: 6,
    level: 2,
    status: 'active',
    createdAt: moment().subtract(300, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'dept_4',
    name: '人事部',
    code: 'HR',
    description: '负责人力资源管理',
    parentId: null,
    manager: '钱人事总监',
    managerId: 'user_5',
    memberCount: 4,
    level: 1,
    status: 'active',
    createdAt: moment().subtract(200, 'days').toISOString(),
    updatedAt: moment().toISOString()
  }
];

// 用户数据
let users = [
  {
    id: 'user_1',
    employeeId: 'U001',
    name: '张三',
    email: 'zhangsan@company.com',
    phone: '13812345678',
    avatar: '',
    departmentId: 'dept_1',
    department: '技术部',
    position: '高级前端工程师',
    roleId: 'role_4',
    role: '开发者',
    permissions: ['user.read', 'user.write', 'project.read', 'project.create'],
    status: 'active',
    lastLogin: moment().subtract(2, 'hours').toISOString(),
    reportTo: '李经理',
    reportToId: 'user_2',
    joinDate: moment().subtract(300, 'days').toISOString(),
    createdAt: moment().subtract(300, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'user_2',
    employeeId: 'U002',
    name: '李四',
    email: 'lisi@company.com',
    phone: '13987654321',
    avatar: '',
    departmentId: 'dept_1',
    department: '技术部',
    position: '技术总监',
    roleId: 'role_2',
    role: '部门管理员',
    permissions: ['user.read', 'user.write', 'admin.system', 'dept.manage'],
    status: 'active',
    lastLogin: moment().subtract(1, 'hour').toISOString(),
    reportTo: '王总监',
    reportToId: 'user_3',
    joinDate: moment().subtract(500, 'days').toISOString(),
    createdAt: moment().subtract(500, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'user_3',
    employeeId: 'U003',
    name: '王五',
    email: 'wangwu@company.com',
    phone: '13555666777',
    avatar: '',
    departmentId: 'dept_2',
    department: '产品部',
    position: '产品总监',
    roleId: 'role_2',
    role: '部门管理员',
    permissions: ['user.read', 'user.write', 'admin.system', 'project.read'],
    status: 'active',
    lastLogin: moment().subtract(30, 'minutes').toISOString(),
    reportTo: null,
    reportToId: null,
    joinDate: moment().subtract(600, 'days').toISOString(),
    createdAt: moment().subtract(600, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'user_4',
    employeeId: 'U004',
    name: '赵六',
    email: 'zhaoliu@company.com',
    phone: '13666777888',
    avatar: '',
    departmentId: 'dept_3',
    department: '设计部',
    position: 'UI设计师',
    roleId: 'role_3',
    role: '普通用户',
    permissions: ['user.read', 'design.read', 'project.read'],
    status: 'pending',
    lastLogin: null,
    reportTo: '王总监',
    reportToId: 'user_3',
    joinDate: moment().subtract(10, 'days').toISOString(),
    createdAt: moment().subtract(10, 'days').toISOString(),
    updatedAt: moment().toISOString()
  },
  {
    id: 'user_5',
    employeeId: 'U005',
    name: '钱七',
    email: 'qianqi@company.com',
    phone: '13777888999',
    avatar: '',
    departmentId: 'dept_4',
    department: '人事部',
    position: '人事总监',
    roleId: 'role_2',
    role: '部门管理员',
    permissions: ['user.read', 'user.write', 'user.create', 'user.update', 'dept.read'],
    status: 'active',
    lastLogin: moment().subtract(1, 'day').toISOString(),
    reportTo: null,
    reportToId: null,
    joinDate: moment().subtract(400, 'days').toISOString(),
    createdAt: moment().subtract(400, 'days').toISOString(),
    updatedAt: moment().toISOString()
  }
];

// 组织架构树形数据
const organizationTree = [
  {
    id: 'company',
    name: '公司总部',
    type: 'company',
    children: [
      {
        id: 'dept_1',
        name: '技术部',
        type: 'department',
        children: [
          { id: 'frontend', name: '前端组', type: 'team' },
          { id: 'backend', name: '后端组', type: 'team' },
          { id: 'test', name: '测试组', type: 'team' }
        ]
      },
      {
        id: 'dept_2',
        name: '产品部',
        type: 'department',
        children: [
          { id: 'dept_3', name: '设计部', type: 'department' },
          { id: 'operation', name: '产品运营组', type: 'team' }
        ]
      },
      {
        id: 'dept_4',
        name: '人事部',
        type: 'department'
      }
    ]
  }
];

// 汇报关系数据
const reportRelations = [
  { from: 'user_1', to: 'user_2', fromName: '张三', toName: '李经理' },
  { from: 'user_2', to: 'user_3', fromName: '李经理', toName: '王总监' },
  { from: 'user_4', to: 'user_3', fromName: '赵六', toName: '王总监' }
];

// 数据操作类
class MemberDataService {
  // 用户相关操作
  static getUsers(filters = {}) {
    let filteredUsers = [...users];
    
    if (filters.department) {
      filteredUsers = filteredUsers.filter(user => user.department === filters.department);
    }
    
    if (filters.role) {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }
    
    if (filters.status) {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.employeeId.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredUsers;
  }
  
  static getUserById(id) {
    return users.find(user => user.id === id);
  }
  
  static createUser(userData) {
    const newUser = {
      id: uuidv4(),
      employeeId: userData.employeeId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar: userData.avatar || '',
      departmentId: userData.departmentId,
      department: userData.department,
      position: userData.position,
      roleId: userData.roleId,
      role: userData.role,
      permissions: userData.permissions || [],
      status: userData.status || 'pending',
      lastLogin: null,
      reportTo: userData.reportTo,
      reportToId: userData.reportToId,
      joinDate: moment().toISOString(),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    };
    
    users.push(newUser);
    return newUser;
  }
  
  static updateUser(id, userData) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      updatedAt: moment().toISOString()
    };
    
    return users[userIndex];
  }
  
  static deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    users.splice(userIndex, 1);
    return true;
  }
  
  // 角色相关操作
  static getRoles() {
    return [...roles];
  }
  
  static getRoleById(id) {
    return roles.find(role => role.id === id);
  }
  
  static createRole(roleData) {
    const newRole = {
      id: uuidv4(),
      name: roleData.name,
      code: roleData.code,
      description: roleData.description,
      permissions: roleData.permissions || [],
      level: roleData.level,
      status: roleData.status || 'active',
      userCount: 0,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    };
    
    roles.push(newRole);
    return newRole;
  }
  
  static updateRole(id, roleData) {
    const roleIndex = roles.findIndex(role => role.id === id);
    if (roleIndex === -1) return null;
    
    roles[roleIndex] = {
      ...roles[roleIndex],
      ...roleData,
      updatedAt: moment().toISOString()
    };
    
    return roles[roleIndex];
  }
  
  static deleteRole(id) {
    const roleIndex = roles.findIndex(role => role.id === id);
    if (roleIndex === -1) return false;
    
    roles.splice(roleIndex, 1);
    return true;
  }
  
  // 部门相关操作
  static getDepartments() {
    return [...departments];
  }
  
  static getDepartmentById(id) {
    return departments.find(dept => dept.id === id);
  }
  
  static createDepartment(deptData) {
    const newDept = {
      id: uuidv4(),
      name: deptData.name,
      code: deptData.code,
      description: deptData.description,
      parentId: deptData.parentId || null,
      manager: deptData.manager,
      managerId: deptData.managerId,
      memberCount: 0,
      level: deptData.level,
      status: deptData.status || 'active',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    };
    
    departments.push(newDept);
    return newDept;
  }
  
  static updateDepartment(id, deptData) {
    const deptIndex = departments.findIndex(dept => dept.id === id);
    if (deptIndex === -1) return null;
    
    departments[deptIndex] = {
      ...departments[deptIndex],
      ...deptData,
      updatedAt: moment().toISOString()
    };
    
    return departments[deptIndex];
  }
  
  static deleteDepartment(id) {
    const deptIndex = departments.findIndex(dept => dept.id === id);
    if (deptIndex === -1) return false;
    
    departments.splice(deptIndex, 1);
    return true;
  }
  
  // 权限相关操作
  static getPermissions() {
    return [...permissions];
  }
  
  static getPermissionTree() {
    return this.buildPermissionTree(permissions);
  }
  
  static buildPermissionTree(permissions, parentId = null) {
    return permissions
      .filter(permission => permission.parentId === parentId)
      .map(permission => ({
        ...permission,
        children: this.buildPermissionTree(permissions, permission.id)
      }));
  }
  
  // 组织架构相关操作
  static getOrganizationTree() {
    return organizationTree;
  }
  
  static getReportRelations() {
    return reportRelations;
  }
  
  // 统计数据
  static getStatistics() {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const pendingUsers = users.filter(user => user.status === 'pending').length;
    const disabledUsers = users.filter(user => user.status === 'disabled').length;
    const totalRoles = roles.length;
    const totalDepartments = departments.length;
    
    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        pending: pendingUsers,
        disabled: disabledUsers
      },
      roles: {
        total: totalRoles
      },
      departments: {
        total: totalDepartments
      }
    };
  }
}

module.exports = {
  MemberDataService,
  permissions,
  roles,
  departments,
  users,
  organizationTree,
  reportRelations
};
