import React from "react";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./Login.css";
import { Button, Checkbox, Form, Input } from "antd";
import ParticlesBg from "particles-bg";

export default function Login() {
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <div className="background-style">
      <div className="login-form">
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item>
            <div className="login-title">全球新闻发布管理系统</div>
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="http://localhost:3000/">
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            <div>
              没有账号?{" "}
              <a href="http://localhost:3000/register">register now!</a>
            </div>
          </Form.Item>
        </Form>
      </div>
      <ParticlesBg type="random"
          bg={{ position: "relative", width: "100%", height: "100%"}}
        />
    </div>
  );
}
