import React, {useState, useEffect} from 'react'
import {
  AppstoreAddOutlined,
  FireOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {Breadcrumb, Button, Layout, Menu, theme} from 'antd'
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import ProductMange from '../screens/product/ProductManage'
import CategoryManage from '../screens/category/CategoryManage'
import IncentiveManage from '../screens/incentive/IncentiveManage'

const {Header, Content, Footer, Sider} = Layout

const MainRouter = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken()

  const [selectedKey, setSelectedKey] = useState('1')

  useEffect(() => {
    console.log(location.pathname)
    if (location.pathname.includes('/product')) {
      setSelectedKey('1')
    } else if (location.pathname.includes('/category')) {
      setSelectedKey('2')
    } else if (location.pathname.includes('/incentive')) {
      setSelectedKey('3')
    }
  }, [location.pathname])

  const handleMenuClick = (e: any) => {
    setSelectedKey(e.key)
    if (e.key === '1') navigate('/product')
    else if (e.key === '2') navigate('/category')
    else if (e.key === '3') navigate('/incentive')
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className='demo-logo-vertical' />
        <Menu
          theme='dark'
          mode='inline'
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={[
            {
              key: '1',
              icon: <FireOutlined />,
              label: 'Product',
            },
            {
              key: '2',
              icon: <AppstoreAddOutlined />,
              label: 'Menu Items',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Incentives Items',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{padding: 0, background: colorBgContainer}}>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path='/' element={<ProductMange />} />
            <Route path='/product' element={<ProductMange />} />
            <Route path='/category' element={<CategoryManage />} />
            <Route path='/incentive' element={<IncentiveManage />} />
          </Routes>
        </Content>
        <Footer style={{textAlign: 'center'}}>
          GasKhanhVan Manage ©{new Date().getFullYear()} Created by ttphats
        </Footer>
      </Layout>
    </Layout>
  )
}

export default MainRouter
