import React, { useState, useEffect } from "react";
import {
  AppstoreAddOutlined,
  FireOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  TeamOutlined,
  GiftOutlined,
  PictureOutlined,
  StarOutlined,
  TagsOutlined,
  FileTextOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Breadcrumb,
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
  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([
    { title: "Dashboard" },
  ]);

  const menuConfig: Record<string, { title: string; path: string }> = {
    "1": { title: "Products", path: "/product" },
    "2": { title: "Categories", path: "/category" },
    "3": { title: "Incentives", path: "/incentive" },
    "4": { title: "Banners", path: "/banner" },
    "5": { title: "Featured Products", path: "/features-product" },
    "6": { title: "Brands", path: "/brands" },
    "7": { title: "Blogs", path: "/blogs" },
    "8": { title: "Admin Users", path: "/admin-users" },
  };

  useEffect(() => {
    let key = "1";
    if (location.pathname.includes("/product")) {
      key = "1";
    } else if (location.pathname.includes("/category")) {
      key = "2";
    } else if (location.pathname.includes("/incentive")) {
      key = "3";
    } else if (location.pathname.includes("/banner")) {
      key = "4";
    } else if (location.pathname.includes("/features-product")) {
      key = "5";
    } else if (location.pathname.includes("/brands")) {
      key = "6";
    } else if (location.pathname.includes("/blogs")) {
      key = "7";
    } else if (location.pathname.includes("/admin-users")) {
      key = "8";
    }
    setSelectedKey(key);
    setBreadcrumbItems([
      { title: <DashboardOutlined /> },
      { title: menuConfig[key]?.title || "Dashboard" },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: 8,
          }}
        >
          {!collapsed ? (
            <Typography.Title
              level={4}
              style={{ color: "#fff", margin: 0, fontWeight: 600 }}
            >
              🔥 GasKhanhVan
            </Typography.Title>
          ) : (
            <Typography.Title
              level={4}
              style={{ color: "#fff", margin: 0, fontWeight: 600 }}
            >
              🔥
            </Typography.Title>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            {
              key: "1",
              icon: <FireOutlined />,
              label: "Products",
            },
            {
              key: "2",
              icon: <AppstoreAddOutlined />,
              label: "Categories",
            },
            {
              key: "3",
              icon: <GiftOutlined />,
              label: "Incentives",
            },
            {
              key: "4",
              icon: <PictureOutlined />,
              label: "Banners",
            },
            {
              key: "5",
              icon: <StarOutlined />,
              label: "Featured Products",
            },
            {
              key: "6",
              icon: <TagsOutlined />,
              label: "Brands",
            },
            {
              key: "7",
              icon: <FileTextOutlined />,
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
      <Layout
        style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.2s" }}
      >
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 1,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Space>
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
            <Breadcrumb items={breadcrumbItems} />
          </Space>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: "pointer" }} align="center">
              <Avatar
                src={user?.photoURL}
                icon={!user?.photoURL && <UserOutlined />}
                size="large"
              />
              <div>
                <div>
                  <Text strong>{user?.displayName || "Admin"}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {user?.email}
                  </Text>
                </div>
              </div>
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
