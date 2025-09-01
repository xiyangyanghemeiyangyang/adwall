/**
 * 项目管理服务
 * 处理项目、里程碑、代码审查、分支等业务逻辑
 */

const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { 
  projects, 
  milestones, 
  codeReviews, 
  branches,
  getProjectStats,
  getCodeQualityStats,
  getRecentActivities
} = require('../data/projectData');

class ProjectService {
  // 项目管理
  getAllProjects() {
    return {
      success: true,
      data: projects,
      total: projects.length
    };
  }

  getProjectById(id) {
    const project = projects.find(p => p.id === id);
    if (!project) {
      return {
        success: false,
        message: '项目不存在',
        code: 404
      };
    }
    return {
      success: true,
      data: project
    };
  }

  createProject(projectData) {
    const newProject = {
      id: uuidv4(),
      name: projectData.name,
      description: projectData.description || '',
      progress: 0,
      status: '计划中',
      startDate: projectData.startDate || moment().format('YYYY-MM-DD'),
      endDate: projectData.endDate || moment().add(3, 'months').format('YYYY-MM-DD'),
      teamMembers: projectData.teamMembers || 1,
      tasks: { total: 0, completed: 0, pending: 0 },
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      createdBy: projectData.createdBy || 'admin',
      tags: projectData.tags || []
    };

    projects.push(newProject);
    return {
      success: true,
      data: newProject,
      message: '项目创建成功'
    };
  }

  updateProject(id, updateData) {
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return {
        success: false,
        message: '项目不存在',
        code: 404
      };
    }

    const updatedProject = {
      ...projects[projectIndex],
      ...updateData,
      id, // 确保ID不被修改
      updatedAt: moment().toISOString()
    };

