/**
 * 项目管理API测试文件
 * 测试项目、里程碑、代码审查、分支等API接口
 */

const axios = require('axios');

// 配置
const BASE_URL = 'http://localhost:3001';
const API_BASE = `${BASE_URL}/api`;

// 测试用的认证token（需要先登录获取）
let authToken = '';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器，自动添加认证token
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// 测试数据
const testData = {
  project: {
    name: '测试项目',
    description: '这是一个测试项目',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    teamMembers: 5,
    tags: ['测试', '开发']
  },
  milestone: {
    title: '测试里程碑',
    description: '这是一个测试里程碑',
    dueDate: '2024-03-01',
    projectId: '', // 将在创建项目后设置
    assignedTo: 'tester'
  },
  codeReview: {
    title: '测试代码审查',
    author: '测试作者',
    reviewer: '测试审查者',
    projectId: '', // 将在创建项目后设置
    branchName: 'test-branch',
    commitHash: 'test123',
    description: '这是一个测试代码审查',
    linesChanged: 50,
    filesChanged: ['test.js', 'test.ts']
  },
  branch: {
    name: 'test-feature',
    type: 'feature',
    projectId: '', // 将在创建项目后设置
    author: '测试作者',
    description: '这是一个测试分支',
    isProtected: false
  }
};

// 测试函数
class ProjectAPITester {
  constructor() {
    this.testResults = [];
    this.createdIds = {
      project: null,
      milestone: null,
      codeReview: null,
      branch: null
    };
  }

  // 记录测试结果
  logTest(testName, success, message = '') {
    const result = {
      test: testName,
      success,
      message,
      timestamp: new Date().toISOString()
    };
    this.testResults.push(result);
    console.log(`${success ? '✅' : '❌'} ${testName}: ${message}`);
  }

  // 等待函数
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 测试认证
  async testAuth() {
    try {
      console.log('\n🔐 测试认证...');
      
      // 尝试登录
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        username: 'admin',
        password: 'admin123'
      });

