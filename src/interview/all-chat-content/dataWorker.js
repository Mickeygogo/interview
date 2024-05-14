self.onmessage = function (e) {
  const { data, currentKey } = e.data;
  // 查找和排序逻辑
  const config = data.find((item) => item.key === currentKey) || {};
  const conversations =
    (data.find((item) => item.key === currentKey) || {}).data || [];
  self.postMessage({ config, conversations });
};
