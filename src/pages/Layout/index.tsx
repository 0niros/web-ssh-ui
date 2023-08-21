import {Col, message, Row, Steps} from "antd";
import React, {useEffect, useState} from "react";
import "./index.scss"
import {SshConfiguration} from "../../components/SshConfiguration";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {getToken} from "../../utils/http";

class StepItem {
    public title: string
    public path: string
    public content: any
    public index: number

    constructor(title: string, content: any, path: string, index: number) {
        this.content = content
        this.title = title
        this.path = path
        this.index = index
    }
}

const steps: StepItem[] = [
    new StepItem("Step-1", SshConfiguration, "/index/configuration", 0),
    new StepItem("Step-2", "Terminal.", "/index/terminal", 1)
]

const Layout: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const items = steps.map((item) => ({key: item.title, title: item.content}))
    const navigate = useNavigate()
    const location = useLocation()

    const next = () => {
        console.log(current)
        setCurrent(current + 1)
        navigate(steps[current+1].path)
    }

    const prev = () => {
        console.log(current)
        setCurrent(current - 1)
        navigate(steps[current-1].path)
    }

    useEffect(() => {
        // 1. If non auth, redirect to login page.
        if (getToken() === "") {
            navigate("/login")
            return
        }
        message.success("Login with token.").then()

        const routeNow = location.pathname
        if (routeNow === "/index") {
            navigate("/index/configuration")
        }
        steps.forEach((item: StepItem) => {
            if (routeNow === item.path) {
                setCurrent(item.index)
            }
        })
    })

    return (
        <div className="layout-container">
            <Steps current={current} items={items} className="navi-layout"/>
            <Row className="content">
                <Col span={2}>
                    {current > 0 && current <= steps.length - 1 && (
                        <LeftOutlined className='icon' onClick={prev}/>
                    )}
                </Col>
                <Col span={20}>
                    <Outlet />
                </Col>
                <Col span={2}>
                    {current >= 0 && current < steps.length - 1 && (
                        <RightOutlined className='icon' onClick={next}/>
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default Layout