import {Card, Form, Input, Checkbox, Button, message} from 'antd'
import "./index.scss"
import logo from '@/assets/logo.png'
import React from "react";
import {LoginStore} from "../../store/login.store";
import {useNavigate} from "react-router-dom";

const imageBoxClassName = "login-logo"
const loginStore = new LoginStore()
const formName = "basic"

function Login() {
    const navigate = useNavigate()
    const onFinish = async (values: any) => {
        const loginStatus = await loginStore.login(values.password, values.remember).then().catch((err) => {
            message.error(err.message)
        })
        if (loginStatus != null && loginStatus) {
            navigate("/", {replace: true})
        }
    }


    return (
        <div className="login">
           <Card className="login-container">
               <img className={imageBoxClassName} src={logo} alt=""/>
               <Form
                   name={formName}
                   className={"login-form"}
                   labelCol={{ span: 8 }}
                   wrapperCol={{ span: 16 }}
                   initialValues={{ remember: true }}
                   onFinish={onFinish}
                   autoComplete="off"
               >
                       <Form.Item
                           label="Authkey"
                           name="password"
                           rules={[{ required: true, message: 'Please input your password!' }]}
                       >
                           <Input.Password />
                       </Form.Item>
                       <Form.Item
                           name="remember"
                           valuePropName="checked"
                           className="login-remember"
                           wrapperCol={{
                               offset: 8,
                               span: 16,
                           }}
                       >
                           <Checkbox>remember</Checkbox>
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
           </Card>
        </div>
    )
}

export default Login