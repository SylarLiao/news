import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table, Button, Space, Modal, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;

export default function UserList() {
  const [data, setData] = useState([]);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [current, setCurrent] = useState(null);
  const addForm = useRef(null);
  const updateForm = useRef(null);
  const [regionList, setRegionList] = useState([]);
  const [roleList, setRoleList] = useState([]);

  const handleChange = (checked, item) => {
    // console.log(checked, item)
    item.roleState = checked;
    setData([...data, item]);
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      render: (region) => {
        return region === "" ? "全球" : region;
      },
      filters: [
        {
          text: "全球",
          value: "全球",
        },
        ...regionList.map((item) => ({
          text: item.title,
          value: item.value,
        })),
      ],
      onFilter: (value, record) => {
        if (value === "全球") {
          return record.region === "";
        }
        return record.region === value;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
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
      render: (roleState, item) => {
        // console.log(roleState, item)
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={(checked) => handleChange(checked, item)}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, item) => (
        <Space size="small">
          <Button
            disabled={item.default}
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              handleUpdate(item);
            }}
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

  const handleUpdate = (item) => {
    setIsUpdateVisible(true);
    setTimeout(() => {
      if (item.roleId === 1) {
        setIsUpdateDisabled(true);
      } else {
        setIsUpdateDisabled(false);
      }
      updateForm.current.setFieldsValue(item);
    }, 0);

    setCurrent(item);
  };

  const showConfirm = (item) => {
    confirm({
      title: "删除用户?",
      icon: <ExclamationCircleFilled />,
      content: "删除用户",
      onOk() {
        setData(data.filter((data) => data.id !== item.id));
        axios.delete(`/users/${item.id}`);
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    axios.get("/users?_expand=role").then((res) => {
      const roleObj = {
        1: "superadmin",
        2: "admin",
        3: "editor",
      };

      let users = res.data;

      setData(
        roleObj[roleId] === "superadmin"
          ? users
          : [
              ...users.filter((item) => item.username === username),
              ...users.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              )
            ]
      );
    });
  }, [roleId, username, region]);

  useEffect(() => {
    axios.get("/regions").then((res) => {
      setRegionList(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/roles").then((res) => {
      setRoleList(res.data);
    });
  }, []);

  const addFormOk = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        setIsAddVisible(false);
        addForm.current.resetFields();

        // add data
        axios
          .post(`/users`, {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            // console.log(roleList);
            if (res.status === 201) {
              let newData = {
                ...res.data,
                role: roleList.filter((data) => data.id === res.data.roleId)[0],
              };
              setData([...data, newData]);
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateFormOK = () => {
    updateForm.current
      .validateFields()
      .then((value) => {
        setIsUpdateVisible(false);
        updateForm.current.resetFields();

        // update data
        axios
          .patch(`/users/${current.id}`, {
            ...value,
          })
          .then((res) => {
            if (res.status === 200) {
              setData(
                data.map((item) => {
                  if (item.id === current.id) {
                    return {
                      ...item,
                      ...value,
                      role: roleList.filter(
                        (data) => data.id === item.roleId
                      )[0],
                    };
                  } else {
                    return item;
                  }
                })
              );
              setIsUpdateDisabled(!isUpdateDisabled);
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setIsAddVisible(true);
        }}
      >
        添加用户
      </Button>

      <Table
        bordered
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.id}
        pagination={{ defaultPageSize: 5, showSizeChanger: true }}
      />

      <Modal
        open={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false);
        }}
        onOk={addFormOk}
      >
        <UserForm
          ref={addForm}
          roleList={roleList}
          regionList={regionList}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={false}
        />
      </Modal>

      <Modal
        open={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false);
          setIsUpdateDisabled(!isUpdateDisabled);
        }}
        onOk={updateFormOK}
      >
        <UserForm
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
          roleList={roleList}
          regionList={regionList}
          isUpdate = {true}
        />
      </Modal>
    </div>
  );
}
