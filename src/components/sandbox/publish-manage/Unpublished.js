import React from 'react'
import NewsPublish from '../../publish-manage/NewsPublish'
import usePublish from '../../publish-manage/usePublish'
import { Button } from 'antd'
export default function Unpublished() {
  const { dataSource,handlepublish } = usePublish(1)
  
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={ (id) => <Button type='primary'  onClick={() => handlepublish(id)}>发布</Button>} ></NewsPublish>
    </div>
  )
}
