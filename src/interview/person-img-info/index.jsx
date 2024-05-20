import { useContext } from 'react';
import styles from './index.module.css';
import { ChatContext } from '../context';
import { Carousel } from 'antd';
const contentStyle = {
    height: '70vh',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    display: 'flex',
    alignItems: 'center',
};


export default function PersonImgInfo() {

    const data = useContext(ChatContext)
    const { fileUrls } = data || {};
    return (
        <div className={styles.containerPerson}>
            <Carousel autoplay>

                {fileUrls?.map(i=>{
                    return  <div  key={i} className={styles.contentStyle}>
                    <img src={i} className={styles.imgStyle}/>
                </div>
                })}




            </Carousel>
        </div>
    )
}
