import { forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'antd';


const ModalDetail = forwardRef(({}, ref) =>{
    const [modal, contextHolder] = Modal.useModal();

    useImperativeHandle(ref,()=>({

    }))


  return (
    <div>index</div>
  )
})

export default ModalDetail;