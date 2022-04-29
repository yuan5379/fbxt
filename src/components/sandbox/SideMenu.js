import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import './index.css'
import {
  VideoCameraOutlined,
  UserOutlined
} from '@ant-design/icons';
const { Sider } = Layout;
const { SubMenu } = Menu

const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <VideoCameraOutlined />,
  "/user-manage/list": <VideoCameraOutlined />,
  "/right-manage": <VideoCameraOutlined />,
  "/right-manage/role/list": <VideoCameraOutlined />,
  "/right-manage/right/list": <UserOutlined />,
}
function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
       setMenu(res.data)
    })

  }, [])
  const {role:{rights}} = JSON.parse(localStorage.getItem("token"))
  const checkpagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key)
  }

  const renderMenu = (menulist) => {
    return menulist.map(item => {
      if (item.children?.length > 0 && checkpagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return checkpagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }
  const selecKeys = [props.location.pathname]
  const openKeys = ["/" + props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className="logo" >全球发布管理系统</div>
        <div style={{flex:1,overflow:'auto'}}>
          <Menu theme="dark" mode="inline" selectedKeys={selecKeys} defaultOpenKeys={openKeys}> 

            {renderMenu(menu)}

          </Menu>
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({collapsedReducer:{isCollapsed}}) => {
   return {
    isCollapsed
   }
}

export default connect(mapStateToProps)(withRouter(SideMenu))
