import { isEmpty } from 'lodash-es';

export const useChatConfig = () => {
  const getChatConfig = ({
    globalLLMConfig,
    currentLLMConfig,
    defaultConfig,
  }) => {

    if (!isEmpty(globalLLMConfig)) {
      // TODO 全局回话配置
      const {
        historyValue,
        tokenValue,
        // 知识库模型
        // knowledgeLLM,
        // 知识库参考数据量
        knowledgeNum,
        // 知识库数据
        // knowledgeArr,
        role,
        ttsRole,
        tts_model,
        temperatureState,
      } = globalLLMConfig || {};

      return {
        max_tokens: tokenValue,
        historyChatNum: historyValue,
        role,
        temperature: temperatureState,
        tts_role: ttsRole,
        tts_model: tts_model,
        knowledgeNum,
      };
    } else {
      if (currentLLMConfig?.config) {
        const {
          historyValue,
          tokenValue,
          // 知识库模型
          // knowledgeLLM,
          // 知识库参考数据量
          knowledgeNum,
          // 知识库数据
          // knowledgeArr,
          role,
          ttsRole,
          tts_model,
          temperatureState,
        } = currentLLMConfig?.config || {};

        return {
          max_tokens: tokenValue,
          historyChatNum: historyValue,
          role,
          temperature: temperatureState,
          tts_role: ttsRole,
          tts_model: tts_model,
          knowledgeNum,
        };
      }
    }

    return {
      ...defaultConfig,
    };
  };

  return [getChatConfig];
};
