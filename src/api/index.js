import http from './httpWrapper';

// TODO
// export const chatKnowledgeSSEPath = `${
//   import.meta.env.VITE_APP_API_BASE_URL
// }/third-parties/chat-knowledge`;

console.log(process.env, 'process.env');

export const chatKnowledgeSSEPath = `${process.env.REACT_APP_API_BASE_URL}/third-parties/chat-knowledge`;

export const queryInterviewInfo = (params, config) => {
  return http.post(`${process.env.REACT_APP_API_BASE_URL}/no-auth/query-interview-info`, params, config);
};


export const abortChatKnowledge = (params) => {
  return http.get(
    `${process.env.REACT_APP_API_BASE_URL}/third-parties/abort`,
    params
  );
};

export const prefixDataBeforeSSE = (params) => {
  return http.post(
    `${process.env.REACT_APP_API_BASE_URL}/third-parties/prefix-data-before-sse`,
    params
  );
};
export const emailToAuthor = (params, config) => {
  return http.post(`${process.env.REACT_APP_API_BASE_URL}/no-auth/email-to-author`, params, config);
};
