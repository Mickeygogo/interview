import React from 'react';
import styles from './index.module.css';

function SubTitle({ title, wrapperStyle, textStyle }) {
  return (
    <div className={styles.container} style={wrapperStyle}><div className={styles.SubTitle} style={textStyle}/>{title}</div>
  )
}


export { SubTitle }