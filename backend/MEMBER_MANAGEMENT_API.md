# 成员管理 API 文档

## 概述

成员管理模块提供了完整的用户、角色、部门、权限管理功能，包括用户管理、角色分配、权限级别设置、访问控制列表、团队组织架构、部门管理、职位管理、汇报关系设置等功能。

## 基础信息

- **基础URL**: `http://localhost:3001/api/members`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

## 认证

所有API请求都需要在请求头中包含有效的JWT令牌：

```
Authorization: Bearer <your-jwt-token>
```

## 用户管理 API

### 1. 获取用户列表

**请求**
```http
GET /api/members/users?page=1&limit=10&department=技术部&role=开发者&status=active&search=张三
```

**查询参数**
- `page` (可选): 页码，默认1
- `limit` (可选): 每页数量，默认10
- `department` (可选): 部门筛选
- `role` (可选): 角色筛选
- `status` (可选): 状态筛选 (active/pending/disabled)
- `search` (可选): 搜索关键词（姓名、邮箱、工号）

**响应**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_1",
        "employeeId": "U001",
        "name": "张三",
        "email": "zhangsan@company.com",
        "phone": "13812345678",
        "department": "技术部",
        "position": "高级前端工程师",
        "role": "开发者",
        "status": "active",
        "lastLogin": "2024-01-20T10:30:00.000Z",
        "reportTo": "李经理",
        "joinDate": "2023-03-15T00:00:00.000Z"
      }
    ],
    "pagination": {
      "current": 1,
      "pageSize": 10,
      "total": 156,
      "pages": 16
    }
  },
  "message": "获取用户列表成功"
}
```

### 2. 获取单个用户信息

**请求**
```http
GET /api/members/users/{userId}
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": "user_1",
    "employeeId": "U001",
    "name": "张三",
    "email": "zhangsan@company.com",
    "phone": "13812345678",
    "department": "技术部",
    "position": "高级前端工程师",
    "role": "开发者",
    "permissions": ["user.read", "user.write", "project.read"],
    "status": "active",
    "lastLogin": "2024-01-20T10:30:00.000Z",
    "reportTo": "李经理",
    "joinDate": "2023-03-15T00:00:00.000Z"
  },
  "message": "获取用户信息成功"
}
```

### 3. 创建用户

**请求**
```http
POST /api/members/users
Content-Type: application/json

{
  "employeeId": "U006",
  "name": "新用户",
  "email": "newuser@company.com",
  "phone": "13888888888",
  "departmentId": "dept_1",
  "position": "前端工程师",
  "roleId": "role_4",
  "reportToId": "user_2",
  "status": "pending"
}
```

**响应**
```json
{
  "success": true,
  "data": {
    "id": "user_6",
    "employeeId": "U006",
    "name": "新用户",
    "email": "newuser@company.com",
    "phone": "13888888888",
    "department": "技术部",
    "position": "前端工程师",
    "role": "开发者",
    "status": "pending",
    "joinDate": "2024-01-20T00:00:00.000Z"
  },
  "message": "创建用户成功"
}
```

### 4. 更新用户信息

**请求**
```http
PUT /api/members/users/{userId}
Content-Type: application/json

{
  "name": "更新后的姓名",
  "position": "高级前端工程师",
  "status": "active"
}
```

### 5. 删除用户

**请求**
```http
DELETE /api/members/users/{userId}
```

## 角色管理 API

### 1. 获取角色列表

**请求**
```http
GET /api/members/roles
```

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": "role_1",
      "name": "超级管理员",
      "code": "SUPER_ADMIN",
      "description": "拥有系统所有权限，可以管理系统设置",
      "permissions": ["*"],
      "level": 1,
      "status": "active",
      "userCount": 2,
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "message": "获取角色列表成功"
}
```

### 2. 创建角色

**请求**
```http
POST /api/members/roles
Content-Type: application/json

{
  "name": "测试角色",
  "code": "TEST_ROLE",
  "description": "测试用途的角色",
  "permissions": ["user.read", "project.read"],
  "level": 3,
  "status": "active"
}
```

### 3. 更新角色

**请求**
```http
PUT /api/members/roles/{roleId}
Content-Type: application/json

{
  "description": "更新后的角色描述",
  "permissions": ["user.read", "user.write", "project.read"]
}
```

### 4. 删除角色

**请求**
```http
DELETE /api/members/roles/{roleId}
```

## 部门管理 API

### 1. 获取部门列表

**请求**
```http
GET /api/members/departments
```

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": "dept_1",
      "name": "技术部",
      "code": "TECH",
      "description": "负责产品开发和系统维护",
      "parentId": null,
      "manager": "李技术总监",
      "memberCount": 15,
      "level": 1,
      "status": "active",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "message": "获取部门列表成功"
}
```

### 2. 创建部门

**请求**
```http
POST /api/members/departments
Content-Type: application/json

{
  "name": "新部门",
  "code": "NEW_DEPT",
  "description": "新成立的部门",
  "parentId": "dept_1",
  "manager": "部门经理",
  "level": 2,
  "status": "active"
}
```

### 3. 更新部门

**请求**
```http
PUT /api/members/departments/{deptId}
Content-Type: application/json

