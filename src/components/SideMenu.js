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

const checkPagePermission = (item) => {
  return item.pagepermisson === 1;
};

const renderMenu = (menuList) => {
  return menuList.map((item) => {
    if (checkPagePermission(item)) {
      return item.children?.length > 0
        ? getItem(
            item.title,
            item.key,
            renderMenu(item.children),
            icons[item.key]
          )
        : getItem(item.title, item.key, null, icons[item.key]);
    }
    return null;
  });
};

export default function SideMenu() {
  const [collapsed] = useState(false);
  const [menu, setMenu] = useState([]);
  const navigate = useNavigate();

  const [defaultOpenKey, setDefaultOpenKey] = useState(["/home"])
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(["/home"])

  const onClick = (e) => {
    // console.log("click ", e);
    navigate(e.key);
  };

  useEffect(() => {
    axios.get("http://localhost:3000/rights?_embed=children").then((res) => {
      // console.log(res.data)
      setMenu(res.data);
    });
  }, []);

  console.log(defaultOpenKey)
  console.log(defaultSelectedKeys)

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo ">发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            onClick={onClick}
            theme="dark"
            mode="inline"
            selectedKeys={defaultSelectedKeys}
            defaultOpenKeys={defaultOpenKey}
            onSelect={(item) => {
              const selected = [...item.selectedKeys]
              setDefaultSelectedKeys(selected)
              const selected2 = ["/" + item.key.split('/')[1]]
              setDefaultOpenKey(selected2)
            }}
            items={renderMenu(menu)}
          />
        </div>
      </div>
    </Sider>
  );
}
