import { unified } from 'unified';
import stringify from 'remark-stringify';
import parse from 'remark-parse';
import { visit } from 'unist-util-visit';

function preprocessString(str) {
  return str?.replace(/\\\"/g, '"')?.replace(/\\\\/g, '\\');
}

// 处理复制文本的信息
export function convertMarkdownToVoiceFriendlyText(markdownContent) {
  let result = '';

  // 预处理字符串
  const preprocessedMarkdownContent = preprocessString(markdownContent);

  const processor = unified().use(parse).use(stringify);

  const tree = processor.parse(preprocessedMarkdownContent);

  visit(tree, (node) => {
    if (node.type === 'text' || node.type === 'html') {
      // 使用正则表达式匹配图片标签
      const imgRegex = /<img\s+[^>]*src=\\[^>]*>/g;
      const iframeRegex = /<iframe[^>]*><\/iframe>/g;
      const olRegex = /<ol>[\s\S]*?<\/ol>/g;
      const liRegex = /<li>(.*?)<\/li>/g;

      let replacedValue = node.value;

      if (imgRegex.test(node.value)) {
        replacedValue = replacedValue.replace(imgRegex, '如图所示');
      }

      if (iframeRegex.test(node.value)) {
        replacedValue = replacedValue.replace(iframeRegex, '如视频所示');
      }

      if (olRegex.test(node.value)) {
        const listItems = node.value.match(liRegex);
        if (listItems) {
          const convertedList = listItems
            .map((item) => item.replace(liRegex, '$1'))
            .join(', ');
          replacedValue = replacedValue.replace(
            olRegex,
            `列表包括：${convertedList}`
          );
        }
      }

      result += replacedValue + ' ';
    }
  });

  return result.trim();
}

// 查询问题时的加载
export const prefix = `
<div style="width: 100%; text-align: center;">
  <img src="https://wimg.588ku.com/gif620/21/03/20/dd927f59d06392c3cc56cb2354f00934.gif" style="width: 50px; height: 50px; margin-top:10px; padding:0;" />
</div>`;

// 上传图片的允许类型
export const ImageType = ['jpg', 'png', 'jpeg', 'webp', 'image'];

// 获取全局配置的数据
export const getGlobalConfig = () => {
  const globalLLMConfig = localStorage.getItem('global-llm-config') || '{}';
  if (
    !globalLLMConfig ||
    globalLLMConfig === '{}' ||
    globalLLMConfig === 'undefined' ||
    globalLLMConfig === 'null'
  ) {
    return null;
  }

  const globalLLMConfigParse = globalLLMConfig
    ? JSON.parse(globalLLMConfig)
    : null;

  return globalLLMConfigParse;
};

export const chatLabelTip = {
  GPTS: '请先选择需要对话的gpts',
  GPT: '请先选择需要对话的模型',
  KNOWLEDGE: '请先选择参与知识库对话的模型',
};


export const getCurrentUrlShareId = () => {
  const currentUrl = window.location.href;
  const urlObject = new URL(currentUrl);
  const params = new URLSearchParams(urlObject.search);
  const shareId = params.get('shareId');
  return shareId;
};