{
  "description": "更新后的部门描述",
  "manager": "新的部门经理"
}
```

### 4. 删除部门

**请求**
```http
DELETE /api/members/departments/{deptId}
```

## 权限管理 API

### 1. 获取权限列表

**请求**
```http
GET /api/members/permissions
```

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": "user.read",
      "name": "查看用户",
      "type": "button",
      "parentId": "user",
      "level": 3
    }
  ],
  "message": "获取权限列表成功"
}
```

### 2. 获取权限树

**请求**
```http
GET /api/members/permissions/tree
```

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": "system",
      "name": "系统管理",
      "type": "menu",
      "parentId": null,
      "level": 1,
      "children": [
        {
          "id": "user",
          "name": "用户管理",
          "type": "menu",
          "parentId": "system",
          "level": 2,
          "children": [
            {
              "id": "user.read",
              "name": "查看用户",
              "type": "button",
              "parentId": "user",
              "level": 3,
              "children": []
            }
          ]
        }
      ]
    }
  ],
  "message": "获取权限树成功"
}
```

## 组织架构 API

### 1. 获取组织架构树

**请求**
```http
GET /api/members/organization/tree
```

**响应**
```json
{
  "success": true,
  "data": [
    {
      "id": "company",
      "name": "公司总部",
      "type": "company",
      "children": [
        {
          "id": "dept_1",
          "name": "技术部",
          "type": "department",
          "children": [
            {
              "id": "frontend",
              "name": "前端组",
              "type": "team"
            }
          ]
        }
      ]
    }
  ],
  "message": "获取组织架构树成功"
}
```

### 2. 获取汇报关系

**请求**
```http
GET /api/members/organization/reports
```

**响应**
```json
{
  "success": true,
  "data": [
    {
      "from": "user_1",
      "to": "user_2",
      "fromName": "张三",
      "toName": "李经理"
    }
  ],
  "message": "获取汇报关系成功"
}
```

## 统计信息 API

### 获取统计信息

**请求**
```http
GET /api/members/statistics
```

**响应**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 156,
      "active": 142,
      "pending": 8,
      "disabled": 6
    },
    "roles": {
      "total": 4
    },
    "departments": {
      "total": 4
    },
    "departmentStats": [
      {
        "departmentId": "dept_1",
        "departmentName": "技术部",
        "userCount": 15
      }
    ],
    "roleStats": [
      {
        "roleId": "role_3",
        "roleName": "普通用户",
        "userCount": 28
      }
    ],
    "recentUsers": [
      {
        "id": "user_4",
        "name": "赵六",
        "department": "设计部",
        "joinDate": "2024-01-10"
      }
    ]
  },
  "message": "获取统计信息成功"
}
```

## 错误响应

所有API在发生错误时都会返回统一的错误格式：

```json
{
  "success": false,
  "message": "错误描述",
  "code": 400,
  "errors": "详细错误信息（可选）"
}
```

### 常见错误码

- `400`: 请求参数错误
- `401`: 未认证或令牌无效
- `403`: 权限不足
- `404`: 资源不存在
- `409`: 资源冲突（如邮箱已存在）
- `500`: 服务器内部错误

## 权限说明

### 用户权限

- `user.read`: 查看用户信息
- `user.create`: 创建用户
- `user.update`: 更新用户信息
- `user.delete`: 删除用户

### 角色权限

- `role.read`: 查看角色信息
- `role.create`: 创建角色
- `role.update`: 更新角色信息
- `role.delete`: 删除角色

### 部门权限

- `dept.read`: 查看部门信息
- `dept.create`: 创建部门
- `dept.update`: 更新部门信息
- `dept.delete`: 删除部门

### 特殊权限

- `*`: 所有权限（超级管理员）

## 使用示例

### JavaScript (Fetch API)

```javascript
// 获取用户列表
const response = await fetch('/api/members/users?page=1&limit=10', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// 创建用户
const newUser = await fetch('/api/members/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    employeeId: 'U007',
    name: '新用户',
    email: 'new@company.com',
    phone: '13999999999',
    departmentId: 'dept_1',
    position: '工程师',
    roleId: 'role_3'
  })
});
```

### cURL

```bash
# 获取用户列表
curl -X GET "http://localhost:3001/api/members/users" \
  -H "Authorization: Bearer your-jwt-token"

# 创建用户
curl -X POST "http://localhost:3001/api/members/users" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "U007",
    "name": "新用户",
    "email": "new@company.com",
    "phone": "13999999999",
    "departmentId": "dept_1",
    "position": "工程师",
    "roleId": "role_3"
  }'
```

## 注意事项

1. 所有API都需要有效的JWT令牌进行认证
2. 创建和更新操作会进行数据验证
3. 删除操作会检查关联数据，防止误删
4. 分页查询支持多种筛选条件
5. 权限验证基于用户角色和具体权限
6. 所有时间字段使用ISO 8601格式
7. 错误响应包含详细的错误信息
