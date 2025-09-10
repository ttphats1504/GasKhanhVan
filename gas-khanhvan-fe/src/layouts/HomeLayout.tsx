import Navbar from '@/components/common/Navbar'
import React, {ReactNode, useEffect, useState} from 'react'
import HeadTag from '@/components/home/HeadTag'

import styles from '../styles/home/Home.module.scss'
import {Layout} from 'antd'
import Footer from '@/components/common/Footer'
import SearchHeader from '@/components/common/SearchHeader'
import ContactSection from '@/components/common/ContactSection'

type HomeLayoutProps = {
  children: ReactNode
}
const {Content} = Layout

export default function HomeLayout({children}: HomeLayoutProps) {
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
      <SearchHeader />
      <Navbar />
      <Content className={isMobile ? `${styles.container_home_mobile}` : styles.container_home}>
        <main>{children}</main>
      </Content>
      <ContactSection />
      <Footer />
    </Layout>
  )
}
