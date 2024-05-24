/*
 * @Author: Mcikey
 * @Date: 2024-05-14 17:18:28
 * @LastEditors: hyman
 * @LastEditTime: 2024-05-14 17:57:55
 * @Description: 请填写简介
 */
import { useEffect, useState, useMemo } from 'react';
import { Popover, FloatButton } from 'antd';
import AllChatContent from './all-chat-content'
import FileInfo from './file-info';
import PersonImgInfo from './person-img-info';
import {
  getCurrentUrlInterviewId,
} from './all-chat-content/utils';
import {
  queryInterviewInfo,
} from '../api';
import BaseInfo from './base-info';
import { ChatContext } from './context';
import ChatToEmail from './chat-to-email'
import {

  WechatOutlined,
} from '@ant-design/icons';
import styles from './index.module.css'

const Interview = () => {
  const interviewId = getCurrentUrlInterviewId();

  const [data, setData] = useState()

  useEffect(() => {
    queryInterviewInfo({ interviewId }).then(res => {
      setData(res.data.data)
    })
  }, [interviewId])

  const value = useMemo(() => {
    return data
  }, [data])



  return (
    <ChatContext.Provider value={value}>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.left}>
            <PersonImgInfo />
            <BaseInfo/>
            <FileInfo />
          </div>
          <div className={styles.right}></div>

          <AllChatContent />
        </div>
      </div>
      <Popover
              placement="leftTop"
              content={<ChatToEmail/>}
              title="Email To Author"
              trigger="click"
            >
              <FloatButton
                shape="circle"

                icon={<WechatOutlined style={{ backgroundColor:'#997b66' }}/>}
                // description={open ? '' : selectCarrierMagnification}
                type="primary"
                style={{ bottom: 100, backgroundColor:'#997b66' }}
              />
            </Popover>
    </ChatContext.Provider>
  )
}
export default Interview;