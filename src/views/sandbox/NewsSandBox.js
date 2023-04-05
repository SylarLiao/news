import React from "react";
import { Route, Routes } from "react-router-dom";
import SideMenu from "../../components/SideMenu";
import TopHeader from "../../components/TopHeader";
import Home from "./home/Home";
import RightList from "./right-manage/RightList";
import RoleList from "./right-manage/RoleList";
import UserList from "./user-manage/UserList";
import { Layout, theme } from "antd";
import DownFooter from "../../components/DownFooter";

const { Content } = Layout;

export default function NewsSandBox() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Routes>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/user-manage/list" element={<UserList />} />
            <Route path="/right-manage/role/list" element={<RoleList />} />
            <Route path="/right-manage/right/list" element={<RightList />} />
          </Routes>
          Content
        </Content>
        <DownFooter></DownFooter>
      </Layout>
    </Layout>
  );
}
