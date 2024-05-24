/*
 * @Author: Mcikey
 * @Date: 2023-12-08 13:47:51
 * @LastEditors: hyman
 * @LastEditTime: 2024-03-31 19:37:54
 * @Description: 请填写简介
 */
import { useState, useCallback, useEffect, useRef} from 'react';
import classnames from 'classnames';
import { Input, Button, Image, message, Tooltip, Spin } from 'antd';
import {
  AudioFilled,
  UpCircleFilled,
  PlusCircleFilled,
  StopOutlined,
  CloseCircleFilled,
} from '@ant-design/icons';
import styles from './index.module.css';



const { TextArea } = Input;

export function Send({
  inputRef,
  loading,
  // value,
  placeholder,
  onChange,
  onSearch,
  className,
  needUpload,
  updateClick,
  needSpeakTalk,
  speakTalkClick,
  onAbort,
  onUpload,
  onDeleteFiles,
  filesLimitNum = 6,
  ...restProps
}) {
  // const [isLoading, setLoading] = useState(false);

  const [value, setValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const baseInputRef = useRef(null);

  useEffect(() => {
    const handleCompositionStart = () => {
      setIsComposing(true);
    };

    const handleCompositionEnd = () => {
      setIsComposing(false);
    };

    const inputElement = baseInputRef.current?.resizableTextArea?.textArea;
    if (inputElement) {
      inputElement?.addEventListener?.('compositionstart', handleCompositionStart);
      inputElement?.addEventListener?.('compositionend', handleCompositionEnd);
    }

    return () => {
      if (inputElement) {
        inputElement?.removeEventListener?.('compositionstart', handleCompositionStart);
        inputElement?.removeEventListener?.('compositionend', handleCompositionEnd);
      }
    };
  }, []);

  console.log(isComposing, '数据显示');



  const handleChange = useCallback(
    (e) => {
      const data = e.target.value;
      setValue(data);
      onChange?.(data);
    },
    [onChange]
  );

  const handleSearch = () => {
    setValue('');
    onSearch?.();
  };

  return (
    <div
      className={classnames(
        {
          [`${className}`]: className,
        },
        styles.sendContainer
      )}
    >
      <div className={styles.textAreaWrapper}>
        <TextArea
           ref={(ref) => {
            if (inputRef?.current) {
              inputRef.current = ref;
            }
            baseInputRef.current = ref;
          }}
          value={value}
          className={styles.textArea}
          placeholder={placeholder}
          bordered={false}
          autoSize={{
            minRows: 1,
            maxRows: 3,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
              e.preventDefault(); // 阻止默认行为，防止换行
              setValue('');
              onSearch?.(); // 触发发送事件
            }
          }}
          onChange={handleChange}
          disabled={loading}
          {...restProps}
        />
        <Button
          type="link"
          className={styles.sendButton}
          loading={loading}
          onClick={handleSearch}
        >
          {!loading ? (
            <UpCircleFilled className={styles.sendIcon} />
          ) : (
            <StopOutlined className={styles.abortIcon} onClick={onAbort} />
          )}
        </Button>
      </div>
    </div>
  );
}
