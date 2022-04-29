import React, { useState, useEffect, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd'
import NewsEditor from '../../news-manage/NewsEditor'
import style from './News.module.css'
import axios from 'axios'
const { Step } = Steps
const { Option } = Select
export default function NewsUpdate(props) {
    const [current, setcurrent] = useState(0)
    const [CategoryList, setCategoryList] = useState([])
    const [formInfo, setformInfo] = useState([])
    const [content, setcontent] = useState([])
    const NewsForm = useRef(null)
    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                setformInfo(res);
                setcurrent(current + 1)
            }).catch(error => {
                console.log(error);
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
            } else {
                setcurrent(current + 1)
            }
        }
    }
    const handlePrevious = () => {
        setcurrent(current - 1)
    }
    const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
    };
    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            let { categoryId,title,content } = res.data
            NewsForm.current.setFieldsValue({
                title ,
                categoryId
            })
            setcontent(content)
        })
    }, [props.match.params.id])

    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

            notification.info({
                message: '通知',
                description:
                    `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看你的新闻 `,
                placement: "bottomRight",
            });
        })
    }
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => props.history.goBack()}
                subTitle="Write news"
            />,
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div style={{ marginTop: '50px', marginRight: '70px' }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form
                        {...layout}
                        name="basic"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!', }]}
                        >
                            <Input autoComplete='off' />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your username!', }]}
                        >
                            <Select>
                                {
                                    CategoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        setcontent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? '' : style.active}></div>
            </div>

            <div style={{ marginTop: '50px' }}>
                {
                    current === 2 && <span>
                        <Button type='priimary' onClick={() => handleSave(0)}>保存到草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='priimary' onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>
        </div>
    )
}
