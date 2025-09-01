/**
 * 成员管理API测试脚本
 * 用于测试成员管理相关的API接口
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';
const TEST_TOKEN = 'test-token'; // 在实际使用中需要获取真实的JWT令牌

// 创建axios实例
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TEST_TOKEN}`
  }
});

// 测试函数
async function testMembersAPI() {
  console.log('🚀 开始测试成员管理API...\n');

  try {
    // 1. 测试获取统计信息
    console.log('1. 测试获取统计信息...');
    const statsResponse = await api.get('/members/statistics');
    console.log('✅ 统计信息:', statsResponse.data);
    console.log('');

    // 2. 测试获取用户列表
    console.log('2. 测试获取用户列表...');
    const usersResponse = await api.get('/members/users?page=1&limit=5');
    console.log('✅ 用户列表:', usersResponse.data);
    console.log('');

    // 3. 测试获取角色列表
    console.log('3. 测试获取角色列表...');
    const rolesResponse = await api.get('/members/roles');
    console.log('✅ 角色列表:', rolesResponse.data);
    console.log('');

    // 4. 测试获取部门列表
    console.log('4. 测试获取部门列表...');
    const deptsResponse = await api.get('/members/departments');
    console.log('✅ 部门列表:', deptsResponse.data);
    console.log('');

    // 5. 测试获取权限树
    console.log('5. 测试获取权限树...');
    const permissionsResponse = await api.get('/members/permissions/tree');
    console.log('✅ 权限树:', permissionsResponse.data);
    console.log('');

    // 6. 测试获取组织架构树
    console.log('6. 测试获取组织架构树...');
    const orgResponse = await api.get('/members/organization/tree');
    console.log('✅ 组织架构树:', orgResponse.data);
    console.log('');

    // 7. 测试获取汇报关系
    console.log('7. 测试获取汇报关系...');
    const reportsResponse = await api.get('/members/organization/reports');
    console.log('✅ 汇报关系:', reportsResponse.data);
    console.log('');

    console.log('🎉 所有API测试完成！');

  } catch (error) {
    console.error('❌ API测试失败:', error.response?.data || error.message);
  }
}

// 测试创建操作（需要有效的认证令牌）
async function testCreateOperations() {
  console.log('\n🔧 测试创建操作...\n');

  try {
    // 测试创建用户
    console.log('1. 测试创建用户...');
    const newUser = {
      employeeId: 'U999',
      name: '测试用户',
      email: 'test@company.com',
      phone: '13999999999',
      departmentId: 'dept_1',
      position: '测试工程师',
      roleId: 'role_3',
      status: 'pending'
    };

    const createUserResponse = await api.post('/members/users', newUser);
    console.log('✅ 创建用户成功:', createUserResponse.data);
    console.log('');

    // 测试创建角色
    console.log('2. 测试创建角色...');
    const newRole = {
      name: '测试角色',
      code: 'TEST_ROLE',
      description: '用于测试的角色',
      permissions: ['user.read', 'project.read'],
      level: 3,
      status: 'active'
    };

    const createRoleResponse = await api.post('/members/roles', newRole);
    console.log('✅ 创建角色成功:', createRoleResponse.data);
    console.log('');

    // 测试创建部门
    console.log('3. 测试创建部门...');
    const newDept = {
      name: '测试部门',
      code: 'TEST_DEPT',
      description: '用于测试的部门',
      manager: '测试经理',
      level: 2,
      status: 'active'
    };

    const createDeptResponse = await api.post('/members/departments', newDept);
    console.log('✅ 创建部门成功:', createDeptResponse.data);
    console.log('');

    console.log('🎉 所有创建操作测试完成！');

  } catch (error) {
    console.error('❌ 创建操作测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
async function runTests() {
  console.log('='.repeat(50));
  console.log('成员管理API测试脚本');
  console.log('='.repeat(50));
  
  // 基础API测试
  await testMembersAPI();
  
  // 创建操作测试（需要认证）
  // await testCreateOperations();
  
  console.log('\n' + '='.repeat(50));
  console.log('测试完成');
  console.log('='.repeat(50));
}

// 如果直接运行此脚本
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testMembersAPI,
  testCreateOperations,
  runTests
};
