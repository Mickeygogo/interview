import http from './httpWrapper';

// TODO
// export const chatKnowledgeSSEPath = `${
//   import.meta.env.VITE_APP_API_BASE_URL
// }/third-parties/chat-knowledge`;

export const chatKnowledgeSSEPath = `${process.env.REACT_APP_ROUTER_BASE_URL}/third-parties/chat-knowledge`;

export const queryShareDetailInfo = (params, config) => {
  return http.post(`${process.env.REACT_APP_ROUTER_BASE_URL}/no-auth/query-shareDetailInfo`, params, config);
};

export const abortChatKnowledge = (params) => {
  return http.get(
    `${process.env.REACT_APP_ROUTER_BASE_URL}/third-parties/abort`,
    params
  );
};

export const prefixDataBeforeSSE = (params) => {
  return http.post(
    `${process.env.REACT_APP_ROUTER_BASE_URL}/third-parties/prefix-data-before-sse`,
    params
  );
};