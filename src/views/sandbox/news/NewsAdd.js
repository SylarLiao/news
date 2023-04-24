import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Steps, Button, Space, Select, message, notification } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./News.css";
import NewsEditor from "../../../components/news/NewsEditor";

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [category, setCategory] = useState([]);
  const [content, setContent] = useState("");
  const [formInfo, setFormInfo] = useState("");
  const NewsForm = useRef(null);

  const navigate = useNavigate();

  const handleNext = () => {
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          setFormInfo(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };

  const handlePrevious = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategory(
        res.data.map((item) => {
          return { value: item.id, label: item.title };
        })
      );
    });
  }, []);

  const user = JSON.parse(localStorage.getItem("token"));

  const handleDraftSave = (auditState) => {
    axios.post("/news", {
      ...formInfo,
      content: content,
      region: user.region ? user.region : "全球",
      author: user.username,
      roleId: user.roleId,
      auditState: auditState,
      publishState: 0,
      createTime: Date.now(),
      start: 0,
      view: 0,
      publisTime: 0,
    }).then(res => {
      navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list");
      notification.info({
        message: "通知",
        description: `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看`,
        placement: "bottom"
      });
    });
  };

  return (
    <div>
      <Steps
        current={current}
        items={[
          {
            title: "基本信息",
            description: "新闻标题，新闻分类",
          },
          {
            title: "新闻内容",
            description: "新闻主题内容",
            subTitle: "Left 00:00:08",
          },
          {
            title: "新闻提交",
            description: "保存草稿或提交审核",
          },
        ]}
      />

      <div
        style={{
          marginTop: "12px",
        }}
      >
        <div className={current === 0 ? "" : "hidden"}>
          <Form
            ref={NewsForm}
            name="basic"
            labelCol={{
              span: 2,
            }}
            wrapperCol={{
              span: 25,
            }}
            autoComplete="off"
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Please input your news title!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: "Please input your news title!",
                },
              ]}
            >
              <Select options={category} />
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? "" : "hidden"}>
          <NewsEditor
            getContent={(value) => {
              setContent(value);
            }}
          ></NewsEditor>
        </div>

        <div className={current === 2 ? "" : "hidden"}>3333</div>
      </div>
      <div>
        <Space>
          {current === 2 && (
            <span>
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    handleDraftSave(0);
                  }}
                >
                  保存草稿
                </Button>
                <Button danger onClick={() => {
                  handleDraftSave(1);
                }}>提交审核</Button>
              </Space>
            </span>
          )}
          {current < 2 && (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          )}
          {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
        </Space>
      </div>
    </div>
  );
}
