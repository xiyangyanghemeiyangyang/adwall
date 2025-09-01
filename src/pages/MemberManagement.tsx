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
  Tabs, 
  Tree, 
  Alert,
  Badge,
  Avatar
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined, 
  TeamOutlined, 
  SafetyOutlined, 
  KeyOutlined,
  UserSwitchOutlined,
  ApartmentOutlined,
  CrownOutlined,
  HomeOutlined,
  IdcardOutlined
} from '@ant-design/icons';

import type { TabsProps } from 'antd';
import type { TreeDataNode } from 'antd';

const { TextArea } = Input;
const { Option } = Select;


// 用户信息类型定义
interface UserInfo {
  key: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  department: string;
  position: string;
  role: string;
  permissions: string[];
  status: '正常' | '禁用' | '待激活';
  lastLogin: string;
  reportTo?: string;
  joinDate: string;
}

// 角色信息类型定义
interface RoleInfo {
  key: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  level: number;
  status: '启用' | '禁用';
  createDate: string;
}

// 部门信息类型定义
interface DepartmentInfo {
  key: string;
  name: string;
  code: string;
  description: string;
  parentId?: string;
  manager: string;
  memberCount: number;
  level: number;
  status: '启用' | '停用';
  createDate: string;
}



// 模拟用户数据
const userData: UserInfo[] = [
  {
    key: '1',
    id: 'U001',
    name: '张三',
    email: 'zhangsan@company.com',
    phone: '13812345678',
    avatar: '',
    department: '技术部',
    position: '高级前端工程师',
    role: '开发者',
    permissions: ['user.read', 'user.write', 'project.read'],
    status: '正常',
    lastLogin: '2024-01-20 10:30:00',
    reportTo: '李经理',
    joinDate: '2023-03-15'
  },
  {
    key: '2',
    id: 'U002',
    name: '李四',
    email: 'lisi@company.com',
    phone: '13987654321',
    avatar: '',
    department: '产品部',
    position: '产品经理',
    role: '管理员',
    permissions: ['user.read', 'user.write', 'admin.system'],
    status: '正常',
    lastLogin: '2024-01-20 09:15:00',
    reportTo: '王总监',
    joinDate: '2022-08-20'
  },
  {
    key: '3',
    id: 'U003',
    name: '王五',
    email: 'wangwu@company.com',
    phone: '13555666777',
    avatar: '',
    department: '设计部',
    position: 'UI设计师',
    role: '普通用户',
    permissions: ['user.read', 'design.read'],
    status: '待激活',
    lastLogin: '未登录',
    reportTo: '赵主管',
    joinDate: '2024-01-15'
  }
];

// 模拟角色数据
const roleData: RoleInfo[] = [
  {
    key: '1',
    name: '超级管理员',
    description: '拥有系统所有权限，可以管理系统设置',
    permissions: ['*'],
    userCount: 2,
    level: 1,
    status: '启用',
    createDate: '2023-01-01'
  },
  {
    key: '2',
    name: '部门管理员',
    description: '管理本部门用户和资源',
    permissions: ['user.read', 'user.write', 'dept.manage'],
    userCount: 5,
    level: 2,
    status: '启用',
    createDate: '2023-01-01'
  },
  {
    key: '3',
    name: '普通用户',
    description: '基础用户权限，查看和编辑个人信息',
    permissions: ['user.read', 'profile.edit'],
    userCount: 28,
    level: 3,
    status: '启用',
    createDate: '2023-01-01'
  }
];

// 模拟部门数据
const departmentData: DepartmentInfo[] = [
  {
    key: '1',
    name: '技术部',
    code: 'TECH',
    description: '负责产品开发和系统维护',
    manager: '李技术总监',
    memberCount: 15,
    level: 1,
    status: '启用',
    createDate: '2023-01-01'
  },
  {
    key: '2',
    name: '产品部',
    code: 'PROD',
    description: '负责产品规划和需求分析',
    manager: '王产品总监',
    memberCount: 8,
    level: 1,
    status: '启用',
    createDate: '2023-01-01'
  },
  {
    key: '3',
    name: '设计部',
    code: 'DESIGN',
    description: '负责产品UI/UX设计',
    parentId: '2',
    manager: '赵设计主管',
    memberCount: 6,
    level: 2,
    status: '启用',
    createDate: '2023-02-01'
  }
];

