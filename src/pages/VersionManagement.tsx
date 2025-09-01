import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
 
  Tabs, 
  Progress, 
  Timeline, 
  Descriptions,
  Alert,

  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  RollbackOutlined, 
  PlayCircleOutlined, 
  PauseCircleOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  EnvironmentOutlined,
  DeploymentUnitOutlined,
  HistoryOutlined,
  SettingOutlined,
  MonitorOutlined,
  ControlOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';

const { TextArea } = Input;

const { Option } = Select;

// 版本发布管理相关类型定义
interface VersionInfo {
  key: string;
  version: string;
  name: string;
  description: string;
  releaseDate: string;
  status: '开发中' | '测试中' | '待发布' | '已发布' | '已回滚';
  priority: '高' | '中' | '低';
  developer: string;
  testStatus: '未测试' | '测试中' | '测试通过' | '测试失败';
  rollbackVersion?: string;
}

// 部署管理相关类型定义
interface DeploymentInfo {
  key: string;
  environment: string;
  version: string;
  deployTime: string;
  status: '部署中' | '部署成功' | '部署失败' | '已回滚';
  progress: number;
  operator: string;
  duration: string;
  logs: string[];
}

// 模拟数据 - 版本信息
const versionData: VersionInfo[] = [
  {
    key: '1',
    version: 'v2.1.0',
    name: '用户权限优化',
    description: '优化用户权限管理，增加角色分配功能，提升系统安全性',
    releaseDate: '2024-01-15',
    status: '已发布',
    priority: '高',
    developer: '张三',
    testStatus: '测试通过'
  },
  {
    key: '2',
    version: 'v2.0.8',
    name: '性能优化',
    description: '优化系统响应速度，减少页面加载时间',
    releaseDate: '2024-01-10',
    status: '已发布',
    priority: '中',
    developer: '李四',
    testStatus: '测试通过'
  },
  {
    key: '3',
    version: 'v2.1.1',
    name: 'Bug修复',
    description: '修复用户反馈的已知问题，提升系统稳定性',
    releaseDate: '2024-01-20',
    status: '测试中',
    priority: '高',
    developer: '王五',
    testStatus: '测试中'
  },
  {
    key: '4',
    version: 'v2.0.7',
    name: '界面优化',
    description: '优化用户界面，提升用户体验',
    releaseDate: '2024-01-05',
    status: '已回滚',
    priority: '低',
    developer: '赵六',
    testStatus: '测试通过',
    rollbackVersion: 'v2.0.6'
  }
];

// 模拟数据 - 部署信息
const deploymentData: DeploymentInfo[] = [
  {
    key: '1',
    environment: '生产环境',
    version: 'v2.1.0',
    deployTime: '2024-01-15 14:30:00',
    status: '部署成功',
    progress: 100,
    operator: '张三',
    duration: '15分钟',
    logs: ['开始部署...', '代码同步完成', '数据库迁移完成', '服务重启完成', '部署成功']
  },
  {
    key: '2',
    environment: '测试环境',
    version: 'v2.1.1',
    deployTime: '2024-01-20 10:00:00',
    status: '部署中',
    progress: 65,
    operator: '李四',
    duration: '8分钟',
    logs: ['开始部署...', '代码同步完成', '数据库迁移中...']
  },
  {
    key: '3',
    environment: '预发布环境',
    version: 'v2.1.0',
    deployTime: '2024-01-14 16:00:00',
    status: '部署成功',
    progress: 100,
    operator: '王五',
    duration: '12分钟',
    logs: ['开始部署...', '代码同步完成', '服务重启完成', '部署成功']
  }
];

// 版本管理表格列定义
const versionColumns: ColumnsType<VersionInfo> = [
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    render: (version: string) => <Tag color="blue">{version}</Tag>
  },
  {
    title: '版本名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '发布日期',
    dataIndex: 'releaseDate',
    key: 'releaseDate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorMap: Record<string, string> = {
        '开发中': 'processing',
        '测试中': 'warning',
        '待发布': 'default',
        '已发布': 'success',
        '已回滚': 'error'
      };
      return <Badge status={colorMap[status] as any} text={status} />;
    }
  },
  {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    render: (priority: string) => {
      const colorMap: Record<string, string> = {
        '高': 'red',
        '中': 'orange',
        '低': 'green'
      };
      return <Tag color={colorMap[priority]}>{priority}</Tag>;
    }
  },
  {
    title: '开发者',
    dataIndex: 'developer',
    key: 'developer',
  },
  {
    title: '测试状态',
    dataIndex: 'testStatus',
    key: 'testStatus',
    render: (status: string) => {
      const colorMap: Record<string, string> = {
        '未测试': 'default',
        '测试中': 'processing',
        '测试通过': 'success',
        '测试失败': 'error'
      };
      return <Tag color={colorMap[status]}>{status}</Tag>;
    }
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record: VersionInfo) => (
      <Space size="small">
        <Button type="link" size="small" icon={<EditOutlined />}>
          编辑
        </Button>
        {record.status === '已发布' && (
          <Button 
            type="link" 
            size="small" 
            icon={<RollbackOutlined />}
            danger
          >
            回滚
          </Button>
        )}
        <Button type="link" size="small" icon={<DeleteOutlined />} danger>
          删除
        </Button>
      </Space>
    ),
  },
];

