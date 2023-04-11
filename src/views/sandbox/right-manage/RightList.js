import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Switch, Button, Modal, Popover } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import axios from "axios";

const { confirm } = Modal;

export default function RightList() {
  const [data, setData] = useState([]);

  const showConfirm = (item) => {
    confirm({
      title: "Do you Want to delete these items?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      onOk() {
        // 假删除
        setData(data.filter((data) => data.id !== item.id));
        // axios.delete("http://localhost:3000/rights/${item.id}")
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      key: "key",
      render: (key, title) => {
        // console.log(title);
        let color = key.length > 5 ? "geekblue" : "green";
        return <Tag color={color}>{key}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      dataIndex: "action",
      render: (_, record) => (
        <Space size="small">
          <Popover
            content={
              <div>
                <Switch
                  checked={record.pagepermisson === 1}
                  onChange={(flag, event) => {
                    record.pagepermisson = flag?1:0;
                    setData([...data]);
                    if (record.grade === 1) {
                      axios.patch(`http://localhost:3000/rights/${record.id}`, {
                        pagepermisson: record.pagepermisson
                      })
                    } else { 
                      axios.patch(`http://localhost:3000/children/${record.id}`, {
                        pagepermisson: record.pagepermisson
                      })
                    }
                  }}
                  disabled={record.pagepermisson === undefined}
                ></Switch>
              </div>
            }
            title="页面配置项"
            trigger={record.pagepermisson === undefined ? "" : "click"}
          >
            <Button
              disabled={record.pagepermisson === undefined}
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
            ></Button>
          </Popover>

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

  useEffect(() => {
    axios.get("http://localhost:3000/rights?_embed=children").then((res) => {
      let data = res.data;
      data.map((item) => {
        if (item.children?.length === 0) {
          item.children = null;
        }
        return item;
      });
      setData(data);
    });
  }, []);

  return (
      <Table
        bordered
        columns={columns}
        dataSource={data}
        pagination={{ defaultPageSize: 5, showSizeChanger: true }}
      />
  );
}
