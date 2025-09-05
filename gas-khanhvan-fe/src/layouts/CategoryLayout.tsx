import {Breadcrumb, Layout, Menu, theme} from 'antd'
import Navbar from '@/components/common/Navbar'
import React, {ReactNode, useEffect, useState} from 'react'
import HeadTag from '@/components/home/HeadTag'

import styles from '../styles/layouts/CategoryLayout.module.scss'
import Footer from '@/components/common/Footer'

const {Content} = Layout

type CategoryLayoutProps = {
  children: ReactNode
}

export default function CategoryLayout({children}: CategoryLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  // 🔹 Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <Layout>
      <HeadTag />
      <Navbar />
      <Content className={isMobile ? `${styles.container_mobile}` : styles.container}>
        <main>{children}</main>
      </Content>
      <Footer />
    </Layout>
  )
}
