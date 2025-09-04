import {Breadcrumb, Layout, Menu, theme} from 'antd'
import Navbar from '@/components/common/Navbar'
import React, {ReactNode} from 'react'
import HeadTag from '@/components/home/HeadTag'

import styles from '../styles/layouts/CategoryLayout.module.scss'
import Footer from '@/components/common/Footer'

const {Content} = Layout

type CategoryLayoutProps = {
  children: ReactNode
}

export default function CategoryLayout({children}: CategoryLayoutProps) {
  return (
    <Layout>
      <HeadTag />
      <Navbar />
      <Content className={styles.container}>
        <main>{children}</main>
      </Content>
      <Footer />
    </Layout>
  )
}
