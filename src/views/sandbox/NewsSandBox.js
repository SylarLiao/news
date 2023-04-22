import React, { useEffect } from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";

import { Layout, theme } from "antd";
import DownFooter from "../../components/sandbox/DownFooter";
import NewsRouter from "../../components/sandbox/NewsRouter";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const { Content } = Layout;

export default function NewsSandBox() {
  NProgress.start();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    NProgress.done();
  });

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
