import React, { useState, useEffect, forwardRef } from "react";
import { Form, Input, Select } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";

const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);

  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled);
  }, [props.isUpdateDisabled]);

  const { roleId, region } = JSON.parse(localStorage.getItem("token"));
  const roleObj = {
    1: "superadmin",
    2: "admin",
    3: "editor",
  };

  useEffect(() => {
    const checkRoleDisabled = (item) => {
      if (props.isUpdate) {
        if (roleObj[roleId] === "superadmin") {
          return false;
        } else {
          return true;
        }
      } else {
        if (roleObj[roleId] === "superadmin") {
          return false;
        } else {
          return item.id !== 3;
        }
      }
    };

    setRoleList(
      props.roleList.map((item) => {
        let isDisabled = checkRoleDisabled(item);
        return { value: item.id, label: item.roleName, disabled: isDisabled };
      })
    );
  }, [props.roleList, roleId, roleObj, props.isUpdate]);

  useEffect(() => {
    const checkRegionDisabled = (item) => {
      if (props.isUpdate) {
        if (roleObj[roleId] === "superadmin") {
          return false;
        } else {
          return true;
        }
      } else {
        if (roleObj[roleId] === "superadmin") {
          return false;
        } else {
          return item.value !== region;
        }
      }
    };
    setRegionList(
      props.regionList.map((item) => {
        let isDisabled = checkRegionDisabled(item);
        return { value: item.value, label: item.value, disabled: isDisabled };
      })
    );
  }, [props.regionList, props.isUpdate, region, roleId, roleObj]);

  return (
    <Form ref={ref} layout="vertical" name="form_in_modal">
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
      <Form.Item
        name="region"
        label="区域"
        rules={
          isDisabled
            ? []
            : [
                {
                  required: true,
                  message: "Please input the title of collection!",
                },
              ]
        }
      >
        <Select options={regionList} disabled={isDisabled} />
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={
          isDisabled
            ? []
            : [
                {
                  required: true,
                  message: "Please input the title of collection!",
                },
              ]
        }
      >
        <Select
          options={roleList}
          onChange={(value) => {
            if (value === 1) {
              setIsDisabled(true);
              ref.current.setFieldsValue({
                region: "",
              });
            } else {
              setIsDisabled(false);
            }
          }}
        />
      </Form.Item>
    </Form>
  );
});

export default UserForm;
