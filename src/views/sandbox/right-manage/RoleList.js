import { Table,Button,Modal,Tree } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { DeleteOutlined,EditOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
const {confirm} = Modal
export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [rightList, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [isModalVisible, setisModalVisible] = useState(false)
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>

          <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={() => {
             setisModalVisible(true)
             setcurrentRights(item.rights)
             setcurrentId(item.id)
          }}></Button>

        </div>
      }
    },
  ]
  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除吗',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  //删除
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/roles/${item.id}`)
       
  }
  useEffect(() => {
    axios.get('/roles').then(res => {
      setdataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setrightList(res.data)
    })
  }, [])
  const handleOk = () => {
    setisModalVisible(false)
     setdataSource(dataSource.map(item => {
       if(item.id === currentId) {
         return {
            ...item,
            rights:currentRights
         }
       }
       return item
     }))
     axios.patch(`/roles/${currentId}`,{
       rights : currentRights
     })
  }
  const handleCancel = () => {
     setisModalVisible(false)
  }
  const onCheck = (checkkey) => {
    // console.log(r);
    setcurrentRights(checkkey.checked)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Tree
      checkable
      checkedKeys = {currentRights}
      onCheck={onCheck}
      checkStrictly = {true}
      treeData={rightList}
    />
      </Modal>
    </div>
  )
}
