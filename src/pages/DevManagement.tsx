import React, { useState } from 'react';
import { Card, Row, Col, Tabs, Typography, Button, Space, Progress, Tag, Table, List, Avatar, Badge } from 'antd';
import { 
  ProjectOutlined, 
  ClockCircleOutlined, 
  UserOutlined, 
  CheckCircleOutlined,
  CodeOutlined,
  BranchesOutlined,
  EyeOutlined,
  BugOutlined,
  StarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;

// 项目数据接口
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
}

// 里程碑数据接口
interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: '未开始' | '进行中' | '已完成' | '延期';
  progress: number;
  projectId: string;
}

// 代码审查数据接口
interface CodeReview {
  id: string;
  title: string;
  author: string;
  reviewer: string;
  status: '待审查' | '审查中' | '已通过' | '需修改';
  createTime: string;
  linesChanged: number;
  comments: number;
}

// 分支数据接口
interface Branch {
  id: string;
  name: string;
  type: 'main' | 'develop' | 'feature' | 'hotfix';
  lastCommit: string;
  author: string;
  status: '活跃' | '合并' | '删除';
  commits: number;
}

// 模拟数据
const projectsData: Project[] = [
  {
    id: '1',
    name: 'CRM系统升级',
    description: '升级现有CRM系统，增加新功能和优化用户体验',
    progress: 75,
    status: '进行中',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    teamMembers: 8,
    tasks: { total: 24, completed: 18, pending: 6 }
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
    tasks: { total: 32, completed: 14, pending: 18 }
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
    tasks: { total: 18, completed: 18, pending: 0 }
  }
];

const milestonesData: Milestone[] = [
  {
    id: '1',
    title: '用户界面设计完成',
    description: '完成所有页面的UI/UX设计',
    dueDate: '2024-02-15',
    status: '已完成',
    progress: 100,
    projectId: '1'
  },
  {
    id: '2',
    title: '后端API开发',
    description: '完成核心业务逻辑和API接口开发',
    dueDate: '2024-02-28',
    status: '进行中',
    progress: 80,
    projectId: '1'
  },
  {
    id: '3',
    title: '移动端原型设计',
    description: '完成移动端应用的原型设计',
    dueDate: '2024-03-10',
    status: '进行中',
    progress: 60,
    projectId: '2'
  }
];

const codeReviewsData: CodeReview[] = [
  {
    id: '1',
    title: '用户管理模块重构',
    author: '张三',
    reviewer: '李四',
    status: '待审查',
    createTime: '2024-02-10 14:30',
    linesChanged: 156,
    comments: 0
  },
  {
    id: '2',
    title: 'API接口优化',
    author: '王五',
    reviewer: '赵六',
    status: '审查中',
    createTime: '2024-02-09 16:45',
    linesChanged: 89,
    comments: 3
  },
  {
    id: '3',
    title: '数据库查询优化',
    author: '钱七',
    reviewer: '孙八',
    status: '已通过',
    createTime: '2024-02-08 10:20',
    linesChanged: 234,
    comments: 1
  }
];

const branchesData: Branch[] = [
  {
    id: '1',
    name: 'main',
    type: 'main',
    lastCommit: '2024-02-10 15:30',
    author: '张三',
    status: '活跃',
    commits: 156
  },
  {
    id: '2',
    name: 'develop',
    type: 'develop',
    lastCommit: '2024-02-10 14:20',
    author: '李四',
    status: '活跃',
    commits: 89
  },
  {
    id: '3',
    name: 'feature/user-management',
    type: 'feature',
    lastCommit: '2024-02-09 16:45',
    author: '王五',
    status: '活跃',
    commits: 23
  }
];

const DevManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projects');

  // 项目表格列定义
  const projectColumns: ColumnsType<Project> = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Progress 
          percent={progress} 
          size="small" 
          strokeColor="#0ea5e9"
          trailColor="#f3f4f6"
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap: Record<string, string> = {
          '进行中': '#0ea5e9',
          '已完成': '#10b981',
          '暂停': '#f59e0b',
          '计划中': '#6b7280',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '团队规模',
      dataIndex: 'teamMembers',
      key: 'teamMembers',
      render: (members) => (
        <Space>
          <UserOutlined />
          {members}人
        </Space>
      ),
    },
    {
      title: '任务统计',
      key: 'tasks',
      render: (_, record) => (
        <div>
          <Text type="secondary">
            已完成: {record.tasks.completed}/{record.tasks.total}
          </Text>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 代码审查表格列定义
  const reviewColumns: ColumnsType<CodeReview> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (author) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {author}
        </Space>
      ),
    },
    {
      title: '审查者',
      dataIndex: 'reviewer',
      key: 'reviewer',
      render: (reviewer) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {reviewer}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap: Record<string, string> = {
          '待审查': '#f59e0b',
          '审查中': '#0ea5e9',
          '已通过': '#10b981',
          '需修改': '#ef4444',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '代码变更',
      dataIndex: 'linesChanged',
      key: 'linesChanged',
      render: (lines) => (
        <Text type="secondary">{lines} 行</Text>
      ),
    },
    {
      title: '评论数',
      dataIndex: 'comments',
      key: 'comments',
      render: (comments) => (
        <Badge count={comments} size="small" />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
  ];

  // 分支表格列定义
  const branchColumns: ColumnsType<Branch> = [
    {
      title: '分支名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <BranchesOutlined />
          <Text code>{name}</Text>
          {record.type === 'main' && <Tag color="red">主分支</Tag>}
          {record.type === 'develop' && <Tag color="blue">开发分支</Tag>}
          {record.type === 'feature' && <Tag color="green">功能分支</Tag>}
          {record.type === 'hotfix' && <Tag color="orange">修复分支</Tag>}
        </Space>
      ),
    },
    {
      title: '最后提交',
      dataIndex: 'lastCommit',
      key: 'lastCommit',
    },
    {
      title: '提交者',
      dataIndex: 'author',
      key: 'author',
      render: (author) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {author}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap: Record<string, string> = {
          '活跃': '#10b981',
          '合并': '#0ea5e9',
          '删除': '#ef4444',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '提交数',
      dataIndex: 'commits',
      key: 'commits',
      render: (commits) => (
        <Text type="secondary">{commits}</Text>
      ),
    },
  ];

  // 项目管理标签页内容
  const ProjectManagementTab = () => (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={4} className="mb-2 text-gray-800">项目管理</Title>
          <Text type="secondary" className="text-gray-600">跟踪项目进度，分配和管理任务</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          className="bg-primary-600 hover:bg-primary-700 border-primary-600 hover:border-primary-700"
        >
          新建项目
        </Button>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card className="shadow-soft border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {projectsData.length}
              </div>
              <Text type="secondary" className="text-gray-600">总项目数</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-soft border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {projectsData.filter(p => p.status === '进行中').length}
              </div>
              <Text type="secondary" className="text-gray-600">进行中</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="shadow-soft border-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 mb-2">
                {projectsData.reduce((sum, p) => sum + p.teamMembers, 0)}
              </div>
              <Text type="secondary" className="text-gray-600">团队成员</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Card 
        title={<span className="text-gray-800">项目列表</span>} 
        className="shadow-soft border-0"
        extra={
          <Space>
            <Button size="small" className="text-gray-600 border-gray-300 hover:border-primary-500 hover:text-primary-600">
              导出
            </Button>
            <Button size="small" className="text-gray-600 border-gray-300 hover:border-primary-500 hover:text-primary-600">
              筛选
            </Button>
          </Space>
        }
      >
        <Table
          columns={projectColumns}
          dataSource={projectsData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="project-table"
        />
      </Card>
    </div>
  );

  // 里程碑管理标签页内容
  const MilestoneManagementTab = () => (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Title level={4} className="mb-2 text-gray-800">里程碑管理</Title>
          <Text type="secondary" className="text-gray-600">跟踪项目关键节点和里程碑进度</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          className="bg-primary-600 hover:bg-primary-700 border-primary-600 hover:border-primary-700"
        >
          新建里程碑
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {milestonesData.map(milestone => (
          <Col xs={24} sm={12} lg={8} key={milestone.id}>
            <Card className="shadow-soft border-0 hover:shadow-medium transition-shadow">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <Title level={5} className="mb-0 text-gray-800">{milestone.title}</Title>
                  <Tag color={
                    milestone.status === '已完成' ? 'green' :
                    milestone.status === '进行中' ? 'blue' :
                    milestone.status === '延期' ? 'red' : 'default'
                  }>
                    {milestone.status}
                  </Tag>
                </div>
                <Text type="secondary" className="block mb-3 text-gray-600">
                  {milestone.description}
                </Text>
                <div className="mb-3">
                  <Text type="secondary" className="block mb-1 text-gray-600">进度</Text>
                  <Progress 
                    percent={milestone.progress} 
                    size="small"
                    strokeColor="#0ea5e9"
                    trailColor="#f3f4f6"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Text type="secondary" className="text-sm text-gray-500">
                    截止日期: {milestone.dueDate}
                  </Text>
                  <Space>
                    <Button 
                      size="small" 
                      icon={<EditOutlined />}
                      className="text-gray-600 border-gray-300 hover:border-primary-500 hover:text-primary-600"
                    >
                      编辑
                    </Button>
                    <Button 
                      size="small" 
                      icon={<EyeOutlined />}
                      className="text-gray-600 border-gray-300 hover:border-primary-500 hover:text-primary-600"
                    >
                      查看
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  // 代码管理标签页内容
  const CodeManagementTab = () => (
    <div className="p-6">
      <div className="mb-6">
        <Title level={4} className="mb-2 text-gray-800">代码管理</Title>
        <Text type="secondary" className="text-gray-600">代码审查、分支管理和质量监控</Text>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} lg={12}>
          <Card 
            title={<span className="text-gray-800">代码审查流程</span>} 
            className="shadow-soft border-0"
            extra={
              <Button 
                size="small" 
                icon={<PlusOutlined />}
                className="text-gray-600 border-gray-300 hover:border-primary-500 hover:text-primary-600"
              >
                新建审查
              </Button>
            }
          >
            <Table
              columns={reviewColumns}
              dataSource={codeReviewsData}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={<span className="text-gray-800">分支管理策略</span>} 
            className="shadow-soft border-0"
            extra={
              <Button 
                size="small" 
                icon={<PlusOutlined />}
                className="text-gray-600 border-gray-300 hover:border-primary-500 hover:text-primary-600"
              >
                新建分支
              </Button>
            }
          >
            <Table
              columns={branchColumns}
              dataSource={branchesData}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card 
            title={<span className="text-gray-800">代码质量监控</span>} 
            className="shadow-soft border-0"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                <Space>
                  <CheckCircleOutlined className="text-green-600" />
                  <Text className="text-gray-700">代码覆盖率</Text>
                </Space>
                <Text strong className="text-green-600">85%</Text>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-md">
                <Space>
                  <BugOutlined className="text-red-600" />
                  <Text className="text-gray-700">Bug数量</Text>
                </Space>
                <Text strong className="text-red-600">12</Text>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
                <Space>
                  <StarOutlined className="text-yellow-600" />
                  <Text className="text-gray-700">代码质量评分</Text>
                </Space>
                <Text strong className="text-yellow-600">A+</Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={16}>
          <Card 
            title={<span className="text-gray-800">最近活动</span>} 
            className="shadow-soft border-0"
          >
            <List
              dataSource={[
                {
                  title: '张三提交了用户管理模块的代码审查',
                  time: '2小时前',
                  avatar: <Avatar icon={<UserOutlined />} className="bg-primary-100 text-primary-600" />,
                },
                {
                  title: '李四合并了feature/user-auth分支到develop',
                  time: '4小时前',
                  avatar: <Avatar icon={<UserOutlined />} className="bg-green-100 text-green-600" />,
                },
                {
                  title: '王五通过了API接口优化的代码审查',
                  time: '6小时前',
                  avatar: <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />,
                },
              ]}
              renderItem={(item) => (
                <List.Item className="hover:bg-gray-50 rounded-md px-2 py-1">
                  <List.Item.Meta
                    avatar={item.avatar}
                    title={<span className="text-gray-800">{item.title}</span>}
                    description={<span className="text-gray-500">{item.time}</span>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'projects',
      label: (
        <Space>
          <ProjectOutlined />
          项目管理
        </Space>
      ),
      children: <ProjectManagementTab />,
    },
    {
      key: 'milestones',
      label: (
        <Space>
          <ClockCircleOutlined />
          里程碑管理
        </Space>
      ),
      children: <MilestoneManagementTab />,
    },
    {
      key: 'code',
      label: (
        <Space>
          <CodeOutlined />
          代码管理
        </Space>
      ),
      children: <CodeManagementTab />,
    },
  ];

  return (
    <div className="dev-management bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-soft p-6 mb-6">
        <Title level={3} className="text-gray-800 mb-2">开发管理</Title>
        <Text type="secondary" className="block text-gray-600">
          管理项目开发流程，跟踪进度，确保代码质量
        </Text>
      </div>
      
      <div className="bg-white rounded-lg shadow-soft">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          className="px-6"
          tabBarStyle={{
            borderBottom: '1px solid #f0f0f0',
            marginBottom: 0
          }}
        />
      </div>
    </div>
  );
};

export default DevManagement;
