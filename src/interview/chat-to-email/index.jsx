import { useState, useContext } from 'react';
import { Input, Button, Alert } from 'antd';
import { emailToAuthor } from '../../api';
import { ChatContext } from '../context';
import {
    getCurrentUrlInterviewId,
} from '../all-chat-content/utils';
import styles from './index.module.css';

const { TextArea } = Input;

export default function ChatToEmail() {
    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')

    const data = useContext(ChatContext)
    const { interviewTag } = data || {};

    const interviewId = getCurrentUrlInterviewId();
    const onChange = (e) => {
        setText(e.target.value)
    }

    const handleClick = async () => {
        if (!text) return;
        setLoading(true)
        try {
            const res = await emailToAuthor({ interviewId, text, tag: interviewTag });
            setLoading(false)
            if (res.data.code === 200) {
                setText('')
            }
        } catch (error) {
            setLoading(false)
        }
    }

    return (
        <div>
            <Alert
                message="感谢您的联系，我会在收到消息及时回复您"
                type="warning"
                showIcon
                style={{ marginBottom: 10 }}
            />
            <Alert
                message="同时为了防止恶刷，目前只允许发送3条Email，如果有更多问题，劳烦您在对话中询问我的联系方式"
                type="warning"
                showIcon
                style={{ marginBottom: 10 }}
            />

            <TextArea
                value={text}
                // showCount
                // maxLength={100}
                onChange={onChange}
                placeholder="请输入"
                style={{ height: 120, resize: 'none' }}
            />
            <Button onClick={handleClick} className={styles.btn} type='primary' loading={loading} style={{ backgroundColor: '#997b66' }}>发送</Button>
        </div>
    )
}