// 部署管理表格列定义
const deploymentColumns: ColumnsType<DeploymentInfo> = [
  {
    title: '环境',
    dataIndex: 'environment',
    key: 'environment',
    render: (environment: string) => {
      const colorMap: Record<string, string> = {
        '生产环境': 'red',
        '测试环境': 'blue',
        '预发布环境': 'orange'
      };
      return <Tag color={colorMap[environment]}>{environment}</Tag>;
    }
  },
  {
    title: '版本',
    dataIndex: 'version',
    key: 'version',
    render: (version: string) => <Tag color="blue">{version}</Tag>
  },
  {
    title: '部署时间',
    dataIndex: 'deployTime',
    key: 'deployTime',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: string, record: DeploymentInfo) => {
      const colorMap: Record<string, string> = {
        '部署中': 'processing',
        '部署成功': 'success',
        '部署失败': 'error',
        '已回滚': 'default'
      };
      return (
        <Space>
          <Badge status={colorMap[status] as any} text={status} />
          {status === '部署中' && (
            <Progress percent={record.progress} size="small" style={{ width: 80 }} />
          )}
        </Space>
      );
    }
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '耗时',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record: DeploymentInfo) => (
      <Space size="small">
        {record.status === '部署中' && (
          <Button type="link" size="small" icon={<PauseCircleOutlined />}>
            暂停
          </Button>
        )}
        {record.status === '部署成功' && (
          <Button type="link" size="small" icon={<RollbackOutlined />} danger>
            回滚
          </Button>
        )}
        <Button type="link" size="small" icon={<HistoryOutlined />}>
          日志
        </Button>
      </Space>
    ),
  },
];

