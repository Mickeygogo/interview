/*
 * @Author: Mcikey
 * @Date: 2023-08-02 14:10:16
 * @LastEditors: hyman
 * @LastEditTime: 2024-05-14 13:59:53
 * @Description: 请填写简介
 */
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  useContext
} from 'react';
import OriginalCitationModal from './original-citation-modal';
import {
  List,
  Avatar,
  Modal,
  Watermark,
  message,
  Dropdown,
} from 'antd';
import { cloneDeep } from 'lodash-es';
import { v4 as uuidV4 } from 'uuid';
import dayjs from 'dayjs';
import {
  MoreOutlined,
} from '@ant-design/icons';
import {Send } from './send';
import RenderContent from './render-content';

import { ChatContext } from '../context';
import {
  abortChatKnowledge,
  chatKnowledgeSSEPath,
  queryInterviewInfo,
  prefixDataBeforeSSE,
} from '../../api';
// import CurrentChatUsage from './current-chat-usage';
import {
  convertMarkdownToVoiceFriendlyText,
  prefix,
} from './utils';
import styles from './index.module.css';



const AllChatContent = () => {
  const [loading, setLoading] = useState(false);
  const chatContentRef = useRef();
  const chatListRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const data = useContext(ChatContext)
  const { interviewTitle, useModel } = data || {};
  console.log(data, 'data');

  const inputTextRef = useRef({});
  // streamId
  const streamIdRef = useRef(uuidV4());
  // 当前聊天费用
  const currentChatUsage = useRef();
  // 知识库来源信息
  const currentKnowledgeSource = useRef();
  // 取消播放
  const lastScrollHeight = useRef(0); // 用于保存上一次的scrollHeight
  // 获取sse传过来的旧值
  const prevSSEMessage = useRef();
  const originalCitationModalRef = useRef();
  // 追踪当前的 EventSource 连接
  const eventSourceRef = useRef(null);
  // 当前gpts数据
  const currentGpts = useRef('');
  // files
  const uploadFiles = useRef({
    path: '',
    callback: () => {},
  });

  useEffect(() => {
    // todo 获取历史聊天记录
    const storedConversations = sessionStorage.getItem('interview-conversations');
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
  }, []);

  useEffect(() => {
      if(conversations?.length === 0 && data){
        setConversations([ {
          id: uuidV4(),
          copyText:data?.startText,
          isRunning: true,
          voiceText:data?.startText,
          role: 'assistant',
          content:data?.startText,
          isAssistant: true,
         },])
      } else {
        setConversations([])
      }
    // }).catch(err=>{
    //   setConversations([])
    // })
  }, [data])

  const handleOpenKnowledgeSource = (data) => {
    originalCitationModalRef.current.open(data);
  };

  const startSSE = useCallback(() => {
    // 关闭任何现有的连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    // TODO要转码下，不然问1+1 显示的是 1 1 因为经过url + 号被识别成空格了
    // const enPrompt = encodeURIComponent(prompt);

    eventSourceRef.current = new EventSource(
      chatKnowledgeSSEPath +
        // `?prompt=${'你好啊'}` +
        `?model=${data?.useModel?.value}` +
        `&historyNum=${0}` +
        `&streamId=${streamIdRef.current}&type=Gpts&apiKey=${data?.apiKeyVo?.key}`,
      {
        // 携带cookie
        withCredentials: true,
      }
    );

    let lastAssistantMessageId = null;
    let messageBuffer = '';
    eventSourceRef.current.onmessage = function (event) {
      const messageContent = event.data;
      if (messageContent === 'undefined') {
        return;
      }

      if (messageContent.includes('[CHAT_USAGE]')) {
        if (messageContent?.split('-¥¥¥&$$$-')?.[1]) {
          currentChatUsage.current = JSON.parse(
            messageContent?.split('-¥¥¥&$$$-')?.[1]
          );
        } else {
          currentChatUsage.current = undefined;
        }
        return;
      }

      if (messageContent.includes('[OriginalCitation]')) {
        if (messageContent?.split('-¥¥¥&$$$-')?.[1] &&  messageContent?.split('-¥¥¥&$$$-')?.[1] !== 'undefined') {
          currentKnowledgeSource.current = JSON.parse(
            messageContent?.split('-¥¥¥&$$$-')?.[1]
          );
        } else {
          currentKnowledgeSource.current = undefined;
        }

        return;
      }

      if (messageContent === '[DONE]') {

        let currentId = lastAssistantMessageId;
        let clearText = chatContentRef.current;
        let knowledgeSource = currentKnowledgeSource.current;

        console.log(knowledgeSource, 'knowledgeSource');

        const formatContent = convertMarkdownToVoiceFriendlyText(clearText);
        //todo 暂时不支持语音播放
      // chatContentRef.current && getAudioInfo(formatContent);
        setConversations((prevConversations) => {
          const newPrevConversations = cloneDeep(prevConversations);
          newPrevConversations.forEach((item) => {
            if (item.id === currentId) {
              item.copyText = formatContent; // 修改name字段为'
              item.isRunning = true;
              item.voiceText = formatContent;
              item.knowledgeSource = knowledgeSource;
            }
          });

          return newPrevConversations;
        });
        setLoading(false);
        chatContentRef.current = '';
        messageBuffer = '';
        eventSourceRef.current.close();

      } else if ( !prevSSEMessage.current && (messageContent !== '[DONE]' || messageContent !== 'undefined') ) {
        messageBuffer+=  messageContent
        .replace(/""/g, '"')
        .slice(1, -1);
        setConversations((prevConversations) => {

          const updatedConversations =cloneDeep(prevConversations);
          const lastMessage =
            updatedConversations[updatedConversations.length - 1];
            console.log(messageContent,'lastMessage外')

          // 如果最后一条消息是assistant的消息，更新它
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = messageBuffer;
            lastAssistantMessageId = lastMessage.id;
            console.log(messageBuffer, 'messageBuffer')
            chatContentRef.current = lastMessage.content;
          } else {
            // 否则，添加一个新的消息
            lastAssistantMessageId = uuidV4();
            updatedConversations.push({
              id: lastAssistantMessageId,
              role: 'assistant',
              content:messageContent
              .replace(/""/g, '"')
              .slice(1, -1),
            });
          }

          return updatedConversations;
        });
      }
    };

    eventSourceRef.current.onerror = function (event) {
      const data = event.data ? JSON.parse(event.data) : null;
      // message.error(data.message);
      // if (data) {
      //   // setTimeout(() => {
      //   //   message.error(data.message);
      //   // }, 1000);
      //   requestAnimationFrame(() => {
      //     message.error(data.message);
      //   });
      // } else {
      //   requestAnimationFrame(() => {
      //     alert('请求报错');
      //   });
      // }

      setConversations((prevConversations) => {
        const copy = [...prevConversations];
        if (copy?.[copy?.length - 1]?.role === 'assistant') {
          copy.pop();
        }
        return copy;
      });
      setLoading(false);
      eventSourceRef.current.close();
    };

    return () => eventSourceRef.current.close();
  }, [data?.apiKeyVo?.key, data?.useModel?.value]);

  const handleSend = useCallback(
    (message) => {
      setLoading(true);
      // 每次发送消息后，重新启动一个新的 EventSource 连接
      console.log(uploadFiles.current.file, '文件有数据');
      const newMessage = message;

      setConversations((prevConversations) => {

        console.log(newMessage, 'newMessage');
        const newArr = [
          ...prevConversations,
          {
            id: uuidV4(),
            role: 'user',
            content: newMessage,
            copyText: newMessage,
            createAt: new Date(),
          },
          {
            id: uuidV4(),
            role: 'assistant',
            content: prefix,
            copyText: '',
            createAt: new Date(),
            gpts: currentGpts.current,
          },
        ];

        return newArr;
      });


      const newConversations = [
        ...conversations.slice(-2),
        {
          role: 'user',
          content: newMessage,
        },
      ]?.map((i) => ({ role: i.role, content: i.content }));


      prefixDataBeforeSSE({
        message: newConversations?.length
          ? newConversations
          : [
              {
                role: 'user',
                content: newMessage,
              },
            ],
          knowledgeUuidArr:data?.callKnowledge?.map(i=>i?.key?.split('-')[0]),
          knowledgeNum:2,
          temperature:0.1,
          max_tokens:1024,
      }).then(() => {
        startSSE();
      });
    },
    [conversations, data?.callKnowledge, startSSE]
  );

  const handleSearch = (value) => {
    if (inputTextRef.current) {
      inputTextRef.current.value = value;
    } else {
      inputTextRef.current = {};
      inputTextRef.current.value = value;
    }
  };

  useEffect(() => {
    const element = chatListRef.current;
    if (element) {
      // 只有当当前的scrollHeight大于上一次保存的scrollHeight时，才执行滚动
      if (element.scrollHeight > lastScrollHeight.current) {
        element.scrollTop = element.scrollHeight;
      }
      // 更新lastScrollHeight为当前的scrollHeight
      lastScrollHeight.current = element.scrollHeight;
    }
  }, [conversations]);

  const handleEnter = () => {
    if (!inputTextRef.current.value) {
      return;
    }

    handleSend(inputTextRef.current.value);

    if (inputTextRef.current) {
      inputTextRef.current.value = '';
    }
  };

  const handleDelete = useCallback(
    (id) => {
      // 过滤掉与这个ID匹配的对话
      const filteredConversations = conversations.filter(
        (conv) => conv.id !== id
      );
      setConversations(filteredConversations);
    },
    [conversations]
  );


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAgainSearch = (text) => {
    handleSend(text);
  };

  const handleCopy = (text) => {
    if (navigator.clipboard) {
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
    } else {
      // 备用方案，使用 document.execCommand('copy')
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        message.success('已复制文本: ' + text);
      } catch (err) {
        message.error('复制失败');
      }
      document.body.removeChild(textarea);
    }
  };

  const aiItem = useCallback(
    (item) => [
      {
        key: '0',
        label: (
          <div onClick={handleDelete.bind(this, item.id)} type="link">
            删除词条
          </div>
        ),
      },
      {
        key: '1',
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        label: <a onClick={handleCopy.bind(this, item.copyText)}>复制词条</a>,
        disabled: !item.isRunning,
      },
      {
        key: '2',
        label: (
          <a
            onClick={handleOpenKnowledgeSource.bind(this, item.knowledgeSource)}
          >
            原文引用｜反馈问题
          </a>
        ),
        disabled: !item.isRunning,
      },
    ],
    [handleDelete]
  );
  const userItem = useCallback(
    (item) => [
      {
        key: '0',
        label: <div onClick={handleDelete.bind(this, item.id)}>删除词条</div>,
        disabled: loading,
      },
      {
        key: '1',
        label: (
          <div onClick={handleAgainSearch.bind(this, item.content)}>
            再次询问
          </div>
        ),
        disabled: loading,
      },
      {
        key: '2',
        label: (
          <div onClick={handleCopy.bind(this, item.copyText)}>复制词条</div>
        ),
        disabled: loading,
      },

    ],
    [handleAgainSearch, handleDelete, loading]
  );


  // 渲染元素
  const renderChatNode = useCallback(
    (item) => {
      console.log('触发了');
      return (
        <div
          className={
            item.role === 'user' ? styles.assistantMessage : styles.userMessage
          }
        >
          <div className={styles.messageContentWrapper}>
            {item.role === 'user' ? (
              <Avatar
                className={styles.avatar}
              >YOU</Avatar>
            ) : (
              <Avatar className={styles.avatar} src='//wimg.588ku.com/gif620/21/01/03/0b98c83450ae48de1c60a4a3bdac59ea.gif'></Avatar>
            )}
            <div className={styles.contentWrapper}>
              <div className={styles.titleInfo}>
                {dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss')}
                {item.role !== 'user' && (
                  <span style={{ marginLeft: '10px' }}>
                    {item?.gpts?.title}
                  </span>
                )}
              </div>
              {item.role !== 'user' ? (
                !item?.isAssistant && (
                  <div className={styles.assistantButton}>
                    <Dropdown menu={{ items: aiItem(item) }}>
                      <MoreOutlined />
                    </Dropdown>
                  </div>
                )
              ) : (
                <div className={styles.userButton}>
                  <Dropdown menu={{ items: userItem(item) }}>
                    <MoreOutlined />
                  </Dropdown>
                </div>
              )}
              <div className={styles.messageContent}>

                <Watermark
                  content={useModel.value}
                  rotate={4}
                  font={{ color: 'rgba(0,0,0,.1)', fontSize: 14 }}
                >
                  <RenderContent
                  type={item.role}
                    content={item.content}
                    onClick={(e) => {
                      if (e.target.tagName === 'IMG') {
                        setCurrentImage(e.target.src);
                        setLightboxOpen(true);
                      }
                    }}
                  />
                </Watermark>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [aiItem, userItem]
  );

  const renderTitle = useMemo(() => {
    return interviewTitle
  }, [interviewTitle]);

  return (
    <div className={styles.container} id="all-chat-content-modal-id" >
        <div className={styles.projectLogo}>
        {renderTitle}
      </div>
      {/* <div className={styles.projectLogo}>{renderTitle}</div> */}
      <div
        className={styles.aiContainer}
        id="aiContainer"
        ref={chatListRef}
      >
        <List dataSource={conversations} renderItem={renderChatNode} />
      </div>
      <div className={styles.search}>
        <Send
                placeholder="同时按下enter&shift可进行换行 / 单点enter发送"
                allowClear
                className={styles.searchSend}
                enterButton="发送"
                size="large"
                needUpload={false}
                loading={loading}
                onSearch={handleEnter}
                onAbort={async () => {
                  try {
                    await abortChatKnowledge({ streamId: streamIdRef.current });
                    // eventSourceRef.current.close();
                    setLoading(false);
                  } catch (err) {
                    console.log(err, 'err');
                    eventSourceRef.current?.close();
                    setLoading(false);
                  }
                }}
                onChange={handleSearch}
        />
      </div>
      <Modal
        open={isLightboxOpen}
        onCancel={() => setLightboxOpen(false)}
        width="40%" // 自适应图片宽度，您可以设置为其他值如'80%'等
        height="auto" // 自适应图片高度
        footer={null}
        closable={false}
      >
        <img src={currentImage} style={{ width: '100%', display: 'block' }} />
      </Modal>
      <OriginalCitationModal ref={originalCitationModalRef} />
    </div>
  );
};
export default AllChatContent;
