// 通用工具函数
const moment = require("moment");

// 生成唯一ID
const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// 格式化响应数据
const formatResponse = (success, data = null, message = "", code = 200) => {
  return {
    success,
    data,
    message,
    code,
    timestamp: moment().toISOString()
  };
};

// 分页处理
const paginate = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: data.slice(startIndex, endIndex),
    total: data.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(data.length / limit)
  };
};

// 数据过滤
const filterData = (data, filters) => {
  return data.filter(item => {
    return Object.keys(filters).every(key => {
      if (filters[key] === undefined || filters[key] === "") return true;
      return item[key] === filters[key];
    });
  });
};

// 数据排序
const sortData = (data, sortBy, sortOrder = "asc") => {
  return data.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (sortOrder === "desc") {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

// 验证版本号格式
const validateVersion = (version) => {
  const versionRegex = /^v\d+\.\d+\.\d+$/;
  return versionRegex.test(version);
};

// 生成版本号
const generateVersion = (major, minor, patch) => {
  return `v${major}.${minor}.${patch}`;
};

module.exports = {
  generateId,
  formatResponse,
  paginate,
  filterData,
  sortData,
  validateVersion,
  generateVersion
};
