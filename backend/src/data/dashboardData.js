// Dashboard 静态数据
const statisticsData = [
  { 
    key: "accounts", 
    title: "推广账号总数", 
    value: 2846, 
    icon: "UserOutlined", 
    color: "#1677ff",
    increase: 12.5
  },
  { 
    key: "pendingReviews", 
    title: "待审核内容", 
    value: 152, 
    icon: "FileSearchOutlined", 
    color: "#faad14",
    increase: -8.2
  },
  { 
    key: "regions", 
    title: "活跃区域数", 
    value: 178, 
    icon: "GlobalOutlined", 
    color: "#52c41a",
    increase: 3.7
  },
  { 
    key: "commission", 
    title: "本月佣金(元)", 
    value: 284690, 
    precision: 2,
    prefix: "",
    icon: "UserOutlined", 
    color: "#722ed1",
    increase: 22.3
  }
];

const accountApplications = [
  {
    id: 1,
    name: "张三",
    region: "上海市",
    type: "城市推广",
    status: "待审核",
    createTime: "2023-05-08 14:21:33"
  },
  {
    id: 2,
    name: "李四",
    region: "北京市",
    type: "区域推广",
    status: "已通过",
    createTime: "2023-05-07 09:15:22"
  },
  {
    id: 3,
    name: "王五",
    region: "广州市",
    type: "城市推广",
    status: "已拒绝",
    createTime: "2023-05-06 16:42:11"
  },
  {
    id: 4,
    name: "赵六",
    region: "深圳市",
    type: "区域推广",
    status: "待审核",
    createTime: "2023-05-05 10:33:45"
  },
  {
    id: 5,
    name: "钱七",
    region: "杭州市",
    type: "城市推广",
    status: "已通过",
    createTime: "2023-05-04 15:27:36"
  }
];

module.exports = {
  statisticsData,
  accountApplications
};
