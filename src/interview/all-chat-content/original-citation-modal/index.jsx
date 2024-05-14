/*
 * @Author: Mcikey
 * @Date: 2023-11-03 15:29:07
 * @LastEditors: hyman
 * @LastEditTime: 2023-11-06 14:47:00
 * @Description: 请填写简介
 */
import {
  forwardRef,
  useState,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Modal, List, Tag, Spin, Input, Button, notification } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
// import { feedbackDocument } from 'Api';

import styles from './index.module.css';

const { TextArea } = Input;

const OriginalCitationModal = forwardRef(({}, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpenFeedbackArr, setOpenFeedbackArr] = useState([]);
  const feedbackValueRef = useRef([]);
  const [api, contextHolder] = notification.useNotification();

  console.log(data, 'data');

  useImperativeHandle(
    ref,
    () => ({
      open: (data) => {
        let currentData = data;
        currentData?.sort((a, b) => b.score - a.score);
        setData(currentData);
        setOpen(true);
      },
      close: handleClose,
    }),
    []
  );

  const handleClose = () => {
    setOpen(false);
    setOpenFeedbackArr([]);
  };

  // const handleFeedBack = async (data, index) => {
  //   const { documentUuid } = data || {};

  //   if (!feedbackValueRef.current[index]) {
  //     api.error({
  //       message: '反馈失败',
  //       description: `请填写反馈内容`,
  //       placement: 'topLeft',
  //     });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const res = await feedbackDocument({
  //       documentUuid,
  //       text: feedbackValueRef.current[index],
  //     });

  //     if (res.data.code === 200) {
  //       api.success({
  //         message: res.data.msg,
  //         description: `反馈内容：${feedbackValueRef.current[index]}`,
  //         placement: 'topLeft',
  //       });
  //     }

  //     setOpenFeedbackArr((prev) => {
  //       const newData = [...prev];
  //       newData[index] = !newData[index];
  //       return newData;
  //     });
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  const handleFeedbackChange = (index, e) => {
    feedbackValueRef.current[index] = e.target.value;
  };

  const renderListItem = (item, index) => {
    return (
      <List.Item className={styles.renderListItemStyle}>
        <div className={styles.renderListItemStyleContent}>
          <div className={styles.content}>
            <Tag className={styles.tag} color="#f56a00">
              相似度: {item.score}
            </Tag>
            <div className={styles.row}>
              {' '}
              <div className={styles.title}>问题: </div>
              <div className={styles.value}>{item?.question}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.title}>答案: </div>{' '}
              <div
                className={styles.value}
                dangerouslySetInnerHTML={{ __html: item?.answer }}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.title}>来源: </div>
              <div className={styles.value}>{item?.source}</div>
            </div>
          </div>
          <a
            className={styles.feedbackProblem}
            onClick={() => {
              setOpenFeedbackArr((prev) => {
                const newData = [...prev];
                newData[index] = !newData[index];
                return newData;
              });
            }}
          >
            <MessageOutlined style={{ fontSize: 22 }} />
            <span>反馈</span>
          </a>
        </div>
        {/* {isOpenFeedbackArr[index] && (
          <div className={styles.feedbackTextarea}>
            <TextArea
              onChange={handleFeedbackChange.bind(this, index)}
              placeholder="反馈此条文档的问题"
              autoSize={{
                minRows: 5,
                maxRows: 5,
              }}
            />
            <Button
              type="primary"
              className={styles.btn}
              onClick={handleFeedBack.bind(this, item, index)}
              loading={loading}
            >
              确认提交
            </Button>
          </div>
        )} */}
      </List.Item>
    );
  };

  return (
    <Modal
      title="原文引用"
      open={open}
      onCancel={handleClose}
      width="70%" // 自适应图片宽度，您可以设置为其他值如'80%'等
      height="auto" // 自适应图片高度
      footer={null}
      closable={false}
    >
      {contextHolder}
      <div className={styles.scrollListFile}>
        <List
          size="large"
          bordered
          dataSource={data}
          renderItem={renderListItem}
        />
      </div>
    </Modal>
  );
});

export default OriginalCitationModal;
