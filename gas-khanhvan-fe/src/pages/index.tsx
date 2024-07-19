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
        <title>Gas Khánh Vân Quận 7</title>
        <meta name='description'>Gas Quận 7. Gas Giá t</meta>
        <meta
          name='google-site-verification'
          content='1576YrYuw5N2zO2oH75ShLXhWDn9rbJAd8DSNBcQYIs'
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
