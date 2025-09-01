/**
 * 项目管理数据模型
 * 包含项目、里程碑、代码审查、分支等开发管理相关数据
 */

const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// 项目数据
let projects = [
  {
    id: '1',
    name: 'CRM系统升级',
    description: '升级现有CRM系统，增加新功能和优化用户体验',
    progress: 75,
    status: '进行中',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    teamMembers: 8,
    tasks: { total: 24, completed: 18, pending: 6 },
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-02-10T15:30:00Z',
    createdBy: 'admin',
    tags: ['CRM', '升级', '前端', '后端']
  },
  {
    id: '2',
    name: '移动端应用开发',
    description: '开发配套的移动端应用，支持iOS和Android平台',
    progress: 45,
    status: '进行中',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    teamMembers: 6,
    tasks: { total: 32, completed: 14, pending: 18 },
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-10T14:20:00Z',
    createdBy: 'admin',
    tags: ['移动端', 'iOS', 'Android', 'React Native']
  },
  {
    id: '3',
    name: '数据分析平台',
    description: '构建数据分析平台，提供实时数据监控和报表功能',
    progress: 100,
    status: '已完成',
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    teamMembers: 5,
    tasks: { total: 18, completed: 18, pending: 0 },
    createdAt: '2023-11-01T08:30:00Z',
    updatedAt: '2024-01-31T17:00:00Z',
    createdBy: 'admin',
    tags: ['数据分析', '监控', '报表', 'Python']
  }
];

// 里程碑数据
let milestones = [
  {
    id: '1',
    title: '用户界面设计完成',
    description: '完成所有页面的UI/UX设计',
    dueDate: '2024-02-15',
    status: '已完成',
    progress: 100,
    projectId: '1',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-02-15T17:00:00Z',
    completedAt: '2024-02-15T17:00:00Z',
    assignedTo: 'designer1'
  },
  {
    id: '2',
    title: '后端API开发',
    description: '完成核心业务逻辑和API接口开发',
    dueDate: '2024-02-28',
    status: '进行中',
    progress: 80,
    projectId: '1',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-02-10T15:30:00Z',
    completedAt: null,
    assignedTo: 'developer1'
  },
  {
    id: '3',
    title: '移动端原型设计',
    description: '完成移动端应用的原型设计',
    dueDate: '2024-03-10',
    status: '进行中',
    progress: 60,
    projectId: '2',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-10T14:20:00Z',
    completedAt: null,
    assignedTo: 'designer2'
  }
];

// 代码审查数据
let codeReviews = [
  {
    id: '1',
    title: '用户管理模块重构',
    author: '张三',
    reviewer: '李四',
    status: '待审查',
    createTime: '2024-02-10T14:30:00Z',
    linesChanged: 156,
    comments: 0,
    projectId: '1',
    branchName: 'feature/user-management',
    commitHash: 'abc123def456',
    description: '重构用户管理模块，优化代码结构和性能',
    filesChanged: ['src/components/UserManagement.tsx', 'src/services/userService.ts'],
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z'
  },
  {
    id: '2',
    title: 'API接口优化',
    author: '王五',
    reviewer: '赵六',
    status: '审查中',
    createTime: '2024-02-09T16:45:00Z',
    linesChanged: 89,
    comments: 3,
    projectId: '1',
    branchName: 'feature/api-optimization',
    commitHash: 'def456ghi789',
    description: '优化API接口响应时间和错误处理',
    filesChanged: ['src/routes/api.js', 'src/middleware/errorHandler.js'],
    createdAt: '2024-02-09T16:45:00Z',
    updatedAt: '2024-02-10T10:20:00Z'
  },
  {
    id: '3',
    title: '数据库查询优化',
    author: '钱七',
    reviewer: '孙八',
    status: '已通过',
    createTime: '2024-02-08T10:20:00Z',
    linesChanged: 234,
    comments: 1,
    projectId: '3',
    branchName: 'feature/db-optimization',
    commitHash: 'ghi789jkl012',
    description: '优化数据库查询性能，添加索引和缓存',
    filesChanged: ['src/models/User.js', 'src/services/database.js'],
    createdAt: '2024-02-08T10:20:00Z',
    updatedAt: '2024-02-09T15:30:00Z',
    approvedAt: '2024-02-09T15:30:00Z'
  }
];

// 分支数据
let branches = [
  {
    id: '1',
    name: 'main',
    type: 'main',
    lastCommit: '2024-02-10T15:30:00Z',
    author: '张三',
    status: '活跃',
    commits: 156,
    projectId: '1',
    description: '主分支，用于生产环境',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-02-10T15:30:00Z',
    lastCommitHash: 'main123abc456',
    isProtected: true
  },
  {
    id: '2',
    name: 'develop',
    type: 'develop',
    lastCommit: '2024-02-10T14:20:00Z',
    author: '李四',
    status: '活跃',
    commits: 89,
    projectId: '1',
    description: '开发分支，用于集成测试',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-02-10T14:20:00Z',
    lastCommitHash: 'develop456def789',
    isProtected: true
  },
  {
    id: '3',
    name: 'feature/user-management',
    type: 'feature',
    lastCommit: '2024-02-09T16:45:00Z',
    author: '王五',
    status: '活跃',
    commits: 23,
    projectId: '1',
    description: '用户管理功能开发分支',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-09T16:45:00Z',
    lastCommitHash: 'feature789ghi012',
    isProtected: false
  }
];

// 项目统计信息
const getProjectStats = () => {
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === '进行中').length;
  const completedProjects = projects.filter(p => p.status === '已完成').length;
  const totalTeamMembers = projects.reduce((sum, p) => sum + p.teamMembers, 0);
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.total, 0);
  const completedTasks = projects.reduce((sum, p) => sum + p.tasks.completed, 0);
  
  return {
    totalProjects,
    activeProjects,
    completedProjects,
    totalTeamMembers,
    totalTasks,
    completedTasks,
    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  };
};

// 代码质量统计
const getCodeQualityStats = () => {
  return {
    codeCoverage: 85,
    bugCount: 12,
    codeQualityScore: 'A+',
    totalReviews: codeReviews.length,
    pendingReviews: codeReviews.filter(r => r.status === '待审查').length,
    approvedReviews: codeReviews.filter(r => r.status === '已通过').length
  };
};

// 最近活动数据
const getRecentActivities = () => {
  return [
    {
      id: '1',
      title: '张三提交了用户管理模块的代码审查',
      time: '2小时前',
      type: 'code_review',
      author: '张三',
      projectId: '1',
      createdAt: moment().subtract(2, 'hours').toISOString()
    },
    {
      id: '2',
      title: '李四合并了feature/user-auth分支到develop',
      time: '4小时前',
      type: 'merge',
      author: '李四',
      projectId: '1',
      createdAt: moment().subtract(4, 'hours').toISOString()
    },
    {
      id: '3',
      title: '王五通过了API接口优化的代码审查',
      time: '6小时前',
      type: 'approval',
      author: '王五',
      projectId: '1',
      createdAt: moment().subtract(6, 'hours').toISOString()
    }
  ];
};

module.exports = {
  projects,
  milestones,
  codeReviews,
  branches,
  getProjectStats,
  getCodeQualityStats,
  getRecentActivities
};
