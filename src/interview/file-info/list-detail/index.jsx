import { List } from 'antd';

const ListDetail = ({ dataSource, fileCount }) =>{
  return (
    <>
       <List
      bordered
      dataSource={dataSource}
      style={{ maxWidth: 400, maxHeight:400, overflow:'auto'}}
      renderItem={(item, index) => (
        <List.Item >
         {index+1}、{item.question}
        </List.Item>
      )}
    />
    </>
  )
}

export default ListDetail;