const MemberManagement = () => {
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [isDepartmentModalVisible, setIsDepartmentModalVisible] = useState(false);
  const [_selectedUser, _setSelectedUser] = useState<UserInfo | null>(null);
  const [_selectedRole, _setSelectedRole] = useState<RoleInfo | null>(null);

  // 权限管理树形数据
  const permissionTreeData: TreeDataNode[] = [
    {
      title: '系统管理',
      key: 'system',
      children: [
        {
          title: '用户管理',
          key: 'user',
          children: [
            { title: '查看用户', key: 'user.read' },
            { title: '创建用户', key: 'user.create' },
            { title: '编辑用户', key: 'user.update' },
            { title: '删除用户', key: 'user.delete' },
          ],
        },
        {
          title: '角色管理',
          key: 'role',
          children: [
            { title: '查看角色', key: 'role.read' },
            { title: '创建角色', key: 'role.create' },
            { title: '编辑角色', key: 'role.update' },
            { title: '删除角色', key: 'role.delete' },
          ],
        },
      ],
    },
    {
      title: '业务管理',
      key: 'business',
      children: [
        {
          title: '项目管理',
          key: 'project',
          children: [
            { title: '查看项目', key: 'project.read' },
            { title: '创建项目', key: 'project.create' },
            { title: '编辑项目', key: 'project.update' },
          ],
        },
      ],
    },
  ];

  // 组织架构树形数据
  const organizationTreeData: TreeDataNode[] = [
    {
      title: '公司总部',
      key: 'company',
      children: [
        {
          title: '技术部',
          key: 'tech',
          children: [
            { title: '前端组', key: 'frontend' },
            { title: '后端组', key: 'backend' },
            { title: '测试组', key: 'test' },
          ],
        },
        {
          title: '产品部',
          key: 'product',
          children: [
            { title: '产品设计组', key: 'design' },
            { title: '产品运营组', key: 'operation' },
          ],
        },
        {
          title: '人事部',
          key: 'hr',
        },
      ],
    },
  ];

  // 用户权限管理标签页配置
  const userPermissionTabs: TabsProps['items'] = [
    {
      key: 'users',
      label: '用户管理',
      icon: <UserOutlined />,
      children: (
        <div>
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">总用户数</div>
                    <div className="text-2xl font-bold mt-2">156</div>
                  </div>
                  <div className="flex justify-center items-center h-12 w-12 rounded-lg bg-blue-50">
                    <UserOutlined className="text-blue-500 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">活跃用户</div>
                    <div className="text-2xl font-bold mt-2">142</div>
                  </div>
                  <div className="flex justify-center items-center h-12 w-12 rounded-lg bg-green-50">
                    <SafetyOutlined className="text-green-500 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">管理员</div>
                    <div className="text-2xl font-bold mt-2">8</div>
                  </div>
                  <div className="flex justify-center items-center h-12 w-12 rounded-lg bg-orange-50">
                    <UserSwitchOutlined className="text-orange-500 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card bordered={false} className="h-full">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-500 text-sm">待激活</div>
                    <div className="text-2xl font-bold mt-2">6</div>
                  </div>
                  <div className="flex justify-center items-center h-12 w-12 rounded-lg bg-red-50">
                    <UserOutlined className="text-red-500 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
          
          <Card title="用户列表" bordered={false}>
            <div className="mb-4 flex justify-between">
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsUserModalVisible(true)}
              >
                新增用户
              </Button>
              <Space>
                <Input.Search placeholder="搜索用户" style={{ width: 200 }} />
                <Select placeholder="选择部门" style={{ width: 120 }}>
                  <Option value="tech">技术部</Option>
                  <Option value="product">产品部</Option>
                  <Option value="design">设计部</Option>
                </Select>
              </Space>
            </div>
            <Table 
              dataSource={userData} 
              columns={[
                {
                  title: '用户信息',
                  key: 'userInfo',
                  render: (_, _record: UserInfo) => (
                    <div className="flex items-center">
                      <Avatar size={40} icon={<UserOutlined />} className="mr-3" />
                      <div>
                        <div className="font-medium">{_record.name}</div>
                        <div className="text-gray-500 text-sm">{_record.email}</div>
                      </div>
                    </div>
                  ),
                },
                {
                  title: '工号',
                  dataIndex: 'id',
                  key: 'id',
                  render: (id: string) => <Tag color="blue">{id}</Tag>
                },
                {
                  title: '部门',
                  dataIndex: 'department',
                  key: 'department',
                },
                {
                  title: '职位',
                  dataIndex: 'position',
                  key: 'position',
                },
                {
                  title: '角色',
                  dataIndex: 'role',
                  key: 'role',
                  render: (role: string) => {
                    const colorMap: Record<string, string> = {
                      '超级管理员': 'red',
                      '管理员': 'orange',
                      '开发者': 'blue',
                      '普通用户': 'default'
                    };
                    return <Tag color={colorMap[role]}>{role}</Tag>;
                  }
                },
                {
                  title: '状态',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status: string) => {
                    const colorMap: Record<string, string> = {
                      '正常': 'success',
                      '禁用': 'error',
                      '待激活': 'warning'
                    };
                    return <Badge status={colorMap[status] as any} text={status} />;
                  }
                },
                {
                  title: '最后登录',
                  dataIndex: 'lastLogin',
                  key: 'lastLogin',
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, _record: UserInfo) => (
                    <Space size="small">
                      <Button type="link" size="small" icon={<EditOutlined />}>
                        编辑
                      </Button>
                      <Button type="link" size="small" icon={<KeyOutlined />}>
                        权限
                      </Button>
                      <Button type="link" size="small" icon={<DeleteOutlined />} danger>
                        删除
                      </Button>
                    </Space>
                  ),
                },
              ]} 
              pagination={{ pageSize: 10 }}
              size="middle"
            />
          </Card>
        </div>
      )
    },
    {
      key: 'roles',
      label: '角色管理',
      icon: <CrownOutlined />,
      children: (
        <Card bordered={false}>
          <div className="mb-4">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsRoleModalVisible(true)}
            >
              新增角色
            </Button>
          </div>
          <Table 
            dataSource={roleData} 
            columns={[
              {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
                render: (name: string, record: RoleInfo) => (
                  <div className="flex items-center">
                    <CrownOutlined className="mr-2 text-orange-500" />
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-gray-500 text-sm">等级: {record.level}</div>
                    </div>
                  </div>
                ),
              },
              {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true,
              },
              {
                title: '用户数量',
                dataIndex: 'userCount',
                key: 'userCount',
                render: (count: number) => <Badge count={count} showZero />
              },
              {
                title: '权限数量',
                dataIndex: 'permissions',
                key: 'permissions',
                render: (permissions: string[]) => {
                  if (permissions.includes('*')) {
                    return <Tag color="red">全部权限</Tag>;
                  }
                  return <Badge count={permissions.length} showZero />;
                }
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => {
                  const colorMap: Record<string, string> = {
                    '启用': 'success',
                    '禁用': 'error'
                  };
                  return <Badge status={colorMap[status] as any} text={status} />;
                }
              },
              {
                title: '创建时间',
                dataIndex: 'createDate',
                key: 'createDate',
              },
              {
                title: '操作',
                key: 'action',
                render: (_, _record: RoleInfo) => (
                  <Space size="small">
                    <Button type="link" size="small" icon={<EditOutlined />}>
                      编辑
                    </Button>
                    <Button type="link" size="small" icon={<KeyOutlined />}>
                      权限
                    </Button>
                    <Button type="link" size="small" icon={<DeleteOutlined />} danger>
                      删除
                    </Button>
                  </Space>
                ),
              },
            ]} 
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>
      )
    },
    {
      key: 'permissions',
      label: '权限配置',
      icon: <KeyOutlined />,
      children: (
        <Card bordered={false}>
          <Alert
            message="权限管理"
            description="管理系统中所有权限，控制用户访问权限"
            type="info"
            showIcon
            className="mb-4"
          />
          <Row gutter={16}>
            <Col span={12}>
              <Card title="权限树" size="small">
                <Tree
                  checkable
                  defaultExpandAll
                  treeData={permissionTreeData}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="权限说明" size="small">
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">系统管理权限</div>
                    <div className="text-sm text-gray-600">管理用户、角色、权限等系统核心功能</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">业务管理权限</div>
                    <div className="text-sm text-gray-600">管理项目、数据等业务相关功能</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      )
    }
  ];

  // 团队组织架构标签页配置
  const organizationTabs: TabsProps['items'] = [
    {
      key: 'departments',
      label: '部门管理',
      icon: <HomeOutlined />,
      children: (
        <Card bordered={false}>
          <div className="mb-4">
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsDepartmentModalVisible(true)}
            >
              新增部门
            </Button>
          </div>
          <Table 
            dataSource={departmentData} 
            columns={[
              {
                title: '部门信息',
                key: 'deptInfo',
                render: (_, _record: DepartmentInfo) => (
                  <div className="flex items-center">
                    <HomeOutlined className="mr-2 text-blue-500" />
                    <div>
                      <div className="font-medium">{_record.name}</div>
                      <div className="text-gray-500 text-sm">编码: {_record.code}</div>
                    </div>
                  </div>
                ),
              },
              {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true,
              },
              {
                title: '负责人',
                dataIndex: 'manager',
                key: 'manager',
              },
              {
                title: '成员数量',
                dataIndex: 'memberCount',
                key: 'memberCount',
                render: (count: number) => <Badge count={count} showZero />
              },
              {
                title: '层级',
                dataIndex: 'level',
                key: 'level',
                render: (level: number) => <Tag color="blue">L{level}</Tag>
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => {
                  const colorMap: Record<string, string> = {
                    '启用': 'success',
                    '停用': 'error'
                  };
                  return <Badge status={colorMap[status] as any} text={status} />;
                }
              },
              {
                title: '操作',
                key: 'action',
                render: (_, _record: DepartmentInfo) => (
                  <Space size="small">
                    <Button type="link" size="small" icon={<EditOutlined />}>
                      编辑
                    </Button>
                    <Button type="link" size="small" icon={<TeamOutlined />}>
                      成员
                    </Button>
                    <Button type="link" size="small" icon={<DeleteOutlined />} danger>
                      删除
                    </Button>
                  </Space>
                ),
              },
            ]} 
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>
      )
    },
    {
      key: 'positions',
      label: '职位管理',
      icon: <IdcardOutlined />,
      children: (
        <Card bordered={false}>
          <Alert
            message="职位管理"
            description="管理公司职位体系，设置职位等级和职责"
            type="info"
            showIcon
            className="mb-4"
          />
          <div className="text-center py-8 text-gray-500">
            职位管理功能开发中...
          </div>
        </Card>
      )
    },
    {
      key: 'organization',
      label: '组织架构',
      icon: <ApartmentOutlined />,
      children: (
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="组织架构图" size="small">
                <Tree
                  showLine
                  defaultExpandAll
                  treeData={organizationTreeData}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="汇报关系" size="small">
                <div className="space-y-3">
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
                        <span>张三</span>
                      </div>
                      <div className="text-gray-500"></div>
                      <div className="flex items-center">
                        <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
                        <span>李经理</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border rounded">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
                        <span>李四</span>
                      </div>
                      <div className="text-gray-500"></div>
                      <div className="flex items-center">
                        <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
                        <span>王总监</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      )
    }
  ];

  return (
    <div className="member-management">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">成员管理</h1>
        <p className="text-gray-600 mt-2">管理团队成员、角色权限和组织架构</p>
      </div>

      <Tabs 
        defaultActiveKey="permission" 
        size="large"
        items={[
          {
            key: 'permission',
            label: '用户权限管理',
            icon: <SafetyOutlined />,
            children: <Tabs defaultActiveKey="users" items={userPermissionTabs} />
          },
          {
            key: 'organization',
            label: '团队组织架构',
            icon: <ApartmentOutlined />,
            children: <Tabs defaultActiveKey="departments" items={organizationTabs} />
          }
        ]}
      />

      {/* 新增用户弹窗 */}
      <Modal
        title="新增用户"
        open={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsUserModalVisible(false)}>
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
              <Form.Item label="姓名" required>
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="工号" required>
                <Input placeholder="请输入工号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="邮箱" required>
                <Input placeholder="请输入邮箱" type="email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="手机号" required>
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门" required>
                <Select placeholder="选择部门">
                  <Option value="tech">技术部</Option>
                  <Option value="product">产品部</Option>
                  <Option value="design">设计部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="职位" required>
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="角色" required>
                <Select placeholder="选择角色">
                  <Option value="admin">管理员</Option>
                  <Option value="user">普通用户</Option>
                  <Option value="developer">开发者</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="汇报上级">
                <Input placeholder="请输入汇报上级" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 新增角色弹窗 */}
      <Modal
        title="新增角色"
        open={isRoleModalVisible}
        onCancel={() => setIsRoleModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsRoleModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary">
            确定
          </Button>
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="角色名称" required>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item label="角色描述" required>
            <TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="角色等级" required>
                <Select placeholder="选择角色等级">
                  <Option value={1}>1级 - 超级管理员</Option>
                  <Option value={2}>2级 - 部门管理员</Option>
                  <Option value={3}>3级 - 普通用户</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" required>
                <Select placeholder="选择状态" defaultValue="启用">
                  <Option value="启用">启用</Option>
                  <Option value="禁用">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="权限配置">
            <Tree
              checkable
              defaultExpandAll
              treeData={permissionTreeData}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增部门弹窗 */}
      <Modal
        title="新增部门"
        open={isDepartmentModalVisible}
        onCancel={() => setIsDepartmentModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsDepartmentModalVisible(false)}>
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
              <Form.Item label="部门名称" required>
                <Input placeholder="请输入部门名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门编码" required>
                <Input placeholder="请输入部门编码" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="部门描述">
            <TextArea rows={3} placeholder="请输入部门描述" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="上级部门">
                <Select placeholder="选择上级部门">
                  <Option value="tech">技术部</Option>
                  <Option value="product">产品部</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="部门负责人" required>
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="部门层级" required>
                <Select placeholder="选择部门层级">
                  <Option value={1}>1级部门</Option>
                  <Option value={2}>2级部门</Option>
                  <Option value={3}>3级部门</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" required>
                <Select placeholder="选择状态" defaultValue="启用">
                  <Option value="启用">启用</Option>
                  <Option value="停用">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberManagement;
