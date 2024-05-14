import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { Button, message } from 'antd';
import { CopyTwoTone } from '@ant-design/icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './index.module.css';
import { prefix } from '../utils';
import remarkGfm from 'remark-gfm';
// import remarkMath from 'remark-math';
// import rehypeRaw from 'rehype-raw';

function isHTML(content) {
  // 检查内容是否以 < 开头并且包含 >
  return content?.trim().startsWith('<') && content.includes('>');
}

const RenderContent = ({ content, onClick, type }) => {
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        /* 提示已复制 */
        message.success('已复制文本: ' + text);
      })
      .catch(function () {
        /* 复制失败 */
        message.error('复制失败');
      });
  };
  const renderNode = useMemo(() => {
    // TODO 规定所有的用户输入都是markdown格式，
    let HTML;
    let cleanContent;
    if (type === 'user') {
      HTML = false;
    } else {
      if (prefix === content) {
        HTML = true;
      } else {
        HTML = isHTML(content);
      }
      // 安全地清理内容
      cleanContent = !HTML ? DOMPurify.sanitize(content) : content;
    }

    // const md = new MarkdownIt();
    // const renderedContent = md.render(cleanContent);

    // 检查渲染后的内容是否与原始内容不同
    // const isMarkdown = renderedContent.trim() !== cleanContent.trim();

    // console.log(
    //   renderedContent.trim(),
    //   content.trim(),
    //   isMarkdown,
    //   'renderedContent'
    // );

    // const isHTML = /<([a-z]+)\b[^>]*>(.*?)<\/\1>/i.test(content);

    // const isHTML = /<([a-z]+)\b[^>]*(\/>|>(.*?)<\/\1>)/i.test(content);

    // const isHTML = /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/i.test(content);


    if (HTML) {
      // 确保<img>标签的src属性是由双引号包围的
      cleanContent = cleanContent.replace(/&quot;/g, '');
      cleanContent = cleanContent.replace(/\\n/g, '');
      // cleanContent = cleanContent.replace(/\\n/g, '<br/>');
      cleanContent = cleanContent.replace(/\\/g, '');
      // 删除末尾的%22
      cleanContent = cleanContent.replace(/%22$/, '');
      // 把p标签换成div,因为p标签有样式
      cleanContent = cleanContent.replace(/<p>/g, '<div>');
      cleanContent = cleanContent.replace(/<\/p>/g, '</div>');
      cleanContent = cleanContent.replace(
        /<img src=([^">]+)">/g,
        '<img src="$1"/>'
      );

      return (
        <div
          dangerouslySetInnerHTML={{
            __html: cleanContent,
          }}
          className={styles.contentStyle}
          onClick={onClick}
        />
      );
    } else {
      // 处理转义字符
      let processedContent = content
        .replace(/\\`\\`\\`/g, '```')
        .replace(/\\t/g, '\t')
        .replace(/\\n/g, '\n')
        .replace(/\\/g, '"')
        .replace(/""/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&'); // 添加这一行

      return (
        <ReactMarkdown
          className="markDownWrapper"
          children={processedContent}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <>
                  <SyntaxHighlighter
                    children={String(children)}
                    style={materialDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  />

                  <Button
                    className={styles.copyBtn}
                    onClick={handleCopy.bind(this, children)}
                  >
                    <div className={styles.copyText}>
                      <CopyTwoTone style={{ fontSize: 18 }} />
                      <span>copy</span>
                    </div>
                  </Button>
                </>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        />
      );
    }
  }, [content, onClick, type]);

  return renderNode;
};

export default RenderContent;
