import { Layout, Menu } from "antd";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RightOutlined,
  DashOutlined,
  SoundOutlined,
  DoubleRightOutlined,
  VideoCameraFilled,
  PlusSquareTwoTone,
  HomeOutlined,
  HddOutlined,
  FilePdfOutlined,
  UserOutlined,
  SkinOutlined,
  WeiboSquareOutlined,
  ZoomInOutlined,
  SlidersTwoTone,
  WeiboCircleFilled,
  YoutubeOutlined,
} from "@ant-design/icons";
import axios from "axios";

import "./SideMenu.css";

const { useState } = React;
const { Sider } = Layout;

function getItem(label, key, children, icon, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const icons = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <PlusSquareTwoTone />,

  "/right-manage": <RightOutlined />,
  "/right-manage/role/list": <DoubleRightOutlined />,
  "/right-manage/right/list": <FilePdfOutlined />,

  "/news-manage": <DashOutlined />,
  "/news-manage/draft": <HddOutlined />,
  "/news-manage/add": <SkinOutlined />,

  "/audit-manage": <SoundOutlined />,
  "/audit-manage/audit": <VideoCameraFilled />,
  "/audit-manage/list": <WeiboCircleFilled />,

  "/publish-manage": <WeiboSquareOutlined />,
  "/publish-manage/unpublished": <ZoomInOutlined />,
  "/publish-manage/published": <YoutubeOutlined />,
  "/publish-manage/sunset": <SlidersTwoTone />,
};

export default function SideMenu() {
  const [collapsed] = useState(false);
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  let { role } = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : { rights: [] };

  const checkPermission = (item) => {
    return item.pagepermisson && role.rights.includes(item.key);
  };

  const renderMenu = (menuList) => {
    let result = menuList.filter((item) => {
      if (item?.children?.length > 0) {
        item.children = item.children.filter((item) => checkPermission(item));
      }
      return checkPermission(item);
    });

    return result.map((item) => {
      if (item?.children?.length > 0) {
        return getItem(
          item.title,
          item.key,
          renderMenu(item.children),
          icons[item.key]
        );
      }
      return getItem(item.title, item.key, null, icons[item.key]);
    });
  };

  const onClick = (e) => {
    navigate(e.key, { state: { key: e.keyPath } });
  };

  const defaultSelectedKeys = localStorage.getItem("defaultSelectedKeys");
  const defaultOpenKey = localStorage.getItem("defaultOpenKey");

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setMenu(res.data);
    });
  }, []);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo ">发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            onClick={onClick}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[defaultSelectedKeys]}
            defaultOpenKeys={[defaultOpenKey]}
            onSelect={(item) => {
              localStorage.setItem("defaultSelectedKeys", item.key);
            }}
            onOpenChange={(item) => {
              localStorage.setItem("defaultOpenKey", item[item.length - 1]);
            }}
            items={renderMenu(menu)}
          />
        </div>
      </div>
    </Sider>
  );
}
