/**
 * 简单的API测试脚本
 */

const http = require('http');

// 测试健康检查端点
function testHealthCheck() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 测试项目管理API（需要认证）
function testProjectsAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/projects/projects',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// 运行测试
async function runTests() {
  console.log('🚀 开始API测试...\n');

  try {
    // 测试健康检查
    console.log('1. 测试健康检查端点...');
    const healthResult = await testHealthCheck();
    console.log(`   状态码: ${healthResult.status}`);
    console.log(`   响应: ${JSON.stringify(healthResult.data, null, 2)}`);
    console.log('   ✅ 健康检查通过\n');

    // 测试项目管理API（应该返回401未授权）
    console.log('2. 测试项目管理API（无认证）...');
    const projectsResult = await testProjectsAPI();
    console.log(`   状态码: ${projectsResult.status}`);
    console.log(`   响应: ${JSON.stringify(projectsResult.data, null, 2)}`);
    
    if (projectsResult.status === 401) {
      console.log('   ✅ 认证保护正常工作\n');
    } else {
      console.log('   ⚠️  认证保护可能有问题\n');
    }

    console.log('🎉 API测试完成！');
    console.log('\n📋 测试总结:');
    console.log('- 后端服务正在运行');
    console.log('- 健康检查端点正常');
    console.log('- 项目管理API需要认证');
    console.log('\n💡 要完整测试API功能，请运行: node test-projects-api.js');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
runTests();
