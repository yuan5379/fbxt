import React, { useState, useEffect,useRef } from 'react'
import { Table, Tag, Button, Modal, Switch  } from 'antd'
import axios from 'axios'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal
export default function UserList() {
  const [dataSource, setdataSource] = useState([])
  const [isAddVisible, setisAddVisible] = useState(false)
  const [isUpdateVisible, setisUpdateVisible] = useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const [current, setcurrent] = useState(null)
  const { roleId,region,username } = JSON.parse(localStorage.getItem("token"))
  useEffect(() => {
    axios.get('/users?_expand=role').then(res => {
      const list = res.data
      setdataSource(roleId === 1?list:[
         ...list.filter(item => item.username === username),
         ...list.filter(item => item.region === region && item.roleId === 3)
      ])
    })
  }, [roleId,region,username])

  useEffect(() => {
    axios.get('/regions').then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])

  useEffect(() => {
    axios.get('/roles').then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])
  

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
         ...regionList.map(item => ({
            text: item.title,
            value: item.value,
         })),
         {
           text:"全球",
           value:"全球"
         }
      ],
      onFilter:(value,item) => {
         if (value === "全球") {
            return item.region === ''
         } 
         return item.region === value
      },
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (username) => {
        return <Tag color='#2db7f5'>{username}</Tag>
      }
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default}></Button>

          <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)}></Button>
        </div>
      }
    },
  ];

  const handleUpdate =(item) => {
      setTimeout(() => {
        setisUpdateVisible(true)
        if(item.roleId===1) {
           setisUpdateDisabled(true)
        } else {
          setisUpdateDisabled(false)
        }
        updateForm.current.setFieldsValue(item)
      }, 32);
      setcurrent(item)
  }
  
  const handleChange = (item) => {
     item.roleState = !item.roleState
     setdataSource([...dataSource])
     axios.patch(`/users/${item.id}`,{
        roleState:item.roleState
     })
  }

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
      axios.delete(`/users/${item.id}`)
  } 

  const addFormOK = () => {
    addForm.current.validateFields().then(value => {
       setisAddVisible(false)
       addForm.current.resetFields()
       // 先 post到后端，生成id，在设置 datasourse
       axios.post(`/users`,{
        ...value,
        "roleState": true,
        "default": false,
       }).then(res => {
          setdataSource([...dataSource,{
              ...res.data,
              role:roleList.filter(item => item.id === value.roleId)[0]
          }])
       })
    }).catch(err => {
      console.log(err);
    })
  }

  const updateFormOK = () => {
       updateForm.current.validateFields().then(value => {
           setisUpdateVisible(false)
           setdataSource(dataSource.map(item => {
               if (item.id === current.id) {
                 return {
                     ...item,
                     ...value,
                     role:roleList.filter(data => data.id === value.roleId)[0]
                 }
               }
               return item
           }))
           setisUpdateDisabled(!isUpdateDisabled)
           axios.patch(`/users/${current.id}`,value)
       })
  }
  return (
    <div>
      <Button type='primary' onClick={() => {
         setisAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{
        pageSize: 5,
      }}
        rowKey={item => item.id} />

      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
           setisAddVisible(false)
        }}
        onOk={() => addFormOK()}
      >
       <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
           setisUpdateVisible(false)
           setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => updateFormOK()}
      >
       <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} ifUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}