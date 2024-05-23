/*
 * @Author: Mcikey
 * @Date: 2024-05-14 20:03:03
 * @LastEditors: hyman
 * @LastEditTime: 2024-05-23 10:30:21
 * @Description: 请填写简介
 */
import { useState, useContext } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Popover, Tag } from 'antd';
import {
    FileTextFilled,
} from '@ant-design/icons';
import { ChatContext } from '../context';
import ListDetail from './list-detail';
import styles from './index.module.css';


export default function FileInfo() {

    const data = useContext(ChatContext)
    const { sortKnowledgeDetail } = data || {};
    const dataSource = sortKnowledgeDetail?.map(i => ({ ...i, id: uuidV4() }))

    const handleCloseOther = (id) => {
        const otherDom = dataSource?.filter(i => i?.id !== id)
        otherDom?.forEach(key => {
            const imageElement = document.getElementById(key.id);
            imageElement.src = require('../../file-close.png')
            imageElement.style.width = '80px'; // 修改宽度
        })
    }

    const handleClick = (id) => {
        handleCloseOther(id);
        const imageElement = document.getElementById(id);
        const image1 = require('../../file.png');
        if (imageElement.src.includes(image1)) {
            imageElement.src = require('../../file-close.png')
            imageElement.style.width = '80px'; // 修改宽度
        } else {
            imageElement.src = image1
            imageElement.style.width = '85.5px'; // 修改宽度
        }

    }

    const handlePopoverVisibleChange = (visible, id) => {
        if (!visible) {
            requestAnimationFrame(() => {
                const imageElement = document.getElementById(id);
                imageElement.src = require('../../file-close.png')
                imageElement.style.width = '80px'; // 修改宽度
            })
        }
    }


    return (
        <div className={styles.container}>
            <div className={styles.containerFile}>
                {
                    dataSource?.map(i => {
                        return (
                            <div  key={i.id}>
                                <Popover
                                    content={<ListDetail dataSource={i?.content} />}
                                    title={`${i?.knowledgeName}内容 (${i.knowledgeNum})条`}
                                    trigger="click"
                                    onVisibleChange={(visible) => handlePopoverVisibleChange(visible, i.id)}
                                //   open={open}
                                //   onOpenChange={handleOpenChange}
                                >
                                    <div className={styles.imgWrapper}  style={{ width: 80 }}  onClick={handleClick.bind(this, i.id)}>
                                        <img id={i.id} key={i.id} src={require('../../file-close.png')} style={{ width: 80 }}  />
                                        <div className={styles.contentText}>
                                        <Tag color='#997b66' style={{ marginRight:0 , fontSize:12, maxWidth:80}}> {i.knowledgeName || '-'}</Tag>
                                        </div>
                                    </div>
                                </Popover>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
