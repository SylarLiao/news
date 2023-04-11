import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Select } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

export default function UserForm() {
  const [regionList, setRegionList] = useState([]);
  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/regions").then((res) => {
      let regions = res.data.map((item) => {
        return { value: String(item.id), label: item.value };
      });
      setRegionList(regions);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/roles").then((res) => {
      let roles = res.data;
      setRoleList(
        roles.map((item) => {
          return { value: String(item.id), label: item.roleName };
        })
      );
    });
  }, []);

  return (
    <Form layout="vertical" name="form_in_modal">
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="password" label="密码">
        <Input.Password
          placeholder="password"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
      </Form.Item>
      <Form.Item name="region" label="区域">
        <Select options={regionList} />
      </Form.Item>
      <Form.Item name="roleId" label="角色">
        <Select options={roleList} />
      </Form.Item>
    </Form>
  );
}
