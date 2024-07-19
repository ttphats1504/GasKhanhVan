import Navbar from '@/components/common/Navbar'
import HeadTag from '../components/home/HeadTag'
import React from 'react'
import PromotionCarousel from '@/components/common/PromotionCarousel'
import Incentives from '@/components/common/IncentivesSection'
import Footer from '@/components/common/Footer'

import styles from '../styles/home/Home.module.scss'
import ProductSection from '@/components/home/ProductSection'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Cửa Hàng Gas Khánh Vân Quận 7</title>
        <meta
          name='google-site-verification'
          content='1576YrYuw5N2zO2oH75ShLXhWDn9rbJAd8DSNBcQYIs'
        />
        <meta
          property='og:title'
          content='Đại lý phân phối gas các quận tại cửa hàng gas Khánh Vân'
        />
        <meta
          property='og:description'
          content='Cửa hàng Gas tại TP.HCM cùng đội ngũ chuyên nghiệp. Chúng tôi cung cấp dịch vụ giao Gas Khánh Vân và lắp đặt miễn phí. Các phụ kiện về Gas gọi là có.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://gas-khanh-van.vercel.app/' />
        <meta
          property='og:image'
          content='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV6JUe_TejYzBFTSUEVdiHsHzVqWOLE1fGXg&s'
        />
      </Head>
      <div className={styles.container}>
        <HeadTag />
        <Navbar />
        <PromotionCarousel />
        <main>
          <div className={styles.top_bg}>
            <Incentives />
            <ProductSection />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
