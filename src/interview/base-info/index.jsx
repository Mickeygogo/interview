import { useContext, useMemo } from 'react';
import { Tag } from 'antd';
import { ChatContext } from '../context';
import { SubTitle } from '../sub-title';
import styles from './index.module.css';

export default function BaseInfo() {
    const data = useContext(ChatContext);
    const { baseInfoJSON } = data || {};

    const parseBaseInfo = useMemo(() => {

        let keyValuePairs  = [];
        // 步骤 1: 使用逗号分割文本
        keyValuePairs = baseInfoJSON?.split?.('；');
        try {
            // 步骤 2: 将每个键值对转换成对象
            let dataArray = keyValuePairs?.map?.(pair => {
                let [key, value] = pair.split('：');
                return { label: key?.trim(), value: value?.trim() }; // 创建对象，并确保去除额外的空格
            });
            console.log(dataArray);
            return dataArray;
        } catch (error) {
            console.error('JSON 解析失败:', error);
            return []
        }
    }, [baseInfoJSON])


    return (
        <div className={styles.container}>

            <SubTitle title="基本信息" />
            <div className={styles.baseInfo}>
                {
                    parseBaseInfo?.map?.((i, index)=>{
                        return (
                            <div key={index}>
                               <Tag color='#997b66'>{i.label}</Tag> : {i.value}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