      if (loginResponse.data.success) {
        authToken = loginResponse.data.data.token;
        this.logTest('用户登录', true, '登录成功');
        return true;
      } else {
        this.logTest('用户登录', false, loginResponse.data.message);
        return false;
      }
    } catch (error) {
      this.logTest('用户登录', false, `登录失败: ${error.message}`);
      return false;
    }
  }

  // 测试项目管理
  async testProjects() {
    try {
      console.log('\n📁 测试项目管理...');

      // 1. 获取所有项目
      const getProjectsResponse = await api.get('/projects/projects');
      this.logTest('获取项目列表', getProjectsResponse.data.success, 
        `获取到 ${getProjectsResponse.data.total} 个项目`);

      // 2. 创建新项目
      const createProjectResponse = await api.post('/projects/projects', testData.project);
      if (createProjectResponse.data.success) {
        this.createdIds.project = createProjectResponse.data.data.id;
        testData.milestone.projectId = this.createdIds.project;
        testData.codeReview.projectId = this.createdIds.project;
        testData.branch.projectId = this.createdIds.project;
        this.logTest('创建项目', true, `项目ID: ${this.createdIds.project}`);
      } else {
        this.logTest('创建项目', false, createProjectResponse.data.message);
      }

      // 3. 获取单个项目
      if (this.createdIds.project) {
        const getProjectResponse = await api.get(`/projects/projects/${this.createdIds.project}`);
        this.logTest('获取项目详情', getProjectResponse.data.success, 
          getProjectResponse.data.success ? '获取成功' : getProjectResponse.data.message);
      }

      // 4. 更新项目
      if (this.createdIds.project) {
        const updateData = { name: '更新后的测试项目', progress: 50 };
        const updateProjectResponse = await api.put(`/projects/projects/${this.createdIds.project}`, updateData);
        this.logTest('更新项目', updateProjectResponse.data.success, 
          updateProjectResponse.data.success ? '更新成功' : updateProjectResponse.data.message);
      }

    } catch (error) {
      this.logTest('项目管理测试', false, `测试失败: ${error.message}`);
    }
  }

  // 测试里程碑管理
  async testMilestones() {
    try {
      console.log('\n🎯 测试里程碑管理...');

      // 1. 获取所有里程碑
      const getMilestonesResponse = await api.get('/projects/milestones');
      this.logTest('获取里程碑列表', getMilestonesResponse.data.success, 
        `获取到 ${getMilestonesResponse.data.total} 个里程碑`);

      // 2. 创建新里程碑
      if (testData.milestone.projectId) {
        const createMilestoneResponse = await api.post('/projects/milestones', testData.milestone);
        if (createMilestoneResponse.data.success) {
          this.createdIds.milestone = createMilestoneResponse.data.data.id;
          this.logTest('创建里程碑', true, `里程碑ID: ${this.createdIds.milestone}`);
        } else {
          this.logTest('创建里程碑', false, createMilestoneResponse.data.message);
        }
      }

      // 3. 更新里程碑
      if (this.createdIds.milestone) {
        const updateData = { progress: 75, status: '进行中' };
        const updateMilestoneResponse = await api.put(`/projects/milestones/${this.createdIds.milestone}`, updateData);
        this.logTest('更新里程碑', updateMilestoneResponse.data.success, 
          updateMilestoneResponse.data.success ? '更新成功' : updateMilestoneResponse.data.message);
      }

    } catch (error) {
      this.logTest('里程碑管理测试', false, `测试失败: ${error.message}`);
    }
  }

  // 测试代码审查管理
  async testCodeReviews() {
    try {
      console.log('\n🔍 测试代码审查管理...');

      // 1. 获取所有代码审查
      const getReviewsResponse = await api.get('/projects/code-reviews');
      this.logTest('获取代码审查列表', getReviewsResponse.data.success, 
        `获取到 ${getReviewsResponse.data.total} 个代码审查`);

      // 2. 创建新代码审查
      if (testData.codeReview.projectId) {
        const createReviewResponse = await api.post('/projects/code-reviews', testData.codeReview);
        if (createReviewResponse.data.success) {
          this.createdIds.codeReview = createReviewResponse.data.data.id;
          this.logTest('创建代码审查', true, `代码审查ID: ${this.createdIds.codeReview}`);
        } else {
          this.logTest('创建代码审查', false, createReviewResponse.data.message);
        }
      }

      // 3. 更新代码审查
      if (this.createdIds.codeReview) {
        const updateData = { status: '审查中', comments: 2 };
        const updateReviewResponse = await api.put(`/projects/code-reviews/${this.createdIds.codeReview}`, updateData);
        this.logTest('更新代码审查', updateReviewResponse.data.success, 
          updateReviewResponse.data.success ? '更新成功' : updateReviewResponse.data.message);
      }

    } catch (error) {
      this.logTest('代码审查管理测试', false, `测试失败: ${error.message}`);
    }
  }

  // 测试分支管理
  async testBranches() {
    try {
      console.log('\n🌿 测试分支管理...');

      // 1. 获取所有分支
      const getBranchesResponse = await api.get('/projects/branches');
      this.logTest('获取分支列表', getBranchesResponse.data.success, 
        `获取到 ${getBranchesResponse.data.total} 个分支`);

      // 2. 创建新分支
      if (testData.branch.projectId) {
        const createBranchResponse = await api.post('/projects/branches', testData.branch);
        if (createBranchResponse.data.success) {
          this.createdIds.branch = createBranchResponse.data.data.id;
          this.logTest('创建分支', true, `分支ID: ${this.createdIds.branch}`);
        } else {
          this.logTest('创建分支', false, createBranchResponse.data.message);
        }
      }

      // 3. 更新分支
      if (this.createdIds.branch) {
        const updateData = { commits: 5, lastCommitHash: 'abc123' };
        const updateBranchResponse = await api.put(`/projects/branches/${this.createdIds.branch}`, updateData);
        this.logTest('更新分支', updateBranchResponse.data.success, 
          updateBranchResponse.data.success ? '更新成功' : updateBranchResponse.data.message);
      }

    } catch (error) {
      this.logTest('分支管理测试', false, `测试失败: ${error.message}`);
    }
  }

  // 测试统计信息
  async testStatistics() {
    try {
      console.log('\n📊 测试统计信息...');

      // 1. 获取项目统计信息
      const getStatsResponse = await api.get('/projects/statistics');
      this.logTest('获取统计信息', getStatsResponse.data.success, 
        getStatsResponse.data.success ? '获取成功' : getStatsResponse.data.message);

      // 2. 获取仪表板数据
      const getDashboardResponse = await api.get('/projects/dashboard');
      this.logTest('获取仪表板数据', getDashboardResponse.data.success, 
        getDashboardResponse.data.success ? '获取成功' : getDashboardResponse.data.message);

    } catch (error) {
      this.logTest('统计信息测试', false, `测试失败: ${error.message}`);
    }
  }

  // 清理测试数据
  async cleanup() {
    try {
      console.log('\n🧹 清理测试数据...');

      // 删除创建的分支
      if (this.createdIds.branch) {
        await api.delete(`/projects/branches/${this.createdIds.branch}`);
        this.logTest('删除测试分支', true, '删除成功');
      }

      // 删除创建的代码审查
      if (this.createdIds.codeReview) {
        await api.delete(`/projects/code-reviews/${this.createdIds.codeReview}`);
        this.logTest('删除测试代码审查', true, '删除成功');
      }

      // 删除创建的里程碑
      if (this.createdIds.milestone) {
        await api.delete(`/projects/milestones/${this.createdIds.milestone}`);
        this.logTest('删除测试里程碑', true, '删除成功');
      }

      // 删除创建的项目
      if (this.createdIds.project) {
        await api.delete(`/projects/projects/${this.createdIds.project}`);
        this.logTest('删除测试项目', true, '删除成功');
      }

    } catch (error) {
      this.logTest('清理测试数据', false, `清理失败: ${error.message}`);
    }
  }

  // 生成测试报告
  generateReport() {
    console.log('\n📋 测试报告');
    console.log('='.repeat(50));
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`总测试数: ${totalTests}`);
    console.log(`通过: ${passedTests}`);
    console.log(`失败: ${failedTests}`);
    console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ 失败的测试:');
      this.testResults.filter(r => !r.success).forEach(result => {
        console.log(`  - ${result.test}: ${result.message}`);
      });
    }
    
    console.log('\n✅ 成功的测试:');
    this.testResults.filter(r => r.success).forEach(result => {
      console.log(`  - ${result.test}: ${result.message}`);
    });
  }

  // 运行所有测试
  async runAllTests() {
    console.log('🚀 开始项目管理API测试...');
    console.log('='.repeat(50));

    // 测试认证
    const authSuccess = await this.testAuth();
    if (!authSuccess) {
      console.log('❌ 认证失败，无法继续测试');
      return;
    }

    // 等待一下确保认证生效
    await this.sleep(1000);

    // 运行各项测试
    await this.testProjects();
    await this.sleep(500);
    
    await this.testMilestones();
    await this.sleep(500);
    
    await this.testCodeReviews();
    await this.sleep(500);
    
    await this.testBranches();
    await this.sleep(500);
    
    await this.testStatistics();
    await this.sleep(500);

    // 清理测试数据
    await this.cleanup();

    // 生成测试报告
    this.generateReport();
  }
}

// 主函数
async function main() {
  const tester = new ProjectAPITester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
  main();
}

module.exports = ProjectAPITester;
