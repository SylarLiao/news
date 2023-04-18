import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Tree } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";

const { confirm } = Modal;

export default function RoleList() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rights, setRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [currentRights, setCurrentRights] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "roleName",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setIsModalOpen(true);
              setCurrentRights(record.rights);
              setCurrentId(record.id);
            }}
          ></Button>

          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => showConfirm(record)}
            danger
          ></Button>
        </Space>
      ),
    },
  ];

  const showConfirm = (record) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        // 假删除
        setData(data.filter((data) => data.id !== record.id));
        // axios.delete("http://localhost:3000/roles/${record.id}")
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  };

  useEffect(() => {
    axios.get("http://localhost:3000/roles").then((res) => {
      setData(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3000/rights?_embed=children").then((res) => {
      setRights(res.data);
    });
  }, []);

  const handleOk = () => {
    let newData = data.map(item => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights,
        };
      } else {
        return item;
      }
    });

    axios
      .patch(`http://localhost:3000/rights/${currentId}`, {
        rights: currentRights,
      })
      .then((res) => {
        if (res.status === 200) {
          setData(newData);
          setIsModalOpen(false);
        }
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOnCheck = (checkedKeys) => {
    // console.log(checkedKeys);
    setCurrentRights(checkedKeys.checked);
  };

  return (
    <div>
      <Table
        bordered
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={data}
        pagination={{ defaultPageSize: 5, showSizeChanger: true }}
      />
      <Modal
        title="权限配置"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          onCheck={handleOnCheck}
          checkable
          checkStrictly={true}
          treeData={rights}
          checkedKeys={currentRights}
        />
      </Modal>
    </div>
  );
}