const VersionManagement = () => {
  const [isVersionModalVisible, setIsVersionModalVisible] = useState(false);
  const [isDeploymentModalVisible, setIsDeploymentModalVisible] = useState(false);
  const [_selectedVersion, _setSelectedVersion] = useState<VersionInfo | null>(null);
  const [_selectedDeployment, _setSelectedDeployment] = useState<DeploymentInfo | null>(null);

  // 版本发布管理标签页配置
  const versionTabs: TabsProps['items'] = [
    {
      key: 'overview',
      label: '版本概览',
      icon: <HistoryOutlined />,
      children: (
        <div>
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">总版本数</div>
                    <div className="text-2xl font-bold mt-2">24</div>
                  </div>
                  <div className="flex justify-center items-center h-12 w-12 rounded-lg bg-blue-50">
                    <HistoryOutlined className="text-blue-500 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">已发布</div>
                    <div className="text-2xl font-bold mt-2">18</div>
                  </div>
                  <div className="flex justify-center items-center h-12 w-12 rounded-lg bg-green-50">
                    <CheckCircleOutlined className="text-green-500 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">开发中</div>
                    <div className="text-2xl font-bold mt-2">4</div>
                  </div>
                  <div className="flex justify-center items-center h-12 w-12 rounded-lg bg-orange-50">
                    <ClockCircleOutlined className="text-orange-500 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">已回滚</div>
                    <div className="text-2xl font-bold mt-2">2</div>
                  </div>
                  <div className="flex justify-center items-center h-12 w-12 rounded-lg bg-red-50">
                    <RollbackOutlined className="text-red-500 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          
          <Card title="版本列表" bordered={false}>
            <div className="mb-4">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsVersionModalVisible(true)}
              >
                新建版本
              </Button>
            </div>
            <Table 
              dataSource={versionData} 
              columns={versionColumns} 
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </Card>
        </div>
      )
    },
    {
      key: 'plan',
      label: '发布计划',
      icon: <ClockCircleOutlined />,
      children: (
        <Card bordered={false}>
          <Alert
            message="发布计划管理"
            description="制定版本发布计划，安排发布时间和资源分配"
            type="info"
            showIcon
            className="mb-4"
          />
          <div className="text-center py-8 text-gray-500">
            发布计划功能开发中...
          </div>
        </Card>
      )
    },
    {
      key: 'changelog',
      label: '更新日志',
      icon: <HistoryOutlined />,
      children: (
        <Card bordered={false}>
          <Timeline>
            <Timeline.Item color="green">
              <div className="font-medium">v2.1.0 - 2024-01-15</div>
              <div className="text-gray-600 mt-1">用户权限优化，增加角色分配功能</div>
            </Timeline.Item>
            <Timeline.Item color="blue">
              <div className="font-medium">v2.0.8 - 2024-01-10</div>
              <div className="text-gray-600 mt-1">性能优化，减少页面加载时间</div>
            </Timeline.Item>
            <Timeline.Item color="blue">
              <div className="font-medium">v2.0.7 - 2024-01-05</div>
              <div className="text-gray-600 mt-1">界面优化，提升用户体验</div>
            </Timeline.Item>
          </Timeline>
        </Card>
      )
    }
  ];

  // 部署管理标签页配置
  const deploymentTabs: TabsProps['items'] = [
    {
      key: 'environments',
      label: '环境配置',
      icon: <EnvironmentOutlined />,
      children: (
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card 
                title="生产环境" 
                bordered={false}
                className="h-full"
                extra={<Tag color="red">生产</Tag>}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="服务器">192.168.1.100</Descriptions.Item>
                  <Descriptions.Item label="端口">8080</Descriptions.Item>
                  <Descriptions.Item label="状态">运行中</Descriptions.Item>
                  <Descriptions.Item label="当前版本">v2.1.0</Descriptions.Item>
                </Descriptions>
                <div className="mt-4">
                  <Button type="primary" size="small" icon={<SettingOutlined />}>
                    配置
                  </Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                title="测试环境" 
                bordered={false}
                className="h-full"
                extra={<Tag color="blue">测试</Tag>}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="服务器">192.168.1.101</Descriptions.Item>
                  <Descriptions.Item label="端口">8081</Descriptions.Item>
                  <Descriptions.Item label="状态">运行中</Descriptions.Item>
                  <Descriptions.Item label="当前版本">v2.1.1</Descriptions.Item>
                </Descriptions>
                <div className="mt-4">
                  <Button type="primary" size="small" icon={<SettingOutlined />}>
                    配置
                  </Button>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                title="预发布环境" 
                bordered={false}
                className="h-full"
                extra={<Tag color="orange">预发布</Tag>}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="服务器">192.168.1.102</Descriptions.Item>
                  <Descriptions.Item label="端口">8082</Descriptions.Item>
                  <Descriptions.Item label="状态">运行中</Descriptions.Item>
                  <Descriptions.Item label="当前版本">v2.1.0</Descriptions.Item>
                </Descriptions>
                <div className="mt-4">
                  <Button type="primary" size="small" icon={<SettingOutlined />}>
                    配置
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      )
    },
    {
      key: 'monitor',
      label: '部署监控',
      icon: <MonitorOutlined />,
      children: (
        <Card bordered={false}>
          <div className="mb-4">
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={() => setIsDeploymentModalVisible(true)}
            >
              新建部署
            </Button>
          </div>
          <Table 
            dataSource={deploymentData} 
            columns={deploymentColumns} 
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>
      )
    },
    {
      key: 'control',
      label: '流程控制',
      icon: <ControlOutlined />,
      children: (
        <Card bordered={false}>
          <Alert
            message="部署流程控制"
            description="配置部署流程，设置自动化部署规则和审批流程"
            type="info"
            showIcon
            className="mb-4"
          />
          <div className="text-center py-8 text-gray-500">
            流程控制功能开发中...
          </div>
        </Card>
      )
    }
  ];

  return (
    <div className="version-management">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">版本管理</h1>
        <p className="text-gray-600 mt-2">管理软件版本发布和部署流程</p>
      </div>

      <Tabs 
        defaultActiveKey="version" 
        size="large"
        items={[
          {
            key: 'version',
            label: '版本发布管理',
            icon: <HistoryOutlined />,
            children: <Tabs defaultActiveKey="overview" items={versionTabs} />
          },
          {
            key: 'deployment',
            label: '部署管理',
            icon: <DeploymentUnitOutlined />,
            children: <Tabs defaultActiveKey="environments" items={deploymentTabs} />
          }
        ]}
      />

      {/* 新建版本弹窗 */}
      <Modal
        title="新建版本"
        open={isVersionModalVisible}
        onCancel={() => setIsVersionModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsVersionModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            确定
          </Button>
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="版本号" required>
                <Input placeholder="如：v2.1.0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优先级" required>
                <Select placeholder="选择优先级">
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="版本名称" required>
            <Input placeholder="输入版本名称" />
          </Form.Item>
          <Form.Item label="版本描述" required>
            <TextArea rows={4} placeholder="描述版本的主要功能和改进" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="计划发布日期" required>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="开发者" required>
                <Input placeholder="输入开发者姓名" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 新建部署弹窗 */}
      <Modal
        title="新建部署"
        open={isDeploymentModalVisible}
        onCancel={() => setIsDeploymentModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDeploymentModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            开始部署
          </Button>
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部署环境" required>
                <Select placeholder="选择部署环境">
                  <Option value="production">生产环境</Option>
                  <Option value="testing">测试环境</Option>
                  <Option value="staging">预发布环境</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部署版本" required>
                <Select placeholder="选择部署版本">
                  <Option value="v2.1.0">v2.1.0</Option>
                  <Option value="v2.1.1">v2.1.1</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="部署说明">
            <TextArea rows={3} placeholder="描述本次部署的目的和注意事项" />
          </Form.Item>
          <Form.Item label="部署策略">
            <Select placeholder="选择部署策略">
              <Option value="rolling">滚动部署</Option>
              <Option value="blue-green">蓝绿部署</Option>
              <Option value="canary">金丝雀部署</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VersionManagement; 