    projects[projectIndex] = updatedProject;
    return {
      success: true,
      data: updatedProject,
      message: '项目更新成功'
    };
  }

  deleteProject(id) {
    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      return {
        success: false,
        message: '项目不存在',
        code: 404
      };
    }

    // 删除相关数据
    const projectMilestones = milestones.filter(m => m.projectId === id);
    const projectReviews = codeReviews.filter(r => r.projectId === id);
    const projectBranches = branches.filter(b => b.projectId === id);

    // 从数组中删除
    projects.splice(projectIndex, 1);
    projectMilestones.forEach(milestone => {
      const index = milestones.findIndex(m => m.id === milestone.id);
      if (index !== -1) milestones.splice(index, 1);
    });
    projectReviews.forEach(review => {
      const index = codeReviews.findIndex(r => r.id === review.id);
      if (index !== -1) codeReviews.splice(index, 1);
    });
    projectBranches.forEach(branch => {
      const index = branches.findIndex(b => b.id === branch.id);
      if (index !== -1) branches.splice(index, 1);
    });

    return {
      success: true,
      message: '项目删除成功'
    };
  }

  // 里程碑管理
  getMilestonesByProject(projectId) {
    const projectMilestones = milestones.filter(m => m.projectId === projectId);
    return {
      success: true,
      data: projectMilestones,
      total: projectMilestones.length
    };
  }

  getAllMilestones() {
    return {
      success: true,
      data: milestones,
      total: milestones.length
    };
  }

  createMilestone(milestoneData) {
    const newMilestone = {
      id: uuidv4(),
      title: milestoneData.title,
      description: milestoneData.description || '',
      dueDate: milestoneData.dueDate,
      status: '未开始',
      progress: 0,
      projectId: milestoneData.projectId,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      completedAt: null,
      assignedTo: milestoneData.assignedTo || null
    };

    milestones.push(newMilestone);
    return {
      success: true,
      data: newMilestone,
      message: '里程碑创建成功'
    };
  }

  updateMilestone(id, updateData) {
    const milestoneIndex = milestones.findIndex(m => m.id === id);
    if (milestoneIndex === -1) {
      return {
        success: false,
        message: '里程碑不存在',
        code: 404
      };
    }

    const updatedMilestone = {
      ...milestones[milestoneIndex],
      ...updateData,
      id, // 确保ID不被修改
      updatedAt: moment().toISOString(),
      completedAt: updateData.status === '已完成' && milestones[milestoneIndex].status !== '已完成' 
        ? moment().toISOString() 
        : milestones[milestoneIndex].completedAt
    };

    milestones[milestoneIndex] = updatedMilestone;
    return {
      success: true,
      data: updatedMilestone,
      message: '里程碑更新成功'
    };
  }

  deleteMilestone(id) {
    const milestoneIndex = milestones.findIndex(m => m.id === id);
    if (milestoneIndex === -1) {
      return {
        success: false,
        message: '里程碑不存在',
        code: 404
      };
    }

    milestones.splice(milestoneIndex, 1);
    return {
      success: true,
      message: '里程碑删除成功'
    };
  }

  // 代码审查管理
  getAllCodeReviews() {
    return {
      success: true,
      data: codeReviews,
      total: codeReviews.length
    };
  }

  getCodeReviewById(id) {
    const review = codeReviews.find(r => r.id === id);
    if (!review) {
      return {
        success: false,
        message: '代码审查不存在',
        code: 404
      };
    }
    return {
      success: true,
      data: review
    };
  }

  createCodeReview(reviewData) {
    const newReview = {
      id: uuidv4(),
      title: reviewData.title,
      author: reviewData.author,
      reviewer: reviewData.reviewer,
      status: '待审查',
      createTime: moment().toISOString(),
      linesChanged: reviewData.linesChanged || 0,
      comments: 0,
      projectId: reviewData.projectId,
      branchName: reviewData.branchName || '',
      commitHash: reviewData.commitHash || '',
      description: reviewData.description || '',
      filesChanged: reviewData.filesChanged || [],
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString()
    };

    codeReviews.push(newReview);
    return {
      success: true,
      data: newReview,
      message: '代码审查创建成功'
    };
  }

  updateCodeReview(id, updateData) {
    const reviewIndex = codeReviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) {
      return {
        success: false,
        message: '代码审查不存在',
        code: 404
      };
    }

    const updatedReview = {
      ...codeReviews[reviewIndex],
      ...updateData,
      id, // 确保ID不被修改
      updatedAt: moment().toISOString(),
      approvedAt: updateData.status === '已通过' && codeReviews[reviewIndex].status !== '已通过'
        ? moment().toISOString()
        : codeReviews[reviewIndex].approvedAt
    };

    codeReviews[reviewIndex] = updatedReview;
    return {
      success: true,
      data: updatedReview,
      message: '代码审查更新成功'
    };
  }

  deleteCodeReview(id) {
    const reviewIndex = codeReviews.findIndex(r => r.id === id);
    if (reviewIndex === -1) {
      return {
        success: false,
        message: '代码审查不存在',
        code: 404
      };
    }

    codeReviews.splice(reviewIndex, 1);
    return {
      success: true,
      message: '代码审查删除成功'
    };
  }

  // 分支管理
  getAllBranches() {
    return {
      success: true,
      data: branches,
      total: branches.length
    };
  }

  getBranchesByProject(projectId) {
    const projectBranches = branches.filter(b => b.projectId === projectId);
    return {
      success: true,
      data: projectBranches,
      total: projectBranches.length
    };
  }

  createBranch(branchData) {
    const newBranch = {
      id: uuidv4(),
      name: branchData.name,
      type: branchData.type || 'feature',
      lastCommit: moment().toISOString(),
      author: branchData.author,
      status: '活跃',
      commits: 0,
      projectId: branchData.projectId,
      description: branchData.description || '',
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      lastCommitHash: '',
      isProtected: branchData.isProtected || false
    };

    branches.push(newBranch);
    return {
      success: true,
      data: newBranch,
      message: '分支创建成功'
    };
  }

  updateBranch(id, updateData) {
    const branchIndex = branches.findIndex(b => b.id === id);
    if (branchIndex === -1) {
      return {
        success: false,
        message: '分支不存在',
        code: 404
      };
    }

    const updatedBranch = {
      ...branches[branchIndex],
      ...updateData,
      id, // 确保ID不被修改
      updatedAt: moment().toISOString()
    };

    branches[branchIndex] = updatedBranch;
    return {
      success: true,
      data: updatedBranch,
      message: '分支更新成功'
    };
  }

  deleteBranch(id) {
    const branchIndex = branches.findIndex(b => b.id === id);
    if (branchIndex === -1) {
      return {
        success: false,
        message: '分支不存在',
        code: 404
      };
    }

    branches.splice(branchIndex, 1);
    return {
      success: true,
      message: '分支删除成功'
    };
  }

  // 统计信息
  getProjectStatistics() {
    return {
      success: true,
      data: {
        projects: getProjectStats(),
        codeQuality: getCodeQualityStats(),
        recentActivities: getRecentActivities()
      }
    };
  }

  // 仪表板数据
  getDashboardData() {
    const projectStats = getProjectStats();
    const codeQualityStats = getCodeQualityStats();
    const recentActivities = getRecentActivities();

    return {
      success: true,
      data: {
        overview: {
          totalProjects: projectStats.totalProjects,
          activeProjects: projectStats.activeProjects,
          completedProjects: projectStats.completedProjects,
          totalTeamMembers: projectStats.totalTeamMembers,
          completionRate: projectStats.completionRate
        },
        codeQuality: codeQualityStats,
        recentActivities: recentActivities.slice(0, 5), // 只返回最近5条
        projects: projects.slice(0, 3), // 只返回前3个项目
        milestones: milestones.filter(m => m.status === '进行中').slice(0, 3)
      }
    };
  }
}

module.exports = new ProjectService();
