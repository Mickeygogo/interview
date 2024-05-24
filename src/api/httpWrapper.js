import axios from 'axios';
import { message } from 'antd';

// 创建 axios 实例
const instance = axios.create({
  withCredentials: true,
  timeout: 20000, // 请求超时时间，单位为毫秒,
});


let globalApiKey = '';

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (globalApiKey) {
      config.headers['apiKey'] = globalApiKey;
    }

    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
     // 假设响应返回新的 apiKey
     if (response.data?.data?.apiKeyVo?.key) {
      globalApiKey = response.data?.data?.apiKeyVo?.key;
    }

    // 检查是否是下载请求
    if (

      response.headers['content-type'] ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      // 是下载请求，直接返回响应
      return response;
    }
    if (response.data.code !== 200) {
      requestIdleCallback(()=>{
        message.error(response.data.msg);
      })
    }

    // 缺少凭证
    if (response.data.code === 401) {
      requestIdleCallback(()=>{
        message.error(response.data.msg);
      })
    }
    // 无权限用户不存在
    if (response.data.code === 403) {
      requestIdleCallback(()=>{
        message.error(response.data.msg);
      })
    }
    // 在这里可以做一些响应后的操作
    return response;
  },
  (error) => {
    message.error(error);
    return Promise.reject(error);
  }
);

// 添加 download 方法
instance.downloadPost = (url, data, filename) => {
  return instance
    .post(url, data, {
      responseType: 'blob',
    })
    .then((response) => {
      // 创建Blob对象
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });

      // 创建下载链接
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // 清理
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    })
    .catch((error) => {
      console.log(error, 'error');
      // message.error('下载失败');
      // console.error('下载错误:', error);
    });
};

// 封装 HTTP 方法
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get: (url, params, config) => instance.get(url, { params }, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data) => instance.put(url, data),
  delete: (url) => instance.delete(url),
  downloadPost: (url, data, filename) =>
    instance.downloadPost(url, data, filename),
};
