import React from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Dropdown,Menu,Avatar } from 'antd';
import { connect } from 'react-redux'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
const { Header } = Layout;
 function TopHeader(props) {
  const changeCollapsed = () => {
      props.changeCollapsed()
  }

  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token"))

  const menu = (
    <Menu>
      <Menu.Item>
         {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={() => {
         localStorage.removeItem("token")
         props.history.replace('/login')
      }}>退出</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Header className="site-layout-background" style={{ padding: '0 16px' }}>
        {
          props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
        }

        <div style={{ float: 'right' }}>
          <span>欢迎<span style={{color:'#1890ff'}}>{username}</span>回来</span>
          <Dropdown overlay={menu}>
            <Avatar size="large" icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
    </div>
  )
}

const mapStateToProps = ({collapsedReducer:{isCollapsed}}) => {
  return {
     isCollapsed
  }
}

const mapDispatchToProps = {
   changeCollapsed() {
     return {
       type : "change_collapsed"
     }
   }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))