import { Layout, Menu } from "antd";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const {
  role: { rights },
} = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : { role: {rights: null} };

const checkPermission = (item) => {
  return item.pagepermisson === 1 && rights.includes(item.key);
};

const renderMenu = (menuList) => {
  return menuList.map((item) => {
    if (checkPermission(item)) {
      if (item?.children?.length > 0) {
        return getItem(
          item.title,
          item.key,
          renderMenu(item.children),
          icons[item.key]
        );
      } else {
        return getItem(item.title, item.key, null, icons[item.key]);
      }
    }
    return null;
  });
};

export default function SideMenu() {
  const [collapsed] = useState(false);
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const onClick = (e) => {
    // console.log("click ", e);
    console.log(location);
    navigate(e.key);
  };

  const defaultSelectedKeys = localStorage.getItem("defaultSelectedKeys");
  const defaultOpenKey = localStorage.getItem("defaultOpenKey");

  useEffect(() => {
    axios.get("http://localhost:3000/rights?_embed=children").then((res) => {
      console.log(res.data);
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
