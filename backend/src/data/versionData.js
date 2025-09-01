// 版本管理静态数据
const versionData = [
  {
    id: 1,
    version: "v2.1.0",
    name: "用户权限优化",
    description: "优化用户权限管理，增加角色分配功能，提升系统安全性",
    releaseDate: "2024-01-15",
    status: "已发布",
    priority: "高",
    developer: "张三",
    testStatus: "测试通过",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z"
  },
  {
    id: 2,
    version: "v2.0.8",
    name: "性能优化",
    description: "优化系统响应速度，减少页面加载时间",
    releaseDate: "2024-01-10",
    status: "已发布",
    priority: "中",
    developer: "李四",
    testStatus: "测试通过",
    createdAt: "2024-01-05T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z"
  },
  {
    id: 3,
    version: "v2.1.1",
    name: "Bug修复",
    description: "修复用户反馈的已知问题，提升系统稳定性",
    releaseDate: "2024-01-20",
    status: "测试中",
    priority: "高",
    developer: "王五",
    testStatus: "测试中",
    createdAt: "2024-01-15T00:00:00.000Z",
    updatedAt: "2024-01-20T00:00:00.000Z"
  },
  {
    id: 4,
    version: "v2.0.7",
    name: "界面优化",
    description: "优化用户界面，提升用户体验",
    releaseDate: "2024-01-05",
    status: "已回滚",
    priority: "低",
    developer: "赵六",
    testStatus: "测试通过",
    rollbackVersion: "v2.0.6",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-05T00:00:00.000Z"
  }
];

// 部署管理静态数据
const deploymentData = [
  {
    id: 1,
    environment: "生产环境",
    version: "v2.1.0",
    deployTime: "2024-01-15 14:30:00",
    status: "部署成功",
    progress: 100,
    operator: "张三",
    duration: "15分钟",
    logs: [
      "开始部署...",
      "代码同步完成",
      "数据库迁移完成",
      "服务重启完成",
      "部署成功"
    ],
    createdAt: "2024-01-15T14:30:00.000Z",
    updatedAt: "2024-01-15T14:45:00.000Z"
  },
  {
    id: 2,
    environment: "测试环境",
    version: "v2.1.1",
    deployTime: "2024-01-20 10:00:00",
    status: "部署中",
    progress: 65,
    operator: "李四",
    duration: "8分钟",
    logs: [
      "开始部署...",
      "代码同步完成",
      "数据库迁移中..."
    ],
    createdAt: "2024-01-20T10:00:00.000Z",
    updatedAt: "2024-01-20T10:08:00.000Z"
  },
  {
    id: 3,
    environment: "预发布环境",
    version: "v2.1.0",
    deployTime: "2024-01-14 16:00:00",
    status: "部署成功",
    progress: 100,
    operator: "王五",
    duration: "12分钟",
    logs: [
      "开始部署...",
      "代码同步完成",
      "服务重启完成",
      "部署成功"
    ],
    createdAt: "2024-01-14T16:00:00.000Z",
    updatedAt: "2024-01-14T16:12:00.000Z"
  }
];

module.exports = {
  versionData,
  deploymentData
};
