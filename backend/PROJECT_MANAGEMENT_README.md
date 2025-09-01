# 开发管理模块后端API

## 概述

本模块为CrmPlus系统提供了完整的开发管理功能，包括项目管理、里程碑管理、代码审查管理和分支管理等功能。该模块完全基于Node.js和Express框架构建，提供了RESTful API接口。

## 功能特性

### 🎯 项目管理
- 创建、读取、更新、删除项目
- 项目进度跟踪
- 团队规模管理
- 任务统计
- 项目标签分类

### 🏁 里程碑管理
- 项目里程碑创建和管理
- 进度跟踪
- 截止日期管理
- 负责人分配

### 🔍 代码审查管理
- 代码审查流程管理
- 审查状态跟踪
- 代码变更统计
- 文件变更记录

### 🌿 分支管理
- Git分支管理
- 分支类型分类（main、develop、feature、hotfix）
- 提交统计
- 分支保护设置

### 📊 统计信息
- 项目统计概览
- 代码质量指标
- 最近活动记录
- 仪表板数据

## 技术栈

- **Node.js** - 运行时环境
- **Express.js** - Web框架
- **Joi** - 数据验证
- **UUID** - 唯一标识符生成
- **Moment.js** - 日期时间处理

## 项目结构

```
backend/src/
├── data/
│   └── projectData.js          # 项目数据模型和模拟数据
├── services/
│   └── projectService.js       # 业务逻辑服务层
├── routes/
│   └── projects.js             # API路由定义
└── app.js                      # 主应用文件（已更新）
```

## API端点

### 项目管理
- `GET /api/projects/projects` - 获取所有项目
- `GET /api/projects/projects/:id` - 获取单个项目
- `POST /api/projects/projects` - 创建项目
- `PUT /api/projects/projects/:id` - 更新项目
- `DELETE /api/projects/projects/:id` - 删除项目

### 里程碑管理
- `GET /api/projects/milestones` - 获取所有里程碑
- `POST /api/projects/milestones` - 创建里程碑
- `PUT /api/projects/milestones/:id` - 更新里程碑
- `DELETE /api/projects/milestones/:id` - 删除里程碑

### 代码审查管理
- `GET /api/projects/code-reviews` - 获取所有代码审查
- `GET /api/projects/code-reviews/:id` - 获取单个代码审查
- `POST /api/projects/code-reviews` - 创建代码审查
- `PUT /api/projects/code-reviews/:id` - 更新代码审查
- `DELETE /api/projects/code-reviews/:id` - 删除代码审查

### 分支管理
- `GET /api/projects/branches` - 获取所有分支
- `POST /api/projects/branches` - 创建分支
- `PUT /api/projects/branches/:id` - 更新分支
- `DELETE /api/projects/branches/:id` - 删除分支

### 统计信息
- `GET /api/projects/statistics` - 获取项目统计信息
- `GET /api/projects/dashboard` - 获取仪表板数据

## 数据模型

### 项目 (Project)
```javascript
{
  id: string,
  name: string,
  description: string,
  progress: number,
  status: '进行中' | '已完成' | '暂停' | '计划中',
  startDate: string,
  endDate: string,
  teamMembers: number,
  tasks: {
    total: number,
    completed: number,
    pending: number
  },
  createdAt: string,
  updatedAt: string,
  createdBy: string,
  tags: string[]
}
```

### 里程碑 (Milestone)
```javascript
{
  id: string,
  title: string,
  description: string,
  dueDate: string,
  status: '未开始' | '进行中' | '已完成' | '延期',
  progress: number,
  projectId: string,
  createdAt: string,
  updatedAt: string,
  completedAt: string | null,
  assignedTo: string | null
}
```

### 代码审查 (CodeReview)
```javascript
{
  id: string,
  title: string,
  author: string,
  reviewer: string,
  status: '待审查' | '审查中' | '已通过' | '需修改',
  createTime: string,
  linesChanged: number,
  comments: number,
  projectId: string,
  branchName: string,
  commitHash: string,
  description: string,
  filesChanged: string[],
  createdAt: string,
  updatedAt: string,
  approvedAt: string | null
}
```

### 分支 (Branch)
```javascript
{
  id: string,
  name: string,
  type: 'main' | 'develop' | 'feature' | 'hotfix',
  lastCommit: string,
  author: string,
  status: '活跃' | '合并' | '删除',
  commits: number,
  projectId: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  lastCommitHash: string,
  isProtected: boolean
}
```

## 安装和运行

### 1. 安装依赖
```bash
cd backend
npm install
```

### 2. 启动服务
```bash
npm start
```

服务将在 `http://localhost:3001` 启动

### 3. 验证服务
```bash
# 健康检查
curl http://localhost:3001/health

# 查看可用端点
curl http://localhost:3001/
```

## 测试

### 简单测试
```bash
node test-api-simple.js
```

### 完整功能测试
```bash
node test-projects-api.js
```

## 认证

所有API端点都需要Bearer Token认证：

```javascript
headers: {
  'Authorization': 'Bearer <your-token>',
  'Content-Type': 'application/json'
}
```

## 数据验证

所有输入数据都经过严格的验证：

- **项目名称**: 1-100个字符，必填
- **描述**: 最多500个字符，可选
- **日期**: ISO格式，必填
- **团队成员**: 1-50之间的整数
- **分支类型**: 必须是预定义的类型之一

## 错误处理

统一的错误响应格式：

```json
{
  "success": false,
  "message": "错误描述",
  "code": 400,
  "errors": ["具体错误信息"]
}
```

## 安全特性

- JWT Token认证
- 请求频率限制
- 输入数据验证
- SQL注入防护
- XSS攻击防护

## 性能优化

- 数据压缩
- 请求缓存
- 分页查询
- 索引优化

## 扩展性

- 模块化设计
- 服务层抽象
- 数据层分离
- 配置外部化

## 监控和日志

- 请求日志记录
- 错误日志追踪
- 性能监控
- 健康检查端点

## 部署

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
npm start
```

### Docker部署
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。

---

**注意**: 这是一个开发管理模块的后端API实现，与前端DevManagement.tsx组件完全对应，提供了完整的CRUD操作和业务逻辑处理。
