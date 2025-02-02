import React, { useState } from "react";
import {
  FireOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GasCylinderManage from "../screens/cylinder/GasCylinderManage";

const { Header, Content, Footer, Sider } = Layout;

const MainRouter = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <FireOutlined />,
              label: (
                <a href="/gas-cylinder" rel="noopener noreferrer">
                  Gas Cylinder
                </a>
              ),
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "nav 2",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "nav 3",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<GasCylinderManage />} />
              <Route path="/gas-cylinder" element={<GasCylinderManage />} />
            </Routes>
          </BrowserRouter>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          GasKhanhVan Manage ©{new Date().getFullYear()} Created by ttphats
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainRouter;
