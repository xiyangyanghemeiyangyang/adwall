# 项目管理API文档

## 概述

项目管理API提供了完整的开发管理功能，包括项目管理、里程碑管理、代码审查管理和分支管理等功能。

## 基础信息

- **基础URL**: `http://localhost:3001/api/projects`
- **认证方式**: Bearer Token
- **数据格式**: JSON

## 认证

所有API请求都需要在请求头中包含有效的认证token：

```
Authorization: Bearer <your-token>
```

## API接口

### 项目管理

#### 1. 获取所有项目

```http
GET /api/projects/projects
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "CRM系统升级",
      "description": "升级现有CRM系统，增加新功能和优化用户体验",
      "progress": 75,
      "status": "进行中",
      "startDate": "2024-01-15",
      "endDate": "2024-03-15",
      "teamMembers": 8,
      "tasks": {
        "total": 24,
        "completed": 18,
        "pending": 6
      },
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-02-10T15:30:00Z",
      "createdBy": "admin",
      "tags": ["CRM", "升级", "前端", "后端"]
    }
  ],
  "total": 3
}
```

#### 2. 获取单个项目

```http
GET /api/projects/projects/:id
```

#### 3. 创建项目

```http
POST /api/projects/projects
```

**请求体**:
```json
{
  "name": "新项目",
  "description": "项目描述",
  "startDate": "2024-02-01",
  "endDate": "2024-05-01",
  "teamMembers": 5,
  "tags": ["标签1", "标签2"]
}
```

#### 4. 更新项目

```http
PUT /api/projects/projects/:id
```

#### 5. 删除项目

```http
DELETE /api/projects/projects/:id
```

### 里程碑管理

#### 1. 获取所有里程碑

```http
GET /api/projects/milestones
```

**查询参数**:
- `projectId` (可选): 按项目ID筛选里程碑

#### 2. 创建里程碑

```http
POST /api/projects/milestones
```

**请求体**:
```json
{
  "title": "里程碑标题",
  "description": "里程碑描述",
  "dueDate": "2024-03-01",
  "projectId": "1",
  "assignedTo": "user1"
}
```

#### 3. 更新里程碑

```http
PUT /api/projects/milestones/:id
```

#### 4. 删除里程碑

```http
DELETE /api/projects/milestones/:id
```

### 代码审查管理

#### 1. 获取所有代码审查

```http
GET /api/projects/code-reviews
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "用户管理模块重构",
      "author": "张三",
      "reviewer": "李四",
      "status": "待审查",
      "createTime": "2024-02-10T14:30:00Z",
      "linesChanged": 156,
      "comments": 0,
      "projectId": "1",
      "branchName": "feature/user-management",
      "commitHash": "abc123def456",
      "description": "重构用户管理模块，优化代码结构和性能",
      "filesChanged": ["src/components/UserManagement.tsx", "src/services/userService.ts"],
      "createdAt": "2024-02-10T14:30:00Z",
      "updatedAt": "2024-02-10T14:30:00Z"
    }
  ],
  "total": 3
}
```

#### 2. 获取单个代码审查

```http
GET /api/projects/code-reviews/:id
```

#### 3. 创建代码审查

```http
POST /api/projects/code-reviews
```

**请求体**:
```json
{
  "title": "代码审查标题",
  "author": "作者",
  "reviewer": "审查者",
  "projectId": "1",
  "branchName": "feature-branch",
  "commitHash": "abc123",
  "description": "代码审查描述",
  "linesChanged": 50,
  "filesChanged": ["file1.js", "file2.ts"]
}
```

#### 4. 更新代码审查

```http
PUT /api/projects/code-reviews/:id
```

#### 5. 删除代码审查

```http
DELETE /api/projects/code-reviews/:id
```

### 分支管理

#### 1. 获取所有分支

```http
GET /api/projects/branches
```

**查询参数**:
- `projectId` (可选): 按项目ID筛选分支

#### 2. 创建分支

```http
POST /api/projects/branches
```

**请求体**:
```json
{
  "name": "feature-branch",
  "type": "feature",
  "projectId": "1",
  "author": "开发者",
  "description": "功能分支描述",
  "isProtected": false
}
```

#### 3. 更新分支

```http
PUT /api/projects/branches/:id
```

#### 4. 删除分支

```http
DELETE /api/projects/branches/:id
```

### 统计信息

