import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Space,
  Modal,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;

export default function UserList() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      key: "region",
      render: (region) => {
        return region === "" ? "全球" : region;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      key: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={(flag, event) => {
              // record.pagepermisson = flag ? 1 : 0;
              // setData([...data]);
              // if (record.grade === 1) {
              //   axios.patch(`http://localhost:3000/rights/${record.id}`, {
              //     pagepermisson: record.pagepermisson,
              //   });
              // } else {
              //   axios.patch(`http://localhost:3000/children/${record.id}`, {
              //     pagepermisson: record.pagepermisson,
              //   });
              // }
            }}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      dataIndex: "action",
      render: (_, item) => (
        <Space size="small">
          <Button
            disabled={item.default}
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {}}
          ></Button>

          <Button
            disabled={item.default}
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => showConfirm(item)}
            danger
          ></Button>
        </Space>
      ),
    },
  ];

  const showConfirm = (item) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        // 假删除
        setData(data.filter((data) => data.id !== item.id));
        // axios.delete("http://localhost:3000/roles/${record.id}")
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/users?_expand=role").then((res) => {
      setData(res.data);
    });
  }, []);

  
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        添加用户
      </Button>

      <Table
        bordered
        columns={columns}
        dataSource={data}
        pagination={{ defaultPageSize: 5, showSizeChanger: true }}
      />

      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setOpen(false);
        }}
        onOk={() => {
          setOpen(false);
        }}
      >
        <UserForm/>
      </Modal>
    </div>
  );
}
