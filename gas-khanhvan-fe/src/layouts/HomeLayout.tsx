import Navbar from '@/components/common/Navbar'
import React, {ReactNode, useEffect, useState} from 'react'
import HeadTag from '@/components/home/HeadTag'

import styles from '../styles/home/Home.module.scss'
import {Layout} from 'antd'
import Footer from '@/components/common/Footer'
import SearchHeader from '@/components/common/SearchHeader'
import ContactSection from '@/components/common/ContactSection'
import BrandsCarousel from '@/components/common/BrandsCarousel'
import Brand from '@/models/Brand'
import handleAPI from '@/apis/handleAPI'
import Container from '@/components/common/Container'

type HomeLayoutProps = {
  children: ReactNode
}
const {Content} = Layout

export default function HomeLayout({children}: HomeLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null)
  // 🔹 Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res: any = await handleAPI('/api/brands', 'get')
        setBrands(res?.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBrands()
  }, [])
  return (
    <Layout>
      <HeadTag />
      <SearchHeader />
      <Navbar />
      <Content className={isMobile ? `${styles.container_home_mobile}` : styles.container_home}>
        <main>{children}</main>
      </Content>
      <Container>
        {brands.length > 0 && (
          <BrandsCarousel
            brands={brands}
            onSelect={(brandId) => setSelectedBrand(brandId)}
            selectedBrand={selectedBrand}
          />
        )}
      </Container>
      <ContactSection />
      <Footer />
    </Layout>
  )
}
