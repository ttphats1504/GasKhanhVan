import Navbar from '@/components/common/Navbar'
import {Footer} from 'antd/es/layout/layout'
import React, {ReactNode} from 'react'
import HeadTag from '@/components/home/HeadTag'

import styles from '../styles/home/Home.module.scss'
import {Layout} from 'antd'

type HomeLayoutProps = {
  children: ReactNode
}
const {Content} = Layout

export default function HomeLayout({children}: HomeLayoutProps) {
  return (
    <Layout>
      <HeadTag />
      <Navbar />
      <Content className={styles.container_home}>
        <main>{children}</main>
      </Content>
      <Footer />
    </Layout>
  )
}
