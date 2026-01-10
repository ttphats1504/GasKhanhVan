import React, { useState, useEffect } from "react";
import {
  AppstoreAddOutlined,
  FireOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  Space,
  Typography,
} from "antd";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductMange from "../screens/product/ProductManage";
import CategoryManage from "../screens/category/CategoryManage";
import IncentiveManage from "../screens/incentive/IncentiveManage";
import BannerManage from "../screens/banner/BannerManage";
import FeaturesMange from "../screens/features/FeaturesManage";
import BrandManage from "../screens/brand/BrandManage";
import BlogManage from "../screens/blog/BlogManage";
import AdminUsers from "../screens/AdminUsers";
import { removeAuth } from "../redux/reducers/authReducer";
import { localDataNames } from "../constants/appInfos";
import { RootState } from "../redux/store";

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const MainRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedKey, setSelectedKey] = useState("1");

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname.includes("/product")) {
      setSelectedKey("1");
    } else if (location.pathname.includes("/category")) {
      setSelectedKey("2");
    } else if (location.pathname.includes("/incentive")) {
      setSelectedKey("3");
    } else if (location.pathname.includes("/banner")) {
      setSelectedKey("4");
    } else if (location.pathname.includes("/features-product")) {
      setSelectedKey("5");
    } else if (location.pathname.includes("/brands")) {
      setSelectedKey("6");
    } else if (location.pathname.includes("/admin-users")) {
      setSelectedKey("8");
    }
  }, [location.pathname]);

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key);
    if (e.key === "1") navigate("/product");
    else if (e.key === "2") navigate("/category");
    else if (e.key === "3") navigate("/incentive");
    else if (e.key === "4") navigate("/banner");
    else if (e.key === "5") navigate("/features-product");
    else if (e.key === "6") navigate("/brands");
    else if (e.key === "7") navigate("/blogs");
    else if (e.key === "8") navigate("/admin-users");
  };

  const handleLogout = () => {
    dispatch(removeAuth());
    localStorage.removeItem(localDataNames.authData);
    navigate("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            {
              key: "1",
              icon: <FireOutlined />,
              label: "Product",
            },
            {
              key: "2",
              icon: <AppstoreAddOutlined />,
              label: "Menu Items",
            },
            {
              key: "3",
              icon: <UploadOutlined />,
              label: "Incentives Items",
            },
            {
              key: "4",
              icon: <UploadOutlined />,
              label: "Banners",
            },
            {
              key: "5",
              icon: <UploadOutlined />,
              label: "Features Product",
            },
            {
              key: "6",
              icon: <UploadOutlined />,
              label: "Brands",
            },
            {
              key: "7",
              icon: <UploadOutlined />,
              label: "Blogs",
            },
            {
              key: "8",
              icon: <TeamOutlined />,
              label: "Admin Users",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }}>
              <Avatar
                src={user?.photoURL}
                icon={!user?.photoURL && <UserOutlined />}
              />
              <Text>{user?.displayName || user?.email || "Admin"}</Text>
            </Space>
          </Dropdown>
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
          <Routes>
            <Route path="/" element={<ProductMange />} />
            <Route path="/product" element={<ProductMange />} />
            <Route path="/category" element={<CategoryManage />} />
            <Route path="/incentive" element={<IncentiveManage />} />
            <Route path="/banner" element={<BannerManage />} />
            <Route path="/features-product" element={<FeaturesMange />} />
            <Route path="/brands" element={<BrandManage />} />
            <Route path="/blogs" element={<BlogManage />} />
            <Route path="/admin-users" element={<AdminUsers />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          GasKhanhVan Manage ©{new Date().getFullYear()} Created by ttphats
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainRouter;