#### 1. 获取项目统计信息

```http
GET /api/projects/statistics
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "projects": {
      "totalProjects": 3,
      "activeProjects": 2,
      "completedProjects": 1,
      "totalTeamMembers": 19,
      "totalTasks": 74,
      "completedTasks": 50,
      "completionRate": 68
    },
    "codeQuality": {
      "codeCoverage": 85,
      "bugCount": 12,
      "codeQualityScore": "A+",
      "totalReviews": 3,
      "pendingReviews": 1,
      "approvedReviews": 1
    },
    "recentActivities": [
      {
        "id": "1",
        "title": "张三提交了用户管理模块的代码审查",
        "time": "2小时前",
        "type": "code_review",
        "author": "张三",
        "projectId": "1",
        "createdAt": "2024-02-10T13:30:00Z"
      }
    ]
  }
}
```

#### 2. 获取仪表板数据

```http
GET /api/projects/dashboard
```

## 数据模型

### 项目 (Project)

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: '进行中' | '已完成' | '暂停' | '计划中';
  startDate: string;
  endDate: string;
  teamMembers: number;
  tasks: {
    total: number;
    completed: number;
    pending: number;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags: string[];
}
```

### 里程碑 (Milestone)

```typescript
interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: '未开始' | '进行中' | '已完成' | '延期';
  progress: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  assignedTo: string | null;
}
```

### 代码审查 (CodeReview)

```typescript
interface CodeReview {
  id: string;
  title: string;
  author: string;
  reviewer: string;
  status: '待审查' | '审查中' | '已通过' | '需修改';
  createTime: string;
  linesChanged: number;
  comments: number;
  projectId: string;
  branchName: string;
  commitHash: string;
  description: string;
  filesChanged: string[];
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
}
```

### 分支 (Branch)

```typescript
interface Branch {
  id: string;
  name: string;
  type: 'main' | 'develop' | 'feature' | 'hotfix';
  lastCommit: string;
  author: string;
  status: '活跃' | '合并' | '删除';
  commits: number;
  projectId: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lastCommitHash: string;
  isProtected: boolean;
}
```

## 错误处理

所有API都遵循统一的错误响应格式：

```json
{
  "success": false,
  "message": "错误描述",
  "code": 400,
  "errors": ["具体错误信息1", "具体错误信息2"]
}
```

### 常见HTTP状态码

- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `404` - 资源不存在
- `500` - 服务器内部错误

## 数据验证

### 项目验证规则

- `name`: 必填，1-100个字符
- `description`: 可选，最多500个字符
- `startDate`: 可选，ISO日期格式
- `endDate`: 可选，ISO日期格式
- `teamMembers`: 可选，1-50之间的整数
- `tags`: 可选，字符串数组

### 里程碑验证规则

- `title`: 必填，1-100个字符
- `description`: 可选，最多500个字符
- `dueDate`: 必填，ISO日期格式
- `projectId`: 必填
- `assignedTo`: 可选

### 代码审查验证规则

- `title`: 必填，1-100个字符
- `author`: 必填，1-50个字符
- `reviewer`: 必填，1-50个字符
- `projectId`: 必填
- `linesChanged`: 可选，非负整数
- `filesChanged`: 可选，字符串数组

### 分支验证规则

- `name`: 必填，1-100个字符
- `type`: 可选，必须是 'main'、'develop'、'feature' 或 'hotfix' 之一
- `projectId`: 必填
- `author`: 必填，1-50个字符
- `isProtected`: 可选，布尔值

## 使用示例

### JavaScript/TypeScript

```javascript
// 获取所有项目
const response = await fetch('/api/projects/projects', {
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// 创建新项目
const newProject = await fetch('/api/projects/projects', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '新项目',
    description: '项目描述',
    teamMembers: 5
  })
});
```

### cURL

```bash
# 获取所有项目
curl -X GET "http://localhost:3001/api/projects/projects" \
  -H "Authorization: Bearer your-token"

# 创建新项目
curl -X POST "http://localhost:3001/api/projects/projects" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "新项目",
    "description": "项目描述",
    "teamMembers": 5
  }'
```

## 测试

运行测试文件来验证API功能：

```bash
# 确保后端服务正在运行
npm start

# 在另一个终端运行测试
node test-projects-api.js
```

测试将验证所有API端点的功能，包括创建、读取、更新和删除操作。
