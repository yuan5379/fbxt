import React,{useEffect,useState} from 'react'
import { Route, Switch, Redirect } from "react-router-dom"
import Home from '../../views/sandbox/home/Home'
import UserList from '../../views/sandbox/user-manage/UserList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import RightList from '../../views/sandbox/right-manage/RightList'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'
import NewsAdd from '../sandbox/news-manage/NewsAdd'
import NewsDraft from '../sandbox/news-manage/NewsDraft'
import NewsCategory from "../sandbox/news-manage/NewsCategory"
import NewsPreview from './news-manage/NewsPreview'
import NewsUpdate from './news-manage/NewsUpdate'
import Audit from "../sandbox/audit-manage/Audit"
import AuditList from "../sandbox/audit-manage/AuditList"
import Unpublished from "../sandbox/publish-manage/Unpublished"
import Published from "../sandbox/publish-manage/Published"
import Sunset from "../sandbox/publish-manage/Sunset"
import axios from 'axios'
import { connect } from 'react-redux'
import { Spin } from 'antd'
const LocalRouter = {
    "/home":Home,
    "/user-manage/list":UserList,
    "/right-manage/role/list":RoleList,
    "/right-manage/right/list":RightList,
    "/news-manage/add":NewsAdd,
    "/news-manage/draft":NewsDraft,
   "/news-manage/category":NewsCategory,
   "/news-manage/preview/:id":NewsPreview,
   "/news-manage/update/:id":NewsUpdate,
   "/audit-manage/audit":Audit,
   "/audit-manage/list":AuditList,
   "/publish-manage/unpublished":Unpublished,
   "/publish-manage/published":Published,
   "/publish-manage/sunset":Sunset
}
 function NewsRouter(props) {
    const [backRouteList, setbackRouteList] = useState([])
    if (!localStorage.getItem("token")) {
        var rights = ['/news','/detail']
    } else {
       var { role:{rights} } = JSON.parse(localStorage.getItem("token"))
    }
    useEffect(() => {
       Promise.all([
           axios.get("/rights"),
           axios.get("/children"),
       ]).then(res => {
            setbackRouteList([...res[0].data,...res[1].data])
       })
    }, [])
    const checkRoute = (item) => {
        return LocalRouter[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
         return rights.includes(item.key)
    }
  return (
    <Spin size="large" spinning={props.isLoading}>
        <Switch>
          {
              backRouteList.map(item => 
                {
                    if (checkRoute(item) && checkUserPermission(item)) {
                        return <Route path={item.key} key={item.key} component={LocalRouter[item.key]} exact/> 
                    } else {
                        return null
                    }
                }
             )
          }

          <Redirect from='/' to='/home' exact />
          {
              backRouteList.length > 0 && <Route path='*' component={Nopermission} />
          }
        </Switch>
    </Spin>
  )
}

const mapStateToProps = ({LoadingReducer:{isLoading}}) => {
    return {
        isLoading
    }
 } 

export default connect(mapStateToProps)(NewsRouter)
