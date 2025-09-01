# 成员管理后端系统

## 概述

这是一个完整的成员管理后端系统，使用 Node.js + Express 构建，提供了用户管理、角色管理、部门管理、权限管理等完整的成员管理功能。

## 功能特性

### 🎯 核心功能

1. **用户权限管理**
   - 用户信息管理（增删改查）
   - 角色分配和权限控制
   - 用户状态管理（激活/禁用/待激活）
   - 用户搜索和筛选

2. **角色管理**
   - 角色创建、编辑、删除
   - 角色权限配置
   - 角色等级管理
   - 角色使用统计

3. **部门管理**
   - 部门层级管理
   - 部门信息维护
   - 部门成员统计
   - 部门关系管理

4. **权限管理**
   - 权限树形结构
   - 细粒度权限控制
   - 权限继承机制
   - 权限验证中间件

5. **组织架构**
   - 组织架构树形展示
   - 汇报关系管理
   - 部门层级关系
   - 组织架构可视化

### 🔧 技术特性

- **RESTful API 设计**
- **JWT 身份认证**
- **数据验证和错误处理**
- **分页和搜索功能**
- **权限控制中间件**
- **业务逻辑服务层**
- **完整的API文档**

## 项目结构

```
backend/
├── src/
│   ├── data/
│   │   └── memberData.js          # 数据模型和模拟数据
│   ├── middleware/
│   │   └── auth.js                # 认证和权限中间件
│   ├── routes/
│   │   └── members.js             # 成员管理API路由
│   ├── services/
│   │   └── memberService.js       # 业务逻辑服务层
│   └── app.js                     # 主应用文件
├── test-members-api.js            # API测试脚本
├── MEMBER_MANAGEMENT_API.md       # API文档
└── MEMBER_MANAGEMENT_README.md    # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 环境配置

创建 `.env` 文件：

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-jwt-secret-key
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 4. 测试API

```bash
# 运行测试脚本
node test-members-api.js
```

## API 接口

### 基础信息

- **基础URL**: `http://localhost:3001/api/members`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON

### 主要接口

#### 用户管理
- `GET /users` - 获取用户列表
- `GET /users/:id` - 获取用户详情
- `POST /users` - 创建用户
- `PUT /users/:id` - 更新用户
- `DELETE /users/:id` - 删除用户

#### 角色管理
- `GET /roles` - 获取角色列表
- `GET /roles/:id` - 获取角色详情
- `POST /roles` - 创建角色
- `PUT /roles/:id` - 更新角色
- `DELETE /roles/:id` - 删除角色

#### 部门管理
- `GET /departments` - 获取部门列表
- `GET /departments/:id` - 获取部门详情
- `POST /departments` - 创建部门
- `PUT /departments/:id` - 更新部门
- `DELETE /departments/:id` - 删除部门

#### 权限管理
- `GET /permissions` - 获取权限列表
- `GET /permissions/tree` - 获取权限树

#### 组织架构
- `GET /organization/tree` - 获取组织架构树
- `GET /organization/reports` - 获取汇报关系

#### 统计信息
- `GET /statistics` - 获取统计信息

## 数据模型

### 用户模型 (UserInfo)

```javascript
{
  id: string,              // 用户ID
  employeeId: string,      // 工号
  name: string,            // 姓名
  email: string,           // 邮箱
  phone: string,           // 手机号
  department: string,      // 部门名称
  position: string,        // 职位
  role: string,            // 角色名称
  permissions: string[],   // 权限列表
  status: string,          // 状态 (active/pending/disabled)
  lastLogin: string,       // 最后登录时间
  reportTo: string,        // 汇报对象
  joinDate: string         // 入职日期
}
```

### 角色模型 (RoleInfo)

```javascript
{
  id: string,              // 角色ID
  name: string,            // 角色名称
  code: string,            // 角色代码
  description: string,     // 角色描述
  permissions: string[],   // 权限列表
  level: number,           // 角色等级
  status: string,          // 状态 (active/disabled)
  userCount: number,       // 用户数量
  createDate: string       // 创建时间
}
```

### 部门模型 (DepartmentInfo)

```javascript
{
  id: string,              // 部门ID
  name: string,            // 部门名称
  code: string,            // 部门代码
  description: string,     // 部门描述
  parentId: string,        // 上级部门ID
  manager: string,         // 负责人
  memberCount: number,     // 成员数量
  level: number,           // 部门层级
  status: string,          // 状态 (active/disabled)
  createDate: string       // 创建时间
}
```

## 权限系统

### 权限类型

1. **菜单权限**: 控制页面访问
2. **按钮权限**: 控制功能操作
3. **接口权限**: 控制API访问

### 权限验证

系统使用中间件进行权限验证：

```javascript
// 检查特定权限
app.use('/api/members/users', checkPermission('user.read'));

// 检查管理员权限
app.use('/api/members/roles', requireAdmin);

// 检查部门权限
app.use('/api/members/departments', checkDepartmentAccess);
```

### 权限继承

- 超级管理员拥有所有权限 (`*`)
- 角色权限可以继承给用户
- 部门管理员可以管理本部门用户

## 中间件

### 认证中间件

- `authenticateToken`: JWT令牌验证
- `authorize`: 角色权限验证
- `checkPermission`: 具体权限验证
- `requireAdmin`: 管理员权限验证
- `checkDepartmentAccess`: 部门权限验证

### 其他中间件

- `validateRequest`: 请求参数验证
- `errorHandler`: 错误处理
- `requestLogger`: 请求日志

## 业务逻辑

### 服务层 (MemberService)

提供完整的业务逻辑处理：

- 数据验证和业务规则
- 关联数据更新
- 统计信息计算
- 权限继承处理

### 数据操作

- 支持分页查询
- 支持多条件筛选
- 支持搜索功能
- 数据关联更新

## 错误处理

### 统一错误格式

```json
{
  "success": false,
  "message": "错误描述",
  "code": 400,
  "errors": "详细错误信息"
}
```

### 常见错误码

- `400`: 请求参数错误
- `401`: 未认证
- `403`: 权限不足
- `404`: 资源不存在
- `409`: 资源冲突
- `500`: 服务器错误

## 测试

### 运行测试

```bash
# 基础API测试
node test-members-api.js

# 使用Jest进行单元测试
npm test
```

### 测试覆盖

- API接口测试
- 数据验证测试
- 权限验证测试
- 错误处理测试

## 部署

### 生产环境配置

```bash
# 设置环境变量
export NODE_ENV=production
export PORT=3001
export JWT_SECRET=your-production-secret

# 启动服务
npm start
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 扩展功能

### 可扩展的功能

1. **数据库集成**: 替换内存数据为真实数据库
2. **文件上传**: 支持用户头像上传
3. **邮件通知**: 用户创建和状态变更通知
4. **操作日志**: 记录所有操作历史
5. **数据导入导出**: 支持Excel导入导出
6. **单点登录**: 集成SSO系统

### 性能优化

1. **缓存机制**: Redis缓存热点数据
2. **数据库优化**: 索引优化和查询优化
3. **分页优化**: 游标分页和虚拟滚动
4. **CDN加速**: 静态资源CDN分发

## 安全考虑

1. **输入验证**: 所有输入都经过严格验证
2. **SQL注入防护**: 使用参数化查询
3. **XSS防护**: 输出转义和CSP策略
4. **CSRF防护**: CSRF令牌验证
5. **限流保护**: API请求频率限制
6. **日志审计**: 完整的操作日志记录

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请通过以下方式联系：

- 邮箱: support@company.com
- 项目地址: https://github.com/company/member-management
