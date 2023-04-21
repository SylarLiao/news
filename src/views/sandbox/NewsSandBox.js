import React from "react";

import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";

import { Layout, theme } from "antd";
import DownFooter from "../../components/sandbox/DownFooter";
import NewsRouter from "../../components/sandbox/NewsRouter";

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
          
          <NewsRouter></NewsRouter>
        </Content>
        <DownFooter></DownFooter>
      </Layout>
    </Layout>
  );
}
