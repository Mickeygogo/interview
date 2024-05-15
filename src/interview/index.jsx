/*
 * @Author: Mcikey
 * @Date: 2024-05-14 17:18:28
 * @LastEditors: hyman
 * @LastEditTime: 2024-05-14 17:57:55
 * @Description: 请填写简介
 */
import React from 'react';
import AllChatContent from './all-chat-content'
import FileInfo from './file-info';
  import  PersonImgInfo from './person-img-info'
import styles from './index.module.css'

export default function Interview() {
  return (
    <div className={styles.content}>
    <div className={styles.container}>
        <div className={styles.left}>
            <PersonImgInfo/>
            <FileInfo/>
        </div>
        <div className={styles.right}><AllChatContent/></div>
    </div>
    </div>

  )
}
