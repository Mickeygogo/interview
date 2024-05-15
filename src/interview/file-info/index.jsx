import { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { Popover } from 'antd';
import {
    FileTextFilled,
} from '@ant-design/icons';
import styles from './index.module.css';

const dataSource = [
    {
        id: 11,
        knowledgeName: '运去哪官网',
        knowledgeNum: 20
    },
    {
        id: 22,
        knowledgeName: '运去哪官网1',
        knowledgeNum: 20
    },
    {
        id: 33,
        knowledgeName: '运去哪官网3',
        knowledgeNum: 20
    },

    {
        id: 44,
        knowledgeName: '运去哪官网2',
        knowledgeNum: 20
    },
    {
        id: 55,
        knowledgeName: '运去哪官网43',
        knowledgeNum: 20
    },
    {
        id: 66,
        knowledgeName: '运去哪官网43',
        knowledgeNum: 20
    },
    {
        id: 77,
        knowledgeName: '运去哪官网43',
        knowledgeNum: 20
    },
    {
        id: 88,
        knowledgeName: '运去哪官网3',
        knowledgeNum: 20
    },
    {
        id: 99,
        knowledgeName: '运去哪官网32',
        knowledgeNum: 20
    },
]
export default function FileInfo() {


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
            imageElement.style.width = '86px'; // 修改宽度
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
                                    content={<a >Close</a>}
                                    title="Title"
                                    trigger="click"
                                    onVisibleChange={(visible) => handlePopoverVisibleChange(visible, i.id)}
                                //   open={open}
                                //   onOpenChange={handleOpenChange}
                                >
                                    <img id={i.id} src={require('../../file-close.png')} style={{ width: 80 }} onClick={handleClick.bind(this, i.id)} />
                                </Popover>

                                <div>{i.knowledgeName}</div>
                                <div>{i.knowledgeNum}</div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}
