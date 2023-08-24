import "./components.scss"
import logo from '@/assets/logo.png'
import {Button, Col, Form, Input, Row} from "antd";
import React from "react";
import {useNavigate} from "react-router-dom";
import {getServerAddressAndPort, getServerWsProto, getToken} from "../utils/http";

export class SshConfig {
    address: string
    port: string
    hostname: string
    password: string
    wsPath: string

    constructor(address: string, port: string, host: string, passwd: string, wsPath: string) {
        this.address = address
        this.hostname = host
        this.password = passwd
        this.port = port
        this.wsPath = wsPath
    }

}

const SshConfiguration = () => {

    const navigate = useNavigate()
    const onFinish = (value: any) => {
        const sessionId = getToken().slice(0, 16)
        const wsPath = getServerWsProto() + "//" + getServerAddressAndPort() + "/webssh/ws/" + sessionId
        const sshConfig = new SshConfig(value.address, value.port, value.hostname, value.password, wsPath)
        navigate("/index/terminal", {state: sshConfig})
    }

    return (
        <>
            <div className="component-container">
                <Row className='row'>
                    <Col span={16}>
                        <img className="component-img" src={logo} alt="logo-png"/>
                    </Col>
                    <Col span={8} className='right-col'>
                        <Form
                            name="basic'"
                            className="config-form"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <h1>Connect to Remote SSH</h1>
                            <Form.Item
                                label="Remote Address"
                                name="address"
                                rules={[{ required: true, message: 'Please input remote address.' }]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Remote Port"
                                name="port"
                                rules={[{ required: true, message: 'Please input remote port.' }]}
                                initialValue="22"
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Hostname"
                                name="hostname"
                                rules={[{ required: true, message: 'Please input hostname.' }]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ message: 'Please input password.' }]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" htmlType="submit" className="login-input-button">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>

            </div>
        </>
    )
}

export {SshConfiguration}