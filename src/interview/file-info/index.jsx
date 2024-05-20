import { useState,useContext  } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Popover } from 'antd';
import {
    FileTextFilled,
} from '@ant-design/icons';
import { ChatContext } from '../context';
import ListDetail from './list-detail';
import styles from './index.module.css';


export default function FileInfo() {

    const data = useContext(ChatContext)
    const { sortKnowledgeDetail  } = data || {};
    const dataSource = sortKnowledgeDetail?.map(i=>({ ...i, id: uuidV4()}))

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
           requestAnimationFrame(()=>{
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
                            <div >
                                <Popover
                                    content={<ListDetail dataSource={i?.content}/>}
                                    title={`${i?.knowledgeName}内容`}
                                    trigger="click"
                                    onVisibleChange={(visible) => handlePopoverVisibleChange(visible, i.id)}
                                //   open={open}
                                //   onOpenChange={handleOpenChange}
                                >
                                    <img id={i.id} key={i.id} src={require('../../file-close.png')} style={{ width: 80 }} onClick={handleClick.bind(this, i.id)} />
                                </Popover>

                               <div className={styles.contentText}>
                                <div>{i.knowledgeName}</div>
                                 <div>条数：{i.knowledgeNum}</div>
                               </